import { DownOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { Button, Space } from "antd";
import { AnimatePresence } from "framer-motion";
import { TAB_LIST, TabKey } from "@/constants/FilterTabs";
import BasicInfo from "./FilterItems/BasicInfo";
import UsageEnvironment from "./FilterItems/UsageEnvironment";
import Personalization from "./FilterItems/Personalization";
import { buildFilterRequestBody } from "@/utils/buildFilterRequestBody";
import { useFilterStore } from "@/store/useFilterStore";

const FilterSection = () => {
  const [activeKey, setActiveKey] = useState<number | null>(null);

  // 초기값을 상수로 정의
  const INITIAL_BASIC_INFO = {
    type: "" as string,
    genre: [] as string[],
    rating: [0, 5] as [number, number],
  };

  const INITIAL_USAGE_ENV = {
    platform: [] as string[],
    year: [1980, 2025] as [number, number],
  };

  const INITIAL_PERSONALIZATION = {
    age: [0, 65] as [number, number],
    persona: [] as string[],
    algorithm: [] as string[],
  };

  // 개별 상태
  const [basicInfo, setBasicInfo] = useState(INITIAL_BASIC_INFO);
  const [usageEnv, setUsageEnv] = useState(INITIAL_USAGE_ENV);
  const [personalization, setPersonalization] = useState(
    INITIAL_PERSONALIZATION,
  );

  const { setFilter, markTouched } = useFilterStore();

  // 값이 초기값과 다른지 체크하는 함수
  const isValueChanged = (current: any, initial: any): boolean => {
    return JSON.stringify(current) !== JSON.stringify(initial);
  };

  const hasAnyChange = () => {
    return (
      isValueChanged(basicInfo, INITIAL_BASIC_INFO) ||
      isValueChanged(usageEnv, INITIAL_USAGE_ENV) ||
      isValueChanged(personalization, INITIAL_PERSONALIZATION)
    );
  };

  useEffect(() => {
    const newBody = buildFilterRequestBody({
      basicInfo,
      usageEnv,
      personalization,
    });
    if (hasAnyChange()) {
      setFilter(newBody);
      markTouched();
    }
  }, [basicInfo, usageEnv, personalization, setFilter, markTouched]);

  const filterComponentMap: Record<TabKey, React.ReactNode> = {
    기본정보: (
      <BasicInfo
        onChange={(_, val) =>
          setBasicInfo({
            type: val.type as string,
            genre: val.genre as string[],
            rating: val.rating as [number, number],
          })
        }
        value={basicInfo}
      />
    ),
    이용환경: (
      <UsageEnvironment
        onChange={(_, val) =>
          setUsageEnv({
            platform: val.platform as string[],
            year: val.year as [number, number],
          })
        }
        value={usageEnv}
      />
    ),
    개인화: (
      <Personalization
        onChange={(_, val) =>
          setPersonalization({
            age: val.age as [number, number],
            persona: val.persona as string[],
            algorithm: val.algorithm as string[],
          })
        }
        value={personalization}
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
            className={`rounded-full border border-gray-300 px-2 py-1 text-gray-600 transition-colors duration-200 sm:px-4 ${
              activeKey === idx
                ? "bg-popco-hair border-none text-black"
                : "hover:bg-orange-100 hover:text-orange-500"
            }`}
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
    </div>
  );
};

export default FilterSection;
