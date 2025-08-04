import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { fetchContentsRanking } from "@/apis/contentsApi";
import { fetchBasedContent } from "@/apis/recommendApi";

const EntryRouter = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const visitedDate = localStorage.getItem("visitedDate");

    if (visitedDate === today) {
      navigate("/main", { replace: true });
    } else {
      navigate("/intro", { replace: true });

      // 즉시 프리페치 시작 (await 없이)
      const startPrefetch = async () => {
        try {
          console.log("프리페치 시작...");

          // 병렬로 실행
          const prefetchPromises = [
            queryClient.prefetchQuery({
              queryKey: ["contentsRanking", "all", 0],
              queryFn: () => {
                console.log("랭킹 데이터 요청 중...");
                return fetchContentsRanking("all");
              },
              staleTime: 5 * 60 * 1000,
              gcTime: 10 * 60 * 1000,
            }),

            queryClient.prefetchQuery({
              queryKey: ["storyBasedRecommendations", 0, "all"],
              queryFn: () => {
                console.log("추천 데이터 요청 중...");
                return fetchBasedContent(0, "all");
              },
              staleTime: 5 * 60 * 1000,
              gcTime: 10 * 60 * 1000,
            }),
          ];
          await Promise.all(prefetchPromises);
          console.log("프리페치 완료");
        } catch (error) {
          console.error("프리페치 실패", error);
        }
      };

      // 즉시 실행하되 await 하지 않음 (블로킹 방지)
      startPrefetch();
    }
  }, [navigate, queryClient]);

  return null;
};

export default EntryRouter;
