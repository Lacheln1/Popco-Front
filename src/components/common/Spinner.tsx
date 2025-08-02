import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Spinner: React.FC = () => {
  const customIndicator = (
    <LoadingOutlined style={{ fontSize: 32, color: "#FDBA74" }} spin /> // 주황색 계열
  );

  return (
    <div className="flex w-full justify-center py-8">
      <Spin indicator={customIndicator} />
    </div>
  );
};

export default Spinner;
