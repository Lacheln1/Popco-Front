import { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import Poster from "../common/Poster";
import { ContentCategory, ReactionType } from "@/types/Contents.types";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";
import { useStoryBasedRecommendations } from "@/hooks/queries/contents/useStoryBasedRecommendations";
import { useContentReaction } from "@/hooks/queries/contents/useContentReaction";

interface Props {
  accessToken: string;
  userId: number;
  type: ContentCategory;
  title: string;
}

const HeroTop1 = ({ accessToken, userId, type, title }: Props) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const { data = [], isLoading } = useStoryBasedRecommendations(
    userId === 0 ? null : userId,
    type,
    accessToken,
  );

  // useMemo를 통해 contentList 생성 (data가 있을 때만)
  const contentList = useMemo(
    () =>
      data.map((item) => ({
        id: item.content_id,
        reaction: item.user_reaction as ReactionType,
      })),
    [data],
  );

  // useContentReaction은 data가 준비된 이후에 실행
  const { reactionMap, handleReaction, isLoading: isReactionLoading } = useContentReaction({
    userId,
    accessToken,
    contentList,
  });

  const handleSwiperInit = (swiper: SwiperType) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="m-auto w-full max-w-[1200px] px-3 md:px-6 lg:px-0">
      <h3 className="gmarket flex flex-wrap items-center gap-2 text-xl leading-snug sm:text-2xl md:text-[28px]">
        <span className="whitespace-nowrap">
          TOP 1 <strong className="text-popcorn-box">'{title}'</strong>와
        </span>
        <span>비슷한 작품이에요</span>
      </h3>
      <section>
        <div className="mb-4 flex justify-end">
          <SwiperNavigation
            swiper={swiperInstance}
            isBeginning={isBeginning}
            isEnd={isEnd}
          />
        </div>
        {isLoading ? (
          <div className="text-center text-white">로딩 중...</div>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={15}
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
            breakpoints={{
              0: {
                slidesPerView: 2.5,
              },
              768: {
                slidesPerView: 3.5,
              },
              1024: {
                slidesPerView: 4.5,
              },
              1200: {
                slidesPerView: 5,
              },
            }}
          >
            {data.map((content) => (
              <SwiperSlide
                key={content.content_id}
                className="flex justify-center"
              >
                <Poster
                  title={content.title}
                  posterUrl={`${TMDB_IMAGE_BASE_URL}${content.poster_path}`}
                  id={content.content_id}
                  contentType={content.content_type}
                  likeState={reactionMap[content.content_id] ?? "NEUTRAL"}
                  onLikeChange={(newState) =>
                    handleReaction(
                      content.content_id,
                      newState,
                      content.content_type,
                    )
                  }
                  disabled={isReactionLoading} // disabled prop 추가
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>
    </div>
  );
};

export default HeroTop1;