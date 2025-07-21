import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import popcoLogoImg from "@/assets/popco-logo.svg";

interface User {
  id: string;
  nickname: string;
  isLoggedIn: boolean;
}

interface NavItem {
  name: string;
  path: string;
}

interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user = { id: "", nickname: "", isLoggedIn: false },
  onLogin,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  //헤더 탭 메뉴들
  const navItems: NavItem[] = [
    { name: "홈", path: "/" },
    { name: "전체 콘텐츠", path: "/list" },
    { name: "컬렉션", path: "/collections" },
    { name: "취향 분석", path: "/analysis" },
  ];

  // 스크롤 감지 (모바일에서는 축소 비활성화)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const isMobile = window.innerWidth < 768; // md 브레이크포인트
      setIsScrolled(scrollTop > 10 && !isMobile);
    };

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // 초기 실행
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserClick = () => {
    if (user.isLoggedIn) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      onLogin?.();
      navigateToLogin();
    }
  };

  const handleMyActivity = () => {
    setIsDropdownOpen(false);
    navigate("/my-activity");
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout?.();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const isActiveItem = (path: string) => {
    if (path === "/") return false; //홈 탭은 선택됐을 경우의 효과를 주지 않음
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 md:bg-transparent`}
    >
      <div
        className={`gmarket transition-all duration-300 ${
          isScrolled
            ? "mx-auto mt-5 max-w-6xl rounded-[60px] bg-white/80 px-6 sm:px-8 lg:px-10"
            : "max-w-auto mx-auto bg-white/80 px-4 text-lg sm:px-6 md:bg-white/50 lg:px-24"
        }`}
      >
        <div
          className={`flex h-[4.5rem] items-center justify-between transition-all duration-300`}
        >
          {/* 로고 영역 */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={popcoLogoImg}
                alt="POPCO"
                className={`w-auto object-contain transition-all duration-300 ${isScrolled ? "h-12" : "h-14"}`}
              />
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden flex-1 justify-end md:flex">
            <ul className="flex items-center space-x-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex min-w-[90px] items-center justify-center rounded-full px-4 pt-1 font-medium text-black transition-all duration-300 hover:bg-gray-100 ${
                      isScrolled ? "h-8 text-base" : "h-10 text-xl"
                    } ${
                      isActiveItem(item.path)
                        ? "bg-sidelogo-blueGray text-white hover:bg-gray-700"
                        : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {/* 로그인 버튼*/}
              <li>
                <div className="relative" ref={dropdownRef}>
                  <button
                    className={`flex min-w-[90px] items-center justify-center rounded-full border-2 border-gray-200 font-medium text-black transition-all duration-300 hover:bg-gray-100 ${
                      isScrolled
                        ? "h-8 px-4 text-base"
                        : "mt-1 h-10 px-4 text-xl"
                    }`}
                    onClick={handleUserClick}
                  >
                    {user.isLoggedIn ? `${user.nickname}님` : "로그인"}
                    {user.isLoggedIn && (
                      <span
                        className={`ml-1 text-xs transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                      >
                        ▼
                      </span>
                    )}
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {user.isLoggedIn && isDropdownOpen && (
                    <div className="animate-in fade-in-0 zoom-in-95 absolute right-0 z-50 mt-2 w-32 rounded-lg border border-gray-200 bg-white py-2 shadow-xl duration-200">
                      <button
                        className="w-full px-4 py-2 text-left text-gray-700 transition-colors duration-150 first:rounded-t-lg hover:bg-gray-50"
                        onClick={handleMyActivity}
                      >
                        내활동
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-gray-700 transition-colors duration-150 last:rounded-b-lg hover:bg-gray-50"
                        onClick={handleLogout}
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </nav>

          {/* 모바일 메뉴(햄버거) 버튼 */}
          <div className="md:hidden">
            <button
              className="rounded-md p-2 text-black transition-all duration-300 hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              <svg
                className={`fill-none transition-all duration-300 ${isScrolled ? "h-5 w-5" : "h-6 w-6"} ${isMobileMenuOpen ? "rotate-90" : "rotate-0"}`}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 햄버거 눌렀을 때 나오는 모바일 탭  */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-200 pb-4 pt-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`h-10 rounded-lg px-4 pt-2 font-medium text-black transition-colors hover:bg-gray-100 ${
                    isActiveItem(item.path)
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* 모바일 로그인 버튼 */}
              {!user.isLoggedIn ? (
                <button
                  className="h-10 rounded-lg px-4 py-2 text-left font-medium text-black transition-colors hover:bg-gray-100"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogin?.();
                    navigateToLogin();
                    console.log("로그인클릭됨");
                  }}
                >
                  로그인
                </button>
              ) : (
                <>
                  <div className="rounded-lg px-4 py-2 font-medium text-black">
                    {user.nickname}님
                  </div>
                  <button
                    className="rounded-lg px-4 py-2 text-left font-medium text-black transition-colors hover:bg-gray-100"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleMyActivity();
                    }}
                  >
                    내활동
                  </button>
                  <button
                    className="rounded-lg px-4 py-2 text-left font-medium text-black transition-colors hover:bg-gray-100"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    로그아웃
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
