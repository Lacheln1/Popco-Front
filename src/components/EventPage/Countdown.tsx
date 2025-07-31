import TimeBlock from "./TimeBlock";

type CountdownRendererProps = {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

export const renderCount = ({
  hours,
  minutes,
  seconds,
  completed,
}: CountdownRendererProps) => {
  if (!completed) {
    const format = (num: number) => String(num).padStart(2, "0");
    return (
      <div className="mb-8 flex gap-2">
        <TimeBlock label="HOURS" value={format(hours)} />
        <TimeBlock label="MINUTES" value={format(minutes)} />
        <TimeBlock label="SECONDS" value={format(seconds)} />
      </div>
    );
  }
};
