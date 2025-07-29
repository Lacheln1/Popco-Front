import { useQuery } from "@tanstack/react-query";
import { CollectionProps } from "@/types/Collection.types";
import { fetchCollectionsWeekly } from "@/apis/collectionApi";

export const useWeeklyCollections = (limit: number) => {
  return useQuery<CollectionProps[]>({
    queryKey: ["weeklyCollections"],
    queryFn: () => fetchCollectionsWeekly(limit),
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 13,
    retry: 1,
  });
};
