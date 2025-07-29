import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Chart.js에 필요한 요소 등록
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

// 차트 데이터
const data = {
  labels: ["만족도", "공포", "마스터리", "운영속도", "기록", "고전"],
  datasets: [
    {
      label: "유저",
      data: [30, 50, 70, 20, 60, 10],
      backgroundColor: "rgba(54, 162, 235, 0.2)", // 파랑 배경
      borderColor: "rgba(54, 162, 235, 1)", // 파랑 선
      borderWidth: 2,
    },
    {
      label: "평균",
      data: [60, 50, 40, 30, 20, 10],
      backgroundColor: "rgba(255, 99, 132, 0.2)", // 빨강 배경
      borderColor: "rgba(255, 99, 132, 1)", // 빨강 선
      borderWidth: 2,
    },
  ],
};

// 차트 옵션
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "항목별 비교",
    },
  },
  scales: {
    r: {
      angleLines: {
        display: true,
      },
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: {
        stepSize: 10,
      },
    },
  },
};

export default function RadarChart() {
  return <Radar data={data} options={options} />;
}
