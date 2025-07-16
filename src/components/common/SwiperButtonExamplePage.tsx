import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SwiperButtonExamplePage: React.FC = () => {
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(undefined);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    //swiper 초기화 완료 시 실행되는 콜백함수. 초기화 안하면 undefined 상태가 되어 작동안함
    const handleSwiperInit = (swiper: SwiperType) => {
        console.log("초기화됨:", swiper);
        setSwiperInstance(swiper);
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    const handleSlideChange = (swiper: SwiperType) => {
        console.log("슬라이드 변경:", swiper.activeIndex);
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
        setCurrentSlide(swiper.activeIndex);
    };

    // 샘플 데이터 (추후 api를 통해 받아온 데이터를 넣으면 됨.)
    // 한 페이지에 여러 swiper를 쓸 경우 sliedsData2 이런식으로 여러개 만들고 할당
    // ex: 메인페이지 맨 위에 swiper는 BannerData=[{}]로 하고 swiper사용. 아래의 비슷한 작품 섹션에서는 ContentData=[{}]를 만들고 api를 통해 받아온 데이터 작성 후 swiper 선언하여 사용
    const slidesData = [
        {
            id: 1,
            title: "첫 번째 슬라이드",
            content: "이것은 첫 번째 슬라이드입니다.",
            bgColor: "bg-green-500",
        },
        {
            id: 2,
            title: "두 번째 슬라이드",
            content: "이것은 두 번째 슬라이드입니다.",
            bgColor: "bg-green-500",
        },
        {
            id: 3,
            title: "세 번째 슬라이드",
            content: "이것은 세 번째 슬라이드입니다.",
            bgColor: "bg-purple-500",
        },
        {
            id: 4,
            title: "네 번째 슬라이드",
            content: "이것은 네 번째 슬라이드입니다.",
            bgColor: "bg-red-500",
        },
        {
            id: 5,
            title: "다섯 번째 슬라이드",
            content: "이것은 다섯 번째 슬라이드입니다.",
            bgColor: "bg-yellow-500",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <SwiperNavigation
                        swiper={swiperInstance}
                        isBeginning={isBeginning}
                        isEnd={isEnd}
                    />
                </div>

                <div className="mb-8">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        onSwiper={handleSwiperInit}
                        onSlideChange={handleSlideChange}
                        pagination={{
                            clickable: true,
                        }}
                        className="rounded-lg shadow-lg"
                        style={{ height: "400px" }}
                    >
                        {slidesData.map((data) => (
                            <SwiperSlide key={data.id}>
                                <div
                                    className={`${data.bgColor} text-white p-12 rounded-lg h-full flex items-center justify-center`}
                                >
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold mb-4">{data.title}</h3>
                                        <p className="text-lg opacity-90">{data.content}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default SwiperButtonExamplePage;
