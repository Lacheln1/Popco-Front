import { postFilteredContents } from "@/apis/searchApi";
import { PostFilterRequest } from "@/types/Search.types";
import { useMutation } from "@tanstack/react-query";

export const useFilteredContents = () => {
  return useMutation({
    mutationFn: ({
      filter,
      page,
      size,
    }: {
      filter: PostFilterRequest;
      page?: number;
      size?: number;
    }) => postFilteredContents(filter, page, size),
  });
};
