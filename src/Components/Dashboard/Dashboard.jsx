import React from "react";
import Buttons1 from "./Buttons1";
import CryptoMarket from "./CryptoMarket";

const Dashboard = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl mb-6 text-center">
        Dashboard
      </h1>
      <Buttons1 />
      <CryptoMarket />
    </div>
  );
};

export default Dashboard;
