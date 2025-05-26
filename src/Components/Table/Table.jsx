import React, { useContext, useState, useEffect } from "react";
import CurrencySelector from "../CurrencySelector";
import CryptoChart from "./CryptoChart";
import Searchbar from "./Searchbar";
import { CoinContext } from "../../Context/Coincontext";

const Table = () => {
  const { allCoin, Currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl mb-6 text-center">
        Table
      </h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <CurrencySelector />
        <Searchbar allCoin={allCoin} setDisplayCoin={setDisplayCoin} />
      </div>
      <CryptoChart displayCoin={displayCoin} Currency={Currency} />
    </div>
  );
};

export default Table;
