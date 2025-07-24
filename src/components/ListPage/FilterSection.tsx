import { DownOutlined } from "@ant-design/icons";
import { JSX, useEffect, useState } from "react";
import { Button, Tag, Space } from "antd";
import { AnimatePresence } from "framer-motion";
import { TAB_LIST, TabKey } from "@/constants/FilterTabs";
import BasicInfo from "./FilterItems/BasicInfo";
import UsageEnvironment from "./FilterItems/UsageEnvironment";
import Personalization from "./FilterItems/Personalization";
import { parseRatingFromTag, formatRatingTag } from "@/utils/filterUtils";

const FilterSection = () => {
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<Record<TabKey, string[]>>({
    기본정보: [],
    이용환경: [],
    개인화: [],
  });

  const handleTagChange = (
    key: TabKey,
    value: Record<string, string | string[] | [number, number]>,
  ) => {
    const labels = Object.entries(value).flatMap(([k, v]) => {
      if (v == null) return [];
      if (Array.isArray(v)) {
        if (k === "rating" && typeof v[0] === "number") {
          return [formatRatingTag(v as [number, number])];
        }
        return v;
      }
      return [v];
    });

    setSelectedTags((prev) => ({
      ...prev,
      [key]: labels,
    }));
  };

  const handleClose = (tabKey: TabKey, tagValue: string) => {
    setSelectedTags((prev) => {
      const updated = prev[tabKey].filter((tag) => tag !== tagValue);
      return {
        ...prev,
        [tabKey]: updated,
      };
    });
  };

  const filterComponentMap: Record<TabKey, JSX.Element> = {
    기본정보: (() => {
      const tags = selectedTags["기본정보"];
      const ratingTag = tags.find((v) => v.includes("팝콘 별점"));

      return (
        <BasicInfo
          onChange={handleTagChange}
          value={{
            type: tags.filter((v) => ["영화", "시리즈/드라마"].includes(v)),
            genre: tags.filter((v) =>
              [
                "액션",
                "드라마",
                "가족",
                "코미디",
                "로맨스",
                "공포",
                "미스터리",
              ].includes(v),
            ),
            rating: ratingTag ? parseRatingFromTag(ratingTag) : undefined,
          }}
          key="기본정보"
        />
      );
    })(),
    이용환경: (
      <UsageEnvironment
        onChange={handleTagChange}
        value={{
          platform: selectedTags["이용환경"].filter((v) =>
            [
              "넷플릭스",
              "웨이브",
              "티빙",
              "디즈니플러스",
              "쿠팡플레이",
              "Apple TV",
              "U+모바일tv",
            ].includes(v),
          ),
        }}
        key="이용환경"
      />
    ),
    개인화: (
      <Personalization
        onChange={handleTagChange}
        value={{
          algorithm: selectedTags["개인화"].filter(
            (v) => v === "나에게 딱인 컨텐츠 !",
          ),
          persona: selectedTags["개인화"].filter((v) =>
            ["액션헌터", "온기수집가", "무서워도 본다맨"].includes(v),
          ),
        }}
        key="개인화"
      />
    ),
  };

  return (
    <div className="m-auto mt-6 px-4 md:w-[700px]">
      <Space className="mb-2 gap-4">
        {TAB_LIST.map((tab, idx) => (
          <Button
            type="text"
            key={idx}
            onClick={() => setActiveKey(activeKey === idx ? null : idx)}
            className={`rounded-full border border-gray-300 px-2 py-1 text-gray-600 transition-colors duration-200 sm:px-4 ${activeKey === idx ? "bg-popco-hair border-none text-black" : "hover:bg-orange-100 hover:text-orange-500"} `}
          >
            {tab}
            <DownOutlined
              className={`ml-1 transition-transform duration-200 ${
                activeKey === idx
                  ? "rotate-180 text-gray-700"
                  : "rotate-0 text-gray-400"
              }`}
            />
          </Button>
        ))}
      </Space>
      <AnimatePresence initial={false}>
        {typeof activeKey === "number" &&
          filterComponentMap[TAB_LIST[activeKey]]}
      </AnimatePresence>
      <div className="flex w-full flex-wrap break-words">
        {TAB_LIST.flatMap((tabKey) =>
          selectedTags[tabKey].map((tagValue) => (
            <Tag
              key={`${tabKey}-${tagValue}`}
              closable
              className="mb-2 max-w-full whitespace-normal break-words"
              onClose={() => handleClose(tabKey, tagValue)}
            >
              {`${tagValue}`}
            </Tag>
          )),
        )}
      </div>
    </div>
  );
};

export default FilterSection;
