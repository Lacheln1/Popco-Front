import { Form, Checkbox, Slider } from "antd";
import { motion } from "framer-motion";

type TabKey = "기본정보" | "이용환경" | "개인화";

const Personalization = ({
  onChange,
}: {
  onChange: (key: TabKey, val: any) => void;
}) => {
  return (
    <motion.div
      key="filter-개인화"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      <Form
        layout="vertical"
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

const UsageEnvironment = ({
  onChange,
}: {
  onChange: (key: TabKey, val: any) => void;
}) => {
  return (
    <motion.div
      key="filter-이용환경"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      <Form
        layout="vertical"
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

const BasicInfo = ({
  onChange,
}: {
  onChange: (key: TabKey, val: any) => void;
}) => {
  return (
    <motion.div
      key="filter-기본정보"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      <Form
        layout="vertical"
        onValuesChange={(_, allValues) => onChange("기본정보", allValues)}
        initialValues={{
          rating: [0, 5],
        }}
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
        <Form.Item
          label={<span className="text-gray-400">팝콘 별점</span>}
          name="rating"
        >
          <Slider min={0} max={5} step={0.1} range />
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export { BasicInfo, Personalization, UsageEnvironment };
