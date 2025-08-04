import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EntryRouter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const visitedDate = localStorage.getItem("visitedDate");

    if (visitedDate === today) {
      navigate("/main", { replace: true });
    } else {
      navigate("/intro", { replace: true });
    }
  }, [navigate]);

  return null; // 아무것도 렌더링하지 않음
};

export default EntryRouter;
