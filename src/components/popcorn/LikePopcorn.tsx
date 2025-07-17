import PopcornButtonBase from "./PopcornButtonBase";
import { PopcornButtonProps } from "@/types/Popcorn.types";

const LikePopcorn = (
  props: Omit<PopcornButtonProps, "color" | "label" | "iconSrc">,
) => {
  return (
    <PopcornButtonBase
      {...props}
      color="green"
      label="좋아요"
      iconSrc="/images/components/like-popcorn.svg"
    />
  );
};

export default LikePopcorn;
