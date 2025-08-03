import React, { useEffect, useState } from "react";
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
import { getMyScoreDistribution } from "@/apis/reviewApi";
import Spinner from "../common/Spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface ScoreDistributionData {
  averageScore: number;
  totalCount: number;
  mostFrequentScore: number;
  distribution: { [key: string]: number };
}

interface ScoreDistributionResponse {
  code: number;
  result: string;
  message: string;
  data: ScoreDistributionData;
}

interface MyPageChartProps {
  accessToken: string | null;
}

const MyPageChart: React.FC<MyPageChartProps> = ({ accessToken }) => {
  const [scoreData, setScoreData] = useState<ScoreDistributionData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 평균 점수에 따른 칭호 결정 함수
  const getRatingTitle = (
    averageScore: number,
  ): { title: string; color: string; bgColor: string } => {
    if (averageScore >= 4.5) {
      return {
        title: "완벽주의자",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      };
    } else if (averageScore >= 4.0) {
      return {
        title: "까다로워요",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      };
    } else if (averageScore >= 3.0) {
      return {
        title: "보통이에요",
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    } else if (averageScore >= 2.0) {
      return {
        title: "아쉬워해요",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      };
    } else {
      return {
        title: "혹독해요",
        color: "text-red-600",
        bgColor: "bg-red-50",
      };
    }
  };

  useEffect(() => {
    const fetchScoreData = async () => {
      if (!accessToken) {
        console.log("accessToken이 없습니다");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response: ScoreDistributionResponse =
          await getMyScoreDistribution(accessToken);

        if (response && response.code === 200 && response.data) {
          setScoreData(response.data);
        } else {
          setError("점수 분포를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("점수 분포 조회 실패:", err);
        setError("점수 분포를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchScoreData();
  }, [accessToken]);

  // 차트 데이터 생성
  const createChartData = () => {
    if (!scoreData) return { labels: [], datasets: [] };

    // 점수를 순서대로 정렬 (0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
    const sortedScores = Object.keys(scoreData.distribution)
      .map((score) => parseFloat(score))
      .sort((a, b) => a - b);

    const labels = sortedScores.map((score) => `${score}점`);
    const data = sortedScores.map(
      (score) => scoreData.distribution[score.toString()],
    );

    return {
      labels,
      datasets: [
        {
          label: "리뷰 개수",
          data: data,
          backgroundColor: [
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
          ],
          borderColor: [
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
            "#ffd751",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        display: false, // 범례 숨김
      },
      title: {
        display: true,
        text: "내 평점 분포",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.y}개의 리뷰`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "리뷰 개수",
        },
      },
      x: {
        title: {
          display: true,
          text: "평점",
        },
      },
    },
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex h-64 items-center justify-center text-gray-500">
          <Spinner />
          점수 분포를 불러오는 중...
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="mb-6">
        <div className="flex h-64 items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  // 로그인이 필요한 상태
  if (!accessToken) {
    return (
      <div className="mb-6">
        <div className="flex h-64 items-center justify-center text-gray-500">
          로그인이 필요합니다.
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!scoreData || scoreData.totalCount === 0) {
    return (
      <div className="mb-6">
        <div className="flex h-64 items-center justify-center text-gray-500">
          아직 작성한 리뷰가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* 칭호 표시 */}
      {scoreData && (
        <div className="mb-6 text-center">
          <div className="mb-2 text-sm text-gray-600">내 팝콘 취향은</div>
          <div
            className={`inline-flex items-center rounded-full px-6 py-3 ${getRatingTitle(scoreData.averageScore).bgColor}`}
          >
            <span
              className={`text-2xl font-bold ${getRatingTitle(scoreData.averageScore).color}`}
            >
              '{getRatingTitle(scoreData.averageScore).title}'
            </span>
            <span className="ml-2 text-lg text-gray-600">파에요</span>
          </div>
        </div>
      )}

      {/* 통계 정보 - 세련된 색상 조합 */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
          <div className="text-sm text-gray-600">총 리뷰 수</div>
          <div className="text-xl font-bold text-yellow-600">
            {scoreData.totalCount}개
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
          <div className="text-sm text-gray-600">평균 평점</div>
          <div className="text-xl font-bold text-yellow-600">
            {scoreData.averageScore.toFixed(1)}점
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
          <div className="text-sm text-gray-600">최다 평점</div>
          <div className="text-xl font-bold text-yellow-600">
            {scoreData.mostFrequentScore}점
          </div>
        </div>
      </div>

      {/* 차트 */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <Bar options={options} data={createChartData()} />
      </div>
    </div>
  );
};

export default MyPageChart;
