import { TabKey } from "@/constants/FilterTabs";
import { Form, Checkbox, Slider, Radio } from "antd";
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
  const [isRatingTouched, setIsRatingTouched] = useState(false); // 슬라이더 터치 여부 추적

  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        type: value.type,
        genre: value.genre,
      });

      // value에서 rating이 null이 아닌 실제 값이 있을 때만 설정
      if (value.rating && Array.isArray(value.rating)) {
        setRating(value.rating as [number, number]);
        setIsRatingTouched(true);
      } else {
        // null이면 터치되지 않은 상태로 초기화
        setIsRatingTouched(false);
      }
    }
  }, [form, value]);

  const handleFormChange = (_: unknown, allValues: Record<string, unknown>) => {
    const final = {
      ...allValues,
      rating: isRatingTouched ? rating : null, // 터치된 경우에만 rating 포함
    };
    onChange("기본정보", final);
  };

  return (
    <motion.div
      key="filter-기본정보"
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
          <Radio.Group
            options={[
              { label: "영화", value: "movie" },
              { label: "시리즈/드라마", value: "tv" },
            ]}
          />
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
            onChangeComplete={(val) => {
              setIsRatingTouched(true); // 사용자가 조작했음을 표시
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
