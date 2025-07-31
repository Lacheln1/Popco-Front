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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [errorUrls, setErrorUrls] = useState<Set<string>>(new Set());
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { message } = App.useApp();

  // 기본 이미지 URL
  const DEFAULT_PROFILE_IMAGE =
    "https://popco-bucket.s3.ap-northeast-2.amazonaws.com/5ce940cd-4cd0-442b-afb0-077054a2af1f_popco.png";

  // nickname prop이 변경될 때 로컬 상태 업데이트
  React.useEffect(() => {
    setNewNickname(nickname);
  }, [nickname]);

  // profileImageUrl이 변경될 때 에러 상태 초기화
  React.useEffect(() => {
    // 새로운 URL이면 에러 목록에서 제거
    if (profileImageUrl) {
      setErrorUrls((prev) => {
        const newSet = new Set(prev);
        newSet.delete(profileImageUrl);
        return newSet;
      });
    }
  }, [profileImageUrl]);

  // 이미지 로드 에러 처리 (한 번만 처리)
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const imgSrc = event.currentTarget.src;

    // 이미 에러 처리된 URL이면 무시
    if (errorUrls.has(imgSrc)) {
      return;
    }

    // 기본 이미지에서 에러가 발생하면 무시 (무한루프 방지)
    if (imgSrc === DEFAULT_PROFILE_IMAGE) {
      return;
    }

    console.log("이미지 로드 실패:", imgSrc);
    setErrorUrls((prev) => new Set([...prev, imgSrc]));
  };

  // 이미지 로드 성공 처리
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const imgSrc = event.currentTarget.src;
    // 성공한 URL은 에러 목록에서 제거
    setErrorUrls((prev) => {
      const newSet = new Set(prev);
      newSet.delete(imgSrc);
      return newSet;
    });
  };

  // 닉네임 편집 시작
  const handleStartEditNickname = () => {
    setIsEditingNickname(true);
    setNewNickname(nickname);
  };

  // 닉네임 편집 취소
  const handleCancelEditNickname = () => {
    setIsEditingNickname(false);
    setNewNickname(nickname);
  };

  // 닉네임 변경 저장
  const handleSaveNickname = async () => {
    if (!accessToken) {
      message.error("로그인이 필요합니다");
      return;
    }

    if (!newNickname.trim()) {
      message.error("닉네임을 입력해주세요.");
      return;
    }

    if (newNickname.trim() === nickname) {
      setIsEditingNickname(false);
      return;
    }

    setIsLoading(true);

    try {
      // 기존 프로필 이미지가 있으면 빈 파일 객체 생성, 없으면 기본 이미지 사용
      const dummyFile = new File([""], "dummy.txt", { type: "text/plain" });

      const response = await updateUserProfile(
        { nickname: newNickname.trim(), profileImageUrl: dummyFile },
        accessToken,
      );

      console.log("닉네임 업데이트 성공:", response);

      if (response.code === 200 && response.result === "SUCCESS") {
        setIsEditingNickname(false);
        message.success("닉네임이 성공적으로 변경되었습니다.");

        // 새로고침으로 최신 데이터 반영
        setTimeout(() => {
          window.location.reload();
        }, 500); // 성공 메시지를 보여준 후 새로고침
      } else {
        throw new Error("닉네임 변경 응답이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("닉네임 변경 오류:", error);
      message.error("닉네임 변경에 실패했습니다.");
      setNewNickname(nickname); // 실패 시 원래 값으로 복원
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키로 닉네임 저장
  const handleNicknameKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSaveNickname();
    } else if (event.key === "Escape") {
      handleCancelEditNickname();
    }
  };
  const getDisplayImageUrl = () => {
    // 1. 미리보기 이미지가 있으면 우선 표시
    if (previewUrl) {
      return previewUrl;
    }

    // 2. 프로필 이미지가 있고 에러 목록에 없으면 표시
    if (profileImageUrl && !errorUrls.has(profileImageUrl)) {
      return profileImageUrl;
    }

    // 3. 기본 이미지 표시
    return DEFAULT_PROFILE_IMAGE;
  };

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

        // 선택된 파일과 미리보기 초기화
        setSelectedImage(null);
        setPreviewUrl("");

        // 파일 input 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        message.success("프로필 이미지가 성공적으로 업데이트되었습니다.");
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
      <div className="flex w-full flex-col justify-center gap-8 pl-6">
        {/* 사용자 프로필 */}
        <div className="relative flex items-center">
          <div className="relative">
            <img
              src={getDisplayImageUrl()}
              alt="사용자프로필"
              className="h-[45px] w-[45px] cursor-pointer overflow-hidden rounded-full object-cover"
              onClick={() => fileInputRef.current?.click()}
              onLoad={handleImageLoad}
              onError={handleImageError}
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
            {isEditingNickname ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  onKeyDown={handleNicknameKeyPress}
                  className="pretendard-bold border-b border-gray-300 bg-transparent px-1 py-1 text-lg outline-none focus:border-black"
                  placeholder="닉네임을 입력하세요"
                  autoFocus
                />
                <button
                  onClick={handleSaveNickname}
                  disabled={isLoading}
                  className="rounded bg-black px-2 py-1 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
                >
                  저장
                </button>
                <button
                  onClick={handleCancelEditNickname}
                  disabled={isLoading}
                  className="rounded bg-gray-500 px-2 py-1 text-sm text-white hover:bg-gray-600 disabled:opacity-50"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="pretendard-bold text-lg">{nickname}</span>
                <button
                  onClick={handleStartEditNickname}
                  className="text-sm text-gray-500 hover:text-black"
                  title="닉네임 수정"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>
            )}
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

        {/* 페르소나 정보 */}
        <div className="flex items-center">
          <div>
            <img
              src={personaImageUrl || DEFAULT_PROFILE_IMAGE}
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
