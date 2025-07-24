import { TabKey } from "@/constants/FilterTabs";
import { Form, Checkbox, Slider } from "antd";
import { useEffect } from "react";

const BasicInfo = ({
  onChange,
  value,
}: {
  onChange: (key: TabKey, val: any) => void;
  value?: Record<string, any>;
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        type: value.type,
        genre: value.genre,
      });
    }
  }, [form, value]);

  const handleFormChange = (_: any, allValues: any) => {
    const final = {
      ...allValues,
      rating: value?.rating, // 슬라이더는 따로 처리됨
    };
    onChange("기본정보", final);
  };

  return (
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
          value={value?.rating ?? [0, 5]} // 태그 삭제되면 자동 초기화
          onChange={(val) => {
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
  );
};

export default BasicInfo;
