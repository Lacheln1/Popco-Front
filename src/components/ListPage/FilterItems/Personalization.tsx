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
  const [isAgeTouched, setIsAgeTouched] = useState(false); // 슬라이더 터치 여부 추적

  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        algorithm: value.algorithm,
        persona: value.persona,
      });

      // value에서 age가 null이 아닌 실제 값이 있을 때만 설정
      if (value.age && Array.isArray(value.age)) {
        setAge(value.age as [number, number]);
        setIsAgeTouched(true);
      } else {
        // null이면 터치되지 않은 상태로 초기화
        setIsAgeTouched(false);
      }
    }
  }, [form, value]);

  const handleFormChange = (_: unknown, allValues: Record<string, unknown>) => {
    const final = {
      ...allValues,
      age: isAgeTouched ? age : null, // 터치된 경우에만 age 포함
    };
    onChange("개인화", final);
  };

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
            onChangeComplete={(val) => {
              setIsAgeTouched(true); // 사용자가 조작했음을 표시
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
            options={[
              "액션헌터",
              "무비셜록",
              "시네파울보",
              "온기수집가",
              "이세계유랑자",
              "무서워도본다맨",
              "레트로캡틴",
            ]}
          />
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default Personalization;
