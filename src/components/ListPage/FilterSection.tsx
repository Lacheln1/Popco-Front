import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
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

  // 초기값
  const INITIAL_BASIC_INFO = {
    type: "" as string,
    genre: [] as string[],
    rating: null as [number, number] | null,
  };

  const INITIAL_USAGE_ENV = {
    platform: [] as string[],
    year: null as [number, number] | null,
  };

  const INITIAL_PERSONALIZATION = {
    age: null as [number, number] | null,
    persona: [] as string[],
    algorithm: [] as string[],
  };

  const [basicInfo, setBasicInfo] = useState(INITIAL_BASIC_INFO);
  const [usageEnv, setUsageEnv] = useState(INITIAL_USAGE_ENV);
  const [personalization, setPersonalization] = useState(
    INITIAL_PERSONALIZATION,
  );

  const { setFilter, markTouched } = useFilterStore();

  const isValidValue = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") {
      // 빈 문자열이 아닌 문자열은 유효
      return value.trim() !== "";
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return false;
      // 슬라이더 범위값인 경우 (숫자 배열이고 길이가 2)
      if (value.length === 2 && value.every((v) => typeof v === "number")) {
        return true; // 슬라이더 값은 항상 유효
      }
      return value.length > 0;
    }
    return true;
  };

  const getChangedValues = () => {
    const changedBasicInfo: any = {};
    const changedUsageEnv: any = {};
    const changedPersonalization: any = {};

    // basicInfo 처리
    Object.entries(basicInfo).forEach(([key, value]) => {
      const initialValue =
        INITIAL_BASIC_INFO[key as keyof typeof INITIAL_BASIC_INFO];
      const isDifferent =
        JSON.stringify(value) !== JSON.stringify(initialValue);
      const isValid = isValidValue(value);

      if (isDifferent && isValid) {
        changedBasicInfo[key] = value;
      }
    });

    // usageEnv 처리
    Object.entries(usageEnv).forEach(([key, value]) => {
      const initialValue =
        INITIAL_USAGE_ENV[key as keyof typeof INITIAL_USAGE_ENV];
      const isDifferent =
        JSON.stringify(value) !== JSON.stringify(initialValue);
      const isValid = isValidValue(value);

      if (isDifferent && isValid) {
        changedUsageEnv[key] = value;
      }
    });

    // personalization 처리
    Object.entries(personalization).forEach(([key, value]) => {
      const initialValue =
        INITIAL_PERSONALIZATION[key as keyof typeof INITIAL_PERSONALIZATION];
      const isDifferent =
        JSON.stringify(value) !== JSON.stringify(initialValue);
      const isValid = isValidValue(value);

      if (isDifferent && isValid) {
        changedPersonalization[key] = value;
      }
    });

    const result = {
      basicInfo: changedBasicInfo,
      usageEnv: changedUsageEnv,
      personalization: changedPersonalization,
    };

    return result;
  };

  const filterComponentMap: Record<TabKey, React.ReactNode> = {
    기본정보: (
      <BasicInfo
        onChange={(_, val) => {
          const newBasicInfo = {
            type: val.type as string,
            genre: val.genre as string[],
            rating: val.rating as [number, number] | null,
          };
          setBasicInfo(newBasicInfo);
        }}
        value={basicInfo}
      />
    ),
    이용환경: (
      <UsageEnvironment
        onChange={(_, val) => {
          const newUsageEnv = {
            platform: val.platform as string[],
            year: val.year as [number, number] | null,
          };
          setUsageEnv(newUsageEnv);
        }}
        value={usageEnv}
      />
    ),
    개인화: (
      <Personalization
        onChange={(_, val) => {
          const newPersonalization = {
            age: val.age as [number, number] | null,
            persona: val.persona as string[],
            algorithm: val.algorithm as string[],
          };
          setPersonalization(newPersonalization);
        }}
        value={personalization}
      />
    ),
  };

  useEffect(() => {
    const changedValues = getChangedValues();
    const hasChanges =
      Object.keys(changedValues.basicInfo).length > 0 ||
      Object.keys(changedValues.usageEnv).length > 0 ||
      Object.keys(changedValues.personalization).length > 0;

    if (hasChanges) {
      const newBody = buildFilterRequestBody(changedValues);
      setFilter(newBody);
      markTouched();
    } else {
      setFilter({});
    }
  }, [basicInfo, usageEnv, personalization, setFilter, markTouched]);

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
