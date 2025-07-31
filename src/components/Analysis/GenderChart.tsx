import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderChart = ({ genderPercent }) => {
  const data = {
    labels: ["남성", "여성"],
    datasets: [
      {
        data: [genderPercent[0], genderPercent[1]],
        backgroundColor: ["#36A2EB", "#FF6384"],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%",
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 20,
            family: "Pretendard",
          },
        },
      },
    },
  };

  return (
    <div className="h-[200px] w-[200px] sm:h-[250px] sm:w-[250px]">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default GenderChart;
