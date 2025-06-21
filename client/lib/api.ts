import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const createVideoAndQA = async (
  title: string,
  chapter: string,
  description: string,
  questions: any[],
  videoFile: File | null
) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("chapter", chapter);
    formData.append("description", description);
    formData.append("questions", JSON.stringify(questions));
    if (videoFile) {
      formData.append("video", videoFile);
    }

    const response = await axiosInstance.post("/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error: any) {
    console.error("Upload Error:", error);
    return { status: error?.response?.status || 500 };
  }
};

export const fetchVideo = async () => {
  try {
    const response = await axiosInstance.get("/video");
    return response.data.data.videos;
  } catch (error) {
    console.error(error);
  }
};

export const fetchQA=async()=>{
    try {
    const response = await axiosInstance.get("/video");
    return response.data.data.questions;
  } catch (error) {
    console.error(error);
  }
}
