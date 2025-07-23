// ActionButtons.tsx
// 리뷰, 보고싶어요, 콜렉션 추가 버튼 그룹 컴포넌트
// --- PNG 아이콘 임포트 ---
import reviewIconUrl from "@/assets/review.png";
import emptyPlusIconUrl from "@/assets/empty-plus.png";
import fullPlusIconUrl from "@/assets/full-plus.png";
import folderIconUrl from "@/assets/folder.png";

const ActionButtons = ({ isWished, onWishClick, isDesktop = false }) => {
  const iconSize = isDesktop ? "h-8 w-8" : "h-6 w-6";
  const textSize = isDesktop ? "text-sm" : "text-xs";
  const gap = isDesktop ? "gap-2" : "gap-1";

  return (
    <div className={`flex items-center text-center text-gray-600 ${isDesktop ? 'gap-8' : 'w-full justify-around'}`}>
      <button type="button" className={`flex flex-col items-center ${gap} hover:opacity-80`}>
        <img src={reviewIconUrl} alt="리뷰 쓰기" className={iconSize} />
        <span className={`${textSize} font-semibold`}>리뷰 쓰기</span>
      </button>
      <button type="button" onClick={onWishClick} className={`flex flex-col items-center ${gap} hover:opacity-80`}>
        <img src={isWished ? fullPlusIconUrl : emptyPlusIconUrl} alt="보고싶어요" className={iconSize} />
        <span className={`${textSize} font-semibold`}>보고싶어요</span>
      </button>
      <button type="button" className={`flex flex-col items-center ${gap} hover:opacity-80`}>
        <img src={folderIconUrl} alt="콜렉션 추가" className={iconSize} />
        <span className={`${textSize} font-semibold`}>콜렉션 추가</span>
      </button>
    </div>
  );
};

export default ActionButtons;