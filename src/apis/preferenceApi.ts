import axios from "axios";

export interface Movie {
  id: string;
  title: string;
  posterPath: string;
  type: string;
}

interface ApiResponse {
  data: {
    contents: Movie[];
  };
}

export const getTestMovies = async (
  accessToken: string,
): Promise<{ contents: Movie[] }> => {
  try {
    const response = await axios.get<ApiResponse>(
      "/api/client/contents/preferences",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("선호도 진단 콘텐츠 조회 실패:", error);
    throw error;
  }
};
