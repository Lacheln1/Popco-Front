import { TabKey } from "@/constants/FilterTabs";
import { Form, Checkbox, Slider } from "antd";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const UsageEnvironment = ({
  onChange,
  value,
}: {
  onChange: (key: TabKey, val: Record<string, unknown>) => void;
  value?: Record<string, unknown>;
}) => {
  const [form] = Form.useForm();
  const [year, setYear] = useState<[number, number]>([1980, 2025]);

  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        platform: value.platform,
      });
      if (Array.isArray(value.year)) {
        setYear(value.year as [number, number]);
      }
    }
  }, [form, value]);

  const handleFormChange = (_: unknown, allValues: Record<string, unknown>) => {
    const final = {
      ...allValues,
      year: value?.year, // 슬라이더는 따로 관리됨
    };
    onChange("이용환경", final);
  };

  useEffect(() => {
    if (value?.year && Array.isArray(value.year)) {
      setYear(value.year as [number, number]);
    }
  }, [value?.year]);

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
        form={form}
        onValuesChange={handleFormChange}
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

        <Form.Item label={<span className="text-gray-400">공개연도</span>}>
          <Slider
            range
            min={1980}
            max={2025}
            step={1}
            value={year}
            onChange={(val) => setYear(val as [number, number])}
            onChangeComplete={(val) => {
              const current = form.getFieldsValue();
              onChange("이용환경", {
                ...current,
                year: val as [number, number],
              });
            }}
            tooltip={{ formatter: (val) => `${val}년` }}
          />
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default UsageEnvironment;
