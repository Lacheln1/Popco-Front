import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContentsDetail } from "@/apis/contentsApi";
import { ContentsDetail } from "@/types/Contents.types";

export const useContentsDetail = (accessToken?: string) => { // accessToken 매개변수 추가
  const { id, type } = useParams<{ id: string; type: string }>();

  const [contents, setContents] = useState<ContentsDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !type) {
      setError("잘못된 접근입니다.");
      setLoading(false);
      return;
    }

    const fetchContentsDetail = async () => {
      try {
        setLoading(true);
        
        const data = await getContentsDetail(id, type, accessToken); // accessToken 전달
        
        setContents(data);
      } catch (err) {
        setError("콘텐츠 정보를 불러오는 데 실패했습니다.");
        console.error("상세페이지 API 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContentsDetail();
  }, [id, type, accessToken]); // accessToken도 의존성에 추가

  return { contents, loading, error, contentId: id, contentType: type };
};