import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
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

interface AgeChartProps {
  agePercent: number[];
}

const AgeChart = ({ agePercent }: AgeChartProps) => {
  // 컴포넌트 내부에서 정의해야 props 사용 가능
  const isSmallScreen = window.innerWidth < 640;

  const labels = ["10대", "20대", "30대", "40대", "50대", "60대"];

  const options = {
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
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            const value = context.raw;
            return `${value}명`;
          },
        },
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
        grid: {
          display: false,
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
          callback: function (value: string | number) {
            return value + "명";
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: labels.map((_, index) => agePercent[index] ?? 0),
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

  return (
    <div className="w-full sm:h-[250px]">
      <Bar options={options} data={data} />
    </div>
  );
};

export default AgeChart;
