import axios from "axios";

export interface Movie {
  id: string;
  title: string;
  posterPath: string;
}

export const getTestMovies = async (accessToken: string): Promise<Movie[]> => {
  try {
    const response = await axios.get<{ data: Movie[] }>(
      "/api/client/contents/preferences", 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 헤더에 토큰 직접 추가
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
