import { useCallback } from "react";
import { App } from "antd";
import HotCollection from "../common/HotCollection";
import {
  useFetchCollectionsWeekly,
  useToggleMarkCollection,
} from "@/hooks/useCollections";
import useAuthCheck from "@/hooks/useAuthCheck";
import { CollectionProps } from "@/types/Collection.types";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";
import { useNavigate } from "react-router-dom";

const HeroCollection = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { user, accessToken } = useAuthCheck();
  const { data, isLoading, isError } = useFetchCollectionsWeekly(
    3,
    accessToken,
  );
  const { mutate: toggleMark } = useToggleMarkCollection();

  const handleSaveToggle = useCallback(
    (collectionId: number) => {
      if (!user.isLoggedIn) {
        message.warning("로그인이 필요한 기능입니다.");
        navigate("/login");
        return;
      }
      toggleMark({
        collectionId: String(collectionId),
        accessToken: accessToken!,
      });
    },
    [user.isLoggedIn, accessToken, toggleMark, navigate, message],
  );

  return (
    <section>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between overflow-x-hidden px-3 md:flex-row md:gap-4 md:px-6 lg:gap-16 xl:px-0">
        <div className="flex flex-col gap-6 2xl:w-[550px]">
          <div>
            <div className="text-popco-foot mb-3 text-lg font-bold">HOT</div>
            <h1 className="gmarket break-keep text-2xl font-medium sm:text-3xl lg:text-4xl">
              POPCO의
              <br />
              HOT한 컬렉션을 만나보세요
            </h1>
          </div>
          <div className="min-w-[350px] break-keep text-base lg:min-w-[440px] lg:text-lg">
            보고 싶은 콘텐츠, 추천하고 싶은 시리즈, 그리고 나만의 테마까지!
            <br />
            POPCO에서 당신만의 OTT 컬렉션을 만들어 공유해보세요.
          </div>
          <button
            onClick={() => navigate("/collections")}
            className="text-popco-foot border-popco-foot hidden w-fit rounded-full border-solid px-7 py-4 text-base md:block"
          >
            View more +
          </button>
        </div>

        <div className="flex gap-3 px-4 pb-5 pt-12 sm:gap-6 md:gap-8 md:p-0 lg:gap-12">
          {isLoading ? (
            <div className="text-base text-gray-400">Loading...</div>
          ) : isError ? (
            <div className="text-base text-red-500">
              데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
            </div>
          ) : (
            data?.map((collection: CollectionProps, index: number) => (
              <div key={collection.collectionId} className="relative">
                <span className="absolute -left-4 -top-6 z-10 font-mono text-[50px] font-bold text-transparent text-white drop-shadow-lg [-webkit-text-stroke:3px_#FFD751] lg:text-[70px]">
                  {index + 1}
                </span>
                <HotCollection
                  collectionId={collection.collectionId}
                  title={collection.title}
                  posters={collection.contentPosters
                    .slice(0, 4)
                    .map((p) => `${TMDB_IMAGE_BASE_URL}${p.posterPath}`)}
                  saveCount={collection.saveCount}
                  isSaved={collection.isMarked}
                  href={`/collections/${collection.collectionId}`}
                  onSaveToggle={() => handleSaveToggle(collection.collectionId)}
                  size="small"
                />
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate("/collections")}
          className="text-popco-foot w-fit rounded-full border-solid px-7 py-4 text-base text-white md:hidden"
        >
          View more +
        </button>
      </div>
    </section>
  );
};

export default HeroCollection;
