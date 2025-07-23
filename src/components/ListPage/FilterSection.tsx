import { DownOutlined } from "@ant-design/icons";
import { JSX, useEffect, useState } from "react";
import { Button, Tag, Space } from "antd";
import { AnimatePresence } from "framer-motion";
import { BasicInfo, Personalization, UsageEnvironment } from "./FilterItems";
import { TAB_LIST, TabKey } from "@/constants/FilterTabs";

const FilterSection = () => {
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<
    Record<TabKey, string | null>
  >({
    기본정보: null,
    이용환경: null,
    개인화: null,
  });

  // 필터 값이 변경될 때 호출
  const handleTagChange = (
    key: TabKey, // 어떤 필터에서 변경되었는지
    value: Record<string, string | string[]>, // 필터 전체 값
  ) => {
    const labels = Object.entries(value)
      .flatMap(([, v]) => {
        if (!v || (Array.isArray(v) && v.length === 0)) return [];
        return Array.isArray(v) ? v : [v];
      })
      .join(", ");
    console.log(value);
    setSelectedTags((prev) => ({ ...prev, [key]: labels }));
  };

  const handleClose = (key: TabKey) => {
    // 해당 탭의 필터 값 초기화
    setSelectedTags((prev) => ({ ...prev, [key]: null }));
  };

  useEffect(() => {
    console.log(selectedTags);
  }, [selectedTags]);

  const filterComponentMap: Record<TabKey, JSX.Element> = {
    기본정보: <BasicInfo onChange={handleTagChange} key="기본정보" />,
    이용환경: <UsageEnvironment onChange={handleTagChange} key="이용환경" />,
    개인화: <Personalization onChange={handleTagChange} key="개인화" />,
  };

  return (
    <div className="m-auto mt-8 w-[700px]">
      <Space style={{ marginBottom: 16 }}>
        {TAB_LIST.map((tab, idx) => (
          <Button
            key={idx}
            type={activeKey === idx ? "primary" : "default"}
            onClick={() => setActiveKey(activeKey === idx ? null : idx)}
          >
            {tab}
            <DownOutlined
              style={{
                marginLeft: 4,
                transition: "transform 0.2s",
                transform:
                  activeKey === idx ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </Button>
        ))}
      </Space>
      <AnimatePresence initial={false}>
        {typeof activeKey === "number" &&
          filterComponentMap[TAB_LIST[activeKey]]}
      </AnimatePresence>
      <div style={{ marginTop: 16 }}>
        {TAB_LIST.map((key) =>
          selectedTags[key] ? (
            <Tag
              key={key}
              closable
              onClose={() => handleClose(key)}
              style={{ marginBottom: 8 }}
            >
              {`${key}: ${selectedTags[key]}`}
            </Tag>
          ) : null,
        )}
      </div>
    </div>
  );
};

export default FilterSection;
