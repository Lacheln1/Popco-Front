import { Outlet } from "react-router-dom";

const WithoutHeaderFooterLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default WithoutHeaderFooterLayout;
