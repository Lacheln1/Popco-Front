import React, { useState } from "react";

const PageContents: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabTitles = ["Calendar", "Collection", "MY"];
  return (
    <div>
      <div>
        <div className="mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1">
          {tabTitles.map((title, i) => (
            <button
              key={i}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === i
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              } `}
              onClick={() => setActiveTab(i)}
            >
              {title}
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          {activeTab === 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold">제목1</h3>
              <p className="mb-2">내용 1</p>
              <p className="mb-2">내용 2</p>
              <p className="mb-2">내용 3</p>
              <p className="mb-2">내용 4</p>
              <p className="mb-2">내용 5</p>
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
