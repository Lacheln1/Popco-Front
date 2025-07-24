import { TabKey } from "@/constants/FilterTabs";
import { Form, Checkbox, Slider } from "antd";
import { motion } from "framer-motion";

const UsageEnvironment = ({
  onChange,
  value,
}: {
  onChange: (key: TabKey, val: any) => void;
  value?: Record<string, any>;
}) => {
  return (
    <motion.div
      key="filter-이용환경"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <Form
        layout="vertical"
        className="p-4"
        onValuesChange={(_, allValues) => onChange("이용환경", allValues)}
        initialValues={{ year: [2024, 2025] }}
      >
        <Form.Item
          label={<span className="text-gray-400">플랫폼</span>}
          name="platform"
        >
          <Checkbox.Group
            options={[
              "넷플릭스",
              "웨이브",
              "티빙",
              "디즈니플러스",
              "쿠팡플레이",
              "Apple TV",
              "U+모바일tv",
            ]}
          />
        </Form.Item>
        <Form.Item
          label={<span className="text-gray-400">공개연도</span>}
          name="year"
        >
          <Slider min={1980} max={2025} step={1} range />
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default UsageEnvironment;
