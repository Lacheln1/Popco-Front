import { useEffect, useState } from "react";

export const useIsMediumUp = () => {
  const [isMediumUp, setIsMediumUp] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMediumUp(window.innerWidth >= 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return isMediumUp;
};
