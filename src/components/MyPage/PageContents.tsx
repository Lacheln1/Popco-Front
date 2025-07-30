import React, { useState } from "react";
import MovieCalendar from "./MovieCalendar";

const PageContents: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabTitles = ["Calendar", "Collection", "MY"];
  return (
    <div className="pretendard">
      <div>
        <div className="flex space-x-2 rounded-lg">
          {tabTitles.map((title, i) => (
            <button
              key={i}
              className={`pretendard-bold ml-2 w-24 rounded-t-[20px] bg-gray-100 px-4 py-2 text-sm transition-all md:w-36 md:text-xl ${
                activeTab === i
                  ? "bg-popco-main text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              } `}
              onClick={() => setActiveTab(i)}
            >
              {title}
            </button>
          ))}
        </div>
        <div className="rounded-b-[8px] border border-gray-200 bg-white p-6">
          {activeTab === 0 && (
            <div>
              <h1 className="gmarket-bold py-2 text-base md:text-2xl">
                이 달엔 이런 작품을 봤어요
              </h1>
              <MovieCalendar />
              <div></div>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold">제목2</h3>
              <p className="mb-2">두 번째 탭 내용 1</p>
              <p className="mb-2">두 번째 탭 내용 2</p>
              <p className="mb-2">두 번째 탭 내용 3</p>
              <p className="mb-2">두 번째 탭 내용 4</p>
              <p className="mb-2">두 번째 탭 내용 5</p>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold">제목3</h3>
              <p className="mb-2">세 번째 탭 내용 1</p>
              <p className="mb-2">세 번째 탭 내용 2</p>
              <p className="mb-2">세 번째 탭 내용 3</p>
              <p className="mb-2">세 번째 탭 내용 4</p>
              <p className="mb-2">세 번째 탭 내용 5</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageContents;
