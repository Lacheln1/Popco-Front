import { useState } from 'react'; // useState import
import { Outlet, useOutletContext } from "react-router-dom";
import { Progress } from 'antd';
import Lighting from '../assets/lighting.svg?react';

const TOTAL_QUESTIONS = 5;

const TestLayout = () => {
  const [step, setStep] = useState(0);

  const percent = TOTAL_QUESTIONS > 0 ? ((step) / TOTAL_QUESTIONS) * 100 : 0;

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-footerBlue">
      <Lighting className="absolute -top-16 left-0 z-10 w-72 opacity-70 lg:-top-24 lg:left-32" />
      <Lighting className="absolute -top-16 right-0 z-10 w-72 opacity-70 lg:-top-24 lg:right-32" />

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

      <main className="h-full w-full z-20">
        <Outlet context={{ step, total: TOTAL_QUESTIONS, setStep }} />
      </main>
    </div>
  );
};

export default TestLayout;