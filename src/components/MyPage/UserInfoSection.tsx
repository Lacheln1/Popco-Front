import useAuthCheck from "@/hooks/useAuthCheck";
import React, { useRef, useState } from "react";
import { App } from "antd";
import { updateUserProfile } from "@/apis/userApi";

interface UserInfoSectionProps {
  nickname: string;
  email: string;
  currentPersona: string;
  profileImageUrl?: string;
  personaImageUrl?: string;
  onProfileUpdate?: (newImageUrl: string) => void; // 부모 컴포넌트에 업데이트 알림
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  nickname,
  email,
  currentPersona,
  profileImageUrl,
  personaImageUrl,
  onProfileUpdate,
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

  // profileImageUrl prop이 변경될 때 로컬 상태 업데이트
  React.useEffect(() => {
    setCurrentProfileImage(profileImageUrl || "");
  }, [profileImageUrl]);

  // 파일 선택
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

      // 사진 미리보기
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 미리보기 취소
  const handleCancelPreview = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 이미지 업로드 및 프로필 업데이트
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

      // 서버에서 data: null을 반환하므로, 부모 컴포넌트에 새로고침 요청
      if (response.code === 200 && response.result === "SUCCESS") {
        // 업데이트 성공 시 부모 컴포넌트에서 최신 데이터를 다시 가져오도록 알림
        onProfileUpdate?.("refresh");
        console.log("선택한 이미지", selectedImage);

        // 선택된 파일과 미리보기 초기화
        setSelectedImage(null);
        setPreviewUrl("");

        // 파일 input 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        message.success("프로필이 성공적으로 업데이트되었습니다.");
      } else {
        throw new Error("업데이트 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      message.error("프로필 업데이트에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pretendard relative sm:top-3 md:top-4">
      <div className="md:g flex w-full flex-col justify-center gap-4 pl-6 md:flex-row md:justify-start md:gap-40">
        {/* 사용자 프로필 */}
        <div className="relative flex items-center">
          <div className="relative">
            <img
              src={
                previewUrl ||
                currentProfileImage ||
                "https://popco-bucket.s3.ap-northeast-2.amazonaws.com/5ce940cd-4cd0-442b-afb0-077054a2af1f_popco.png"
              }
              alt="사용자프로필"
              className="h-[45px] w-[45px] cursor-pointer overflow-hidden rounded-full object-cover"
              onClick={() => fileInputRef.current?.click()}
            />
            {/* 이미지 변경 아이콘 */}
            <div
              className="absolute -bottom-1 -right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black transition-colors hover:bg-gray-700"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                className="h-3 w-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col pl-5">
            <span className="pretendard-bold text-lg">{nickname}</span>
            <span className="text-base">{email}</span>
          </div>

          {/* 선택된 이미지가 있을 때 업데이트/취소 버튼 표시 */}
          {selectedImage && (
            <div className="ml-4 flex gap-2">
              <button
                onClick={handleUpdateProfile}
                disabled={isLoading}
                className="rounded-lg bg-black px-4 py-2 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "업데이트 중..." : "프로필 변경"}
              </button>
              <button
                onClick={handleCancelPreview}
                disabled={isLoading}
                className="rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                취소
              </button>
            </div>
          )}
        </div>

        {/* 중간 선 */}
        <div className="flex items-center">
          <div className="hidden md:inline md:h-12 md:w-px md:bg-gray-600" />
        </div>

        {/* 페르소나 정보 */}
        <div className="flex items-center md:right-52">
          <div>
            <img
              src={
                personaImageUrl ||
                "https://popco-bucket.s3.ap-northeast-2.amazonaws.com/5ce940cd-4cd0-442b-afb0-077054a2af1f_popco.png"
              }
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

      {/* 파일 입력 (숨김) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
    </div>
  );
};

export default UserInfoSection;
