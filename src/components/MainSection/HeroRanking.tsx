import Poster from "../common/Poster";

const HeroRanking = () => {
  const posterData = [
    { rank: 2, id: "2", title: "2위 포스터" },
    { rank: 3, id: "3", title: "3위 포스터" },
    { rank: 4, id: "4", title: "4위 포스터" },
    { rank: 5, id: "5", title: "5위 포스터" },
  ];

  return (
    <div className="m-auto xl:w-[1200px]">
      <h3 className="gmarket">
        POPCO의 주간 <strong className="text-popcorn-box">TOP 5</strong>
      </h3>
      <section>
        <div className="relative text-white">
          <img
            src="images/main/ticket.svg"
            alt="티켓 이미지"
            className="w-full"
          />
          <div className="absolute inset-0 flex items-center gap-14 px-24 py-10">
            <img
              className="w-72 rounded-md shadow-lg"
              src="https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg"
              alt="1위 포스터"
            />
            <div className="max-w-[510px]">
              <div className="border-bottom flex items-center gap-3 border-b border-solid border-white">
                <span className="text-8xl font-bold text-transparent drop-shadow-lg [-webkit-text-stroke:3px_#fdedae]">
                  1
                </span>
                <span className="gmarket text-4xl text-white">F1 더 무비</span>
              </div>
              <div className="flex gap-6 border-b border-solid border-white py-5 text-xl">
                <div className="flex gap-6">
                  <div className="text-popco-main">POPCORN</div>
                  <div>3.5</div>
                </div>
                <div className="flex gap-6">
                  <div className="text-popco-main">GENRE</div>
                  <div>액션, 서사/드라마</div>
                </div>
              </div>
              <p className="mt-4 text-gray-200">
                한때 주목받는 유망주였지만 끔찍한 사고로 F1®에서 우승하지
                못하고 한순간에 추락한 드라이버 소니 헤이스. 그의 오랜 동료인
                루벤 세르반테스에게 레이싱 복귀를 제안받으며 최하위 팀인 APXGP에
                합류한다. 그러나 팀 내 떠오르는 천재 드라이버 조슈아 피어스와 소
                ...
              </p>
              <button className="bg-popco-hair gmarket hover:bg-popco-main mt-6 rounded-full px-6 py-4 font-semibold text-black">
                👁 view more
              </button>
            </div>
          </div>
        </div>

        <ul className="ml-12 mt-10 flex justify-between gap-4">
          {posterData.map(({ rank, id, title }) => (
            <li key={id} className="flex w-[20%] flex-col items-center">
              <div className="relative">
                <span className="absolute -left-11 -top-8 z-10 stroke-black text-[100px] font-bold text-transparent drop-shadow-lg [-webkit-text-stroke:3px_#0f1525]">
                  {rank}
                </span>
                <Poster
                  title={title}
                  posterUrl="https://image.tmdb.org/t/p/original/bvVoP1t2gNvmE9ccSrqR1zcGHGM.jpg"
                  id={id}
                  likeState="neutral"
                  onLikeChange={() => {}}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HeroRanking;
