import Video from "../models/Video";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import Question from "@/models/Question";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createVideo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, description, chapter } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    if (file.size > 5 * 1024 * 1024) {
      return res
        .status(400)
        .json({ error: "Video size must be less than 5MB" });
    }

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "sundayschool_demo",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    const video = await Video.create({
      title,
      description,
      chapter,
      video_url: uploadResult.secure_url,
    });

    const questions = JSON.parse(req.body.questions || "[]");
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "No valid questions provided" });
    }

    const questionEntries = questions.map((q: any) => ({
      video: video._id,
      question_id: q.id,
      question_text: q.question,
      option_a: q.options[0],
      option_b: q.options[1],
      option_c: q.options[2],
      option_d: q.options[3],
      correct_answer: q.correctAnswer,
    }));

    await Question.insertMany(questionEntries);

    return res.status(201).json({
      message: "Video and questions created successfully",
      videoUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getVideosAndQuestions = async (_req: Request, res: Response) => {
  const videos = await Video.find().lean();
  const questions = await Question.find().populate("video").lean();
  res.status(200).json({
    data: {
      videos,
      questions,
    },
  });
};
