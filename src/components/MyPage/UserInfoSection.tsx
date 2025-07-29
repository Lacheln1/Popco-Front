import useAuthCheck from "@/hooks/useAuthCheck";
import React, { useRef, useState } from "react";
import { App } from "antd";
import { updateUserProfile } from "@/apis/userApi";
interface UserInfoSectionProps {
  nickname: string;
  email: string;
  currentPersona: string;
  profileImageUrl?: string;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  nickname,
  email,
  currentPersona,
  profileImageUrl,
}) => {
  const { accessToken } = useAuthCheck();
  const [isLoading, setIsLoading] = useState(false);
  const [currentProfileImage, setCurrentProfileImage] = useState<string>(
    profileImageUrl || "",
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { message } = App.useApp();

  //파일 선택
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        message.error("이미지 파일만 업로드 가능합니다.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        message.error("파일 크기는 5MB 이하여야 합니다.");
        return;
      }
      setSelectedImage(file);

      //사진 미리보기
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  //이미지 업로드 및 프로필 업데이트
  const handleUpdateProfile = async () => {
    if (!accessToken) {
      message.error("로그인이 필요합니다");
      return;
    }

    if (!selectedImage) {
      message.error("변경할 이미지를 선택해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await updateUserProfile(
        { nickname: nickname, profileImageUrl: selectedImage },
        accessToken,
      );
      console.log("프로필 업데이트 성공:", response);

      setCurrentProfileImage(previewUrl);
      setSelectedImage(null);
      setPreviewUrl("");

      message.success("프로필이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pretendard">
      <div className="flex w-full flex-col justify-center gap-8 pl-6">
        <div className="relative flex items-center">
          <div>
            <img
              src="/images/mypage/testProfileImg.png"
              alt="페르소나사진"
              className="h-[45px] w-[45px] overflow-hidden rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col pl-5">
            <span className="pretendard-bold text-lg">{nickname}</span>
            <span className="text-base">{email}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div>
            <img
              src="/images/mypage/testProfileImg.png"
              alt="페르소나사진"
              className="h-[45px] w-[45px] overflow-hidden rounded-xl object-cover"
            />
          </div>
          <div className="flex flex-col pl-5">
            <span className="pretendard-bold text-lg">현재 페르소나</span>
            <span className="text-base">{currentPersona}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoSection;
