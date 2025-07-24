import { TabKey } from "@/constants/FilterTabs";
import { Form, Checkbox, Slider } from "antd";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Personalization = ({
  onChange,
  value,
}: {
  onChange: (key: TabKey, val: Record<string, unknown>) => void;
  value?: Record<string, unknown>;
}) => {
  const [form] = Form.useForm();
  const [age, setAge] = useState<[number, number]>([0, 65]);

  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        algorithm: value.algorithm,
        persona: value.persona,
      });
      if (Array.isArray(value.age)) {
        setAge(value.age as [number, number]);
      }
    }
  }, [form, value]);

  const handleFormChange = (_: unknown, allValues: Record<string, unknown>) => {
    const final = {
      ...allValues,
      age: value?.age,
    };
    onChange("개인화", final);
  };

  useEffect(() => {
    if (value?.age && Array.isArray(value.age)) {
      setAge(value.age as [number, number]);
    }
  }, [value?.age]);

  return (
    <motion.div
      key="filter-개인화"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <Form
        layout="vertical"
        className="p-2 pb-0"
        form={form}
        onValuesChange={handleFormChange}
      >
        <Form.Item label={<span className="text-gray-400">연령대</span>}>
          <Slider
            range
            min={0}
            max={65}
            step={1}
            value={age}
            onChange={(val: number[]) => setAge(val as [number, number])}
            onAfterChange={(val) => {
              const current = form.getFieldsValue();
              onChange("개인화", {
                ...current,
                age: val,
              });
            }}
            tooltip={{ formatter: (val) => `${val}살` }}
          />
        </Form.Item>
        <Form.Item
          label={<span className="text-gray-400">팝코리즘</span>}
          name="algorithm"
        >
          <Checkbox.Group options={["나에게 딱인 컨텐츠 !"]} />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-400">취향분석</span>}
          name="persona"
        >
          <Checkbox.Group
            options={["액션헌터", "온기수집가", "무서워도 본다맨"]}
          />
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default Personalization;
