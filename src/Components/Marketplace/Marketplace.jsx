import React from "react";
import TopCoinsBarChart from "./TopCoinsBarChart";
import TopCoinsChart from "./TopCoinsChart ";

const Marketplace = () => {
  return (
    <div>
      <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl mb-6 text-center">
        Marketplace
      </h1>

      <div className="mt-9">
        <TopCoinsChart />
      </div>
      <div className="mt-9">
        <TopCoinsBarChart />
      </div>
    </div>
  );
};

export default Marketplace;
