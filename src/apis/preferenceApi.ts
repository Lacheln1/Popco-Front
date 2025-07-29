// src/apis/preferenceApi.ts

// 실제 API를 호출하기 위해 axiosInstance를 import합니다.
// import axiosInstance from "./axiosInstance";

// Movie 데이터 타입을 정의합니다.
export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
}

// 임시 영화 데이터 (기존 TestPage에 있던 데이터를 이곳으로 옮겨 관리합니다)
const tempMovieData: Movie[] = Array.from({ length: 40 }, (_, i) => ({
  id: `movie_${i + 1}`,
  title: `임시 영화 제목 ${i + 1}`,
  posterUrl: `https://picsum.photos/seed/${i + 1}/200/300`,
}));


/**
 * 선호도 테스트에 사용할 영화 목록을 가져오는 API
 * (현재는 임시 데이터를 반환합니다. 실제 백엔드 연동 시 아래 주석 처리된 코드를 사용하세요.)
 */
export const getTestMovies = async (): Promise<Movie[]> => {
  console.log("Fetching temporary movie data for test...");
  
  // 가짜 네트워크 지연시간(0.5초)을 시뮬레이션하여 실제 API 호출처럼 보이게 합니다.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tempMovieData);
    }, 500);
  });

  /*
  // --- 실제 백엔드 API가 준비되었을 때 사용할 코드 ---
  try {
    // 실제 백엔드 엔드포인트로 수정해야 합니다. (예: /movies/for-preference)
    const response = await axiosInstance.get<{ data: Movie[] }>("/movies/test"); 
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    // 에러를 상위로 전파하여 호출한 컴포넌트에서 처리하도록 합니다.
    throw error;
  }
  */
};
