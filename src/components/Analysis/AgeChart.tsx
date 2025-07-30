import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const isSmallScreen = window.innerWidth < 640;

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
      labels: {
        font: {
          size: 18,
          family: "Pretendard",
        },
        color: "#333",
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: isSmallScreen ? 16 : 18,
          family: "Pretendard",
        },
        color: "#333",
      },
    },
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        font: {
          size: isSmallScreen ? 16 : 18,
        },
        stepSize: 10,
      },
    },
  },
};

const labels = ["10대", "20대", "30대", "40대", "50대", "60대"];

export const data = {
  labels,
  datasets: [
    {
      label: "", //데이터 범례 부분 legend display: false,
      data: [65, 58, 80, 82, 55, 54], // 백엔드 값 받아오기
      backgroundColor: [
        "rgba(255, 99, 132, 0.3)",
        "rgba(255, 159, 64, 0.3)",
        "rgba(255, 206, 86, 0.3)",
        "rgba(75, 192, 192, 0.3)",
        "rgba(54, 162, 235, 0.3)",
        "rgba(153, 102, 255, 0.3)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const AgeChart = () => {
  return (
    <div className="w-full sm:h-[250px] sm:text-3xl">
      <Bar options={options} data={data} />
    </div>
  );
};

export default AgeChart;
