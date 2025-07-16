import React from "react";

import popcoLogo from "../../assets/popco-logo.svg";
import githubLogo from "../../assets/github-logo.svg";
import figmaLogo from "../../assets/figma-logo.svg";
import notionLogo from "../../assets/notion-logo.svg";

const Footer: React.FC = () => {
  return (
    <footer className="bg-footerBlue">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-shrink-0">
            <img className="h-10 w-auto" src={popcoLogo} alt="Popco Logo" />
          </div>

          <div className="text-center">
            <p className="text-sm text-white">
              Copyright © POPCO. All Rights Reserved.
            </p>
            <div className="mt-2 text-xs text-gray-400">
              <p>프론트엔드 : 심영민 | 이예은 | 홍성현</p>
              <p className="mt-1">백엔드 : 김건택 | 박기환 | 변지민 | 신혜원</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Eureka-final-popco"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-75"
              aria-label="GitHub"
            >
              <img className="h-7 w-7" src={githubLogo} alt="GitHub Logo" />
            </a>
            <a
              href="https://www.figma.com/design/wmKshK5ZDxyHa33ZyxmDdc/%EC%9C%A0%EB%A0%88%EC%B9%B4-%EC%B5%9C%EC%A2%85-4%EC%A1%B0?node-id=1-2&t=QC9EQa2O2KUkKe7F-1"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-75"
              aria-label="Figma"
            >
              <img className="h-7 w-7" src={figmaLogo} alt="Figma Logo" />
            </a>
            <a
              href="https://freckle-hell-016.notion.site/4-2220acb00fdb809e922aca3f1e9a2d7d?pvs=74"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-75"
              aria-label="Notion"
            >
              <img className="h-7 w-7" src={notionLogo} alt="Notion Logo" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
