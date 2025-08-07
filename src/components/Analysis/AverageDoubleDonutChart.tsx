import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AverageDoubleDonutChartProps {
  customerScore: number;
  averageScore: number;
  maxScore: number;
  personaName?: string;
}

const AverageDoubleDonutChart: React.FC<AverageDoubleDonutChartProps> = ({
  customerScore,
  averageScore,
  maxScore,
  personaName,
}) => {
  // 최소값을 설정하여 0이어도 그래프가 보이도록 함
  const minValue = 0.1;

  // 실제 값이 0이면 minValue를 사용하고, 나머지 값도 조정
  const getAdjustedValues = (score: number) => {
    if (score === 0) {
      return [minValue, maxScore - minValue];
    }
    return [score, maxScore - score];
  };

  const customerValues = getAdjustedValues(customerScore);
  const averageValues = getAdjustedValues(averageScore);

  const data = {
    labels: ["평균", "평균"],
    datasets: [
      {
        label: "나",
        data: customerValues,
        backgroundColor: ["#3BA8F0", "#E5E5E5"],
        borderWidth: 0,
        cutout: "30%",
        radius: "90%", // 외부 링
      },
      {
        label: personaName,
        data: averageValues,
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
        enabled: true,
        filter: (tooltipItem: TooltipItem<"doughnut">) => {
          const { dataset, dataIndex } = tooltipItem;
          const backgroundColor = dataset.backgroundColor as string[];
          return backgroundColor[dataIndex] !== "#E5E5E5";
        },
      },
    },
  };

  // 둘 다 0인 경우 체크
  const bothScoresZero = customerScore === 0 && averageScore === 0;

  return (
    <div className="relative h-[120px] w-[120px] md:h-[200px] md:w-[200px]">
      <div className="relative h-full">
        {bothScoresZero ? (
          // 데이터가 없을 때 표시할 내용
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-gray-200 bg-gray-50 md:h-[200px] md:w-[200px]">
            <span className="text-xs text-gray-500 md:text-sm">
              데이터 없음
            </span>
          </div>
        ) : (
          <>
            <Doughnut data={data} options={options} />
            {/* 중앙에 점수 표시 */}
          </>
        )}
      </div>
    </div>
  );
};

export default AverageDoubleDonutChart;
