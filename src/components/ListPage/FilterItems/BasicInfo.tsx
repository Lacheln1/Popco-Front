import { TabKey } from "@/constants/FilterTabs";
import { Form, Checkbox, Slider } from "antd";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BasicInfo = ({
  onChange,
  value,
}: {
  onChange: (key: TabKey, val: Record<string, unknown>) => void;
  value?: Record<string, unknown>;
}) => {
  const [form] = Form.useForm();
  const [rating, setRating] = useState<[number, number]>([0, 5]);

  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        type: value.type,
        genre: value.genre,
      });
      if (Array.isArray(value.rating)) {
        setRating(value.rating as [number, number]);
      }
    }
  }, [form, value]);

  const handleFormChange = (_: unknown, allValues: Record<string, unknown>) => {
    const final = {
      ...allValues,
      rating: value?.rating, // 슬라이더는 따로 처리됨
    };
    onChange("기본정보", final);
  };

  useEffect(() => {
    if (value?.rating && Array.isArray(value.rating)) {
      setRating(value.rating as [number, number]);
    }
  }, [value?.rating]);

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
        className="p-2 pb-0"
        form={form}
        onValuesChange={handleFormChange}
      >
        <Form.Item
          label={<span className="text-gray-400">타입</span>}
          name="type"
        >
          <Checkbox.Group options={["영화", "시리즈/드라마"]} />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-400">장르</span>}
          name="genre"
        >
          <Checkbox.Group
            options={[
              "액션",
              "드라마",
              "가족",
              "코미디",
              "로맨스",
              "공포",
              "미스터리",
            ]}
          />
        </Form.Item>

        <Form.Item label={<span className="text-gray-400">팝콘 별점</span>}>
          <Slider
            range
            min={0}
            max={5}
            step={0.1}
            value={rating}
            onChange={(val: number[]) => setRating(val as [number, number])}
            onAfterChange={(val) => {
              const current = form.getFieldsValue();
              onChange("기본정보", {
                ...current,
                rating: val,
              });
            }}
            tooltip={{ formatter: (val) => `${val}점` }}
          />
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default BasicInfo;
