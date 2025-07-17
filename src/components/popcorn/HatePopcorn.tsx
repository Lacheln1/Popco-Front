import PopcornButtonBase from "./PopcornButtonBase";
import { PopcornButtonProps } from "@/types/Popcorn.types";

const HatePopcorn = (
  props: Omit<PopcornButtonProps, "color" | "label" | "iconSrc">,
) => {
  return (
    <PopcornButtonBase
      {...props}
      color="red"
      label="싫어요"
      iconSrc="/images/components/hate-popcorn.svg"
    />
  );
};

export default HatePopcorn;
