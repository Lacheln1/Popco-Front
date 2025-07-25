import { Modal } from "antd";
import PopcornRating from "../common/PopcornRating";
import { Input, Avatar, Checkbox, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { CheckboxProps } from "antd/lib";

type reviewProps = {
  isModalOpen: boolean; // 모달 열렸는지
  isMine: boolean; // 내가 쓴 글인지
  isWriting: boolean; // 리뷰 쓰기인지
  contentsTitle: string; // 컨텐츠 제목
  contentsImg: string; // 컨텐츠 이미지
  popcorn: number; // 팝콘(별점) 개수
  author: string; // 리뷰 작성자
  likeCnt: number; // 리뷰 좋아요 수
  setIsModalOpen: (val: boolean) => void; // 모달 열고 닫기 함수
};

const ReviewModal = ({ isModalOpen, setIsModalOpen }: reviewProps) => {
  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { TextArea } = Input;

  return (
    <Modal
      centered
      className="review-modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      styles={{
        footer: {
          justifySelf: "center",
        },
      }}
      footer={[
        <div className="flex w-full justify-center gap-4">
          <Button
            className="rounded-3xl px-10 py-5 text-base"
            key="back"
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button
            className="rounded-3xl px-10 py-5 text-base"
            key="submit"
            type="primary"
            onClick={handleOk}
          >
            등록
          </Button>
        </div>,
      ]}
    >
      <div className="center flex gap-4">
        <img
          className="w-20 rounded-md 2sm:w-24"
          src="https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg"
          alt="제목으로 변경"
        />
        <div className="flex flex-col gap-2 self-center">
          <div className="text-xl font-semibold">F1 더 무비</div>
          <PopcornRating />
        </div>
      </div>
      <div className="relative">
        <TextArea
          placeholder="리뷰를 남겨주세요"
          maxLength={250}
          showCount
          rows={10}
          className="mb-8 mt-4 h-[230px] w-full rounded-lg bg-slate-50 2sm:h-[280px]"
          style={{
            backgroundColor: "#f8fafc",
            padding: "3rem 1rem 1rem 1rem",
            outline: "none",
            boxShadow: "none",
            borderColor: "transparent",
          }}
        />
        <div className="absolute left-6 top-8 z-10 flex w-11/12 justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Avatar size="small" icon={<UserOutlined />} />
            <span>너굴맨</span>
          </div>
          <div>
            <Checkbox onChange={onChange}>스포일러 포함</Checkbox>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;
