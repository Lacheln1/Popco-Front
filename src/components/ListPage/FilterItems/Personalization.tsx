import { TabKey } from "@/constants/FilterTabs";
import { Form, Checkbox, Slider } from "antd";
import { motion } from "framer-motion";

const Personalization = ({
  onChange,
  value,
}: {
  onChange: (key: TabKey, val: any) => void;
  value?: Record<string, any>;
}) => {
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
        className="p-4"
        onValuesChange={(_, allValues) => onChange("개인화", allValues)}
        initialValues={{ age: [20, 40] }}
      >
        <Form.Item
          label={<span className="text-gray-400">연령대</span>}
          name="age"
        >
          <Slider
            min={0}
            max={65}
            step={1}
            range
            tooltip={{ formatter: (value) => `${value}세` }}
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
