import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AverageDoubleDonutChartProps {
  customerScore: number;
  averageScore: number;
  maxScore: number;
}

const AverageDoubleDonutChart: React.FC<AverageDoubleDonutChartProps> = ({
  customerScore,
  averageScore,
  maxScore,
}) => {
  const data = {
    labels: ["고객님", "액션 헌터 평균"],
    datasets: [
      {
        label: "고객님",
        data: [customerScore, maxScore - customerScore], // 2.5점, 나머지 2.5점
        backgroundColor: ["#3BA8F0", "#E5E5E5"],
        borderWidth: 0,
        cutout: "30%",
        radius: "90%", // 외부 링
      },
      {
        label: "액션 헌터 평균",
        data: [averageScore, maxScore - averageScore], // 3.8점, 나머지 1.2점
        backgroundColor: ["#FD6B94", "#E5E5E5"],
        borderWidth: 0,
        cutout: "30%",
        radius: "90%", // 내부 링
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 범례 숨김
      },
      tooltip: {
        enabled: false, // 툴팁도 숨김 (선택사항)
      },
    },
  };

  return (
    <div className="relative h-[120px] w-[120px] md:h-[200px] md:w-[200px]">
      <div className="relative h-full">
        <Doughnut data={data} options={options} />
        {/* 중앙에 점수 표시 */}
      </div>
    </div>
  );
};

export default AverageDoubleDonutChart;
