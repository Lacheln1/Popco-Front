import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Progress } from "antd";

const TOTAL_QUESTIONS = 5;

const TestLayout = () => {
  const [step, setStep] = useState(0);

  const percent = TOTAL_QUESTIONS > 0 ? (step / TOTAL_QUESTIONS) * 100 : 0;

  return (
    <div className="bg-dark-blueblack relative flex h-screen w-screen items-center justify-center overflow-hidden">
      {step > 0 && step <= TOTAL_QUESTIONS && (
        <div className="absolute top-10 z-20 w-full max-w-xs px-4 lg:max-w-md">
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="var(--color-popcoMainColor)"
            trailColor="rgba(255, 255, 255, 0.2)"
            size="small"
          />
        </div>
      )}

      <main className="z-20 h-full w-full">
        <Outlet context={{ step, total: TOTAL_QUESTIONS, setStep }} />
      </main>
    </div>
  );
};

export default TestLayout;
