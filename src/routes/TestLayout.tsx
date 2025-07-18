import React from "react";
import { Outlet } from "react-router-dom";

const TestLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default TestLayout;
