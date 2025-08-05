import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "@/apis/contentsApi";
import { App } from "antd";

// 사용자의 전체 위시리스트를 가져오는 훅
export const useFetchWishlist = (
  userId?: number,
  accessToken?: string | null,
) => {
  return useQuery({
    queryKey: ["wishlist", userId],
    queryFn: () => fetchWishlist(userId!),
    enabled: !!userId && !!accessToken,
    staleTime: 1000 * 60 * 5,
  });
};

// 위시리스트 토글(추가/삭제)을 위한 훅
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: async (variables: {
      isWished: boolean; // 현재 위시리스트에 있는지 여부
      userId: number;
      contentId: number;
      contentType: string;
      accessToken: string;
    }) => {
      const { isWished, ...apiParams } = variables;
      if (isWished) {
        // 이미 추가되어 있으면 삭제 API 호출
        return removeFromWishlist(apiParams);
      } else {
        // 추가되어 있지 않으면 추가 API 호출
        return addToWishlist(apiParams);
      }
    },
    onSuccess: (_data, variables) => {
      const { isWished, userId } = variables;
      if (isWished) {
        message.success("'보고싶어요'에서 삭제했습니다.");
      } else {
        message.success("'보고싶어요'에 추가했습니다.");
      }
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "요청에 실패했습니다.";
      message.error(errorMessage);
    },
  });
};
