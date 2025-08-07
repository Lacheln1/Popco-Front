declare module "react-countdown" {
  import * as React from "react";

  interface CountdownRenderProps {
    total: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    completed: boolean;
  }

  interface CountdownProps {
    date: number | string | Date;
    renderer?: (props: CountdownRenderProps) => React.ReactNode;
    onComplete?: () => void;
    autoStart?: boolean;
  }

  const Countdown: React.FC<CountdownProps>;
  export default Countdown;
}
