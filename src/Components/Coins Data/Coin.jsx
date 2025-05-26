import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CurrencySelector from "../CurrencySelector";
import LineChart from "./LineChart";
import TopCoinsPieChart from "./TopCoinsPieChart";
import { CoinContext } from "../../Context/Coincontext";

function Coin() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id);

  const [coinData, setCoinData] = useState(null);
  const { Currency } = useContext(CoinContext);
  const [loadingCoin, setLoadingCoin] = useState(true);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": "CG-qxhq3ccNxpbRwqYtpFGCF6HE",
    },
  };

  const fetchCoinData = async () => {
    setLoadingCoin(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${decodedId}`,
        options
      );
      const data = await res.json();
      setCoinData(data);
    } catch (err) {
      console.error("Error fetching coin data:", err);
    } finally {
      setLoadingCoin(false);
    }
  };

  useEffect(() => {
    fetchCoinData();
  }, [decodedId]);

  if (loadingCoin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="loader border-r-2 rounded-full border-yellow-500 bg-yellow-300 animate-bounce aspect-square w-8 flex justify-center items-center text-yellow-700">
          $
        </div>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="text-center text-white p-8">Coin data not found.</div>
    );
  }

  const binanceSymbol = `${coinData.symbol.toUpperCase()}USDT`;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 text-white flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src={coinData.image.large}
            alt={coinData.name}
            className="w-14 h-14 sm:w-16 sm:h-16"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold truncate">
              {coinData.name}
            </h1>
            <p className="text-gray-400 uppercase text-sm sm:text-base">
              {coinData.symbol}
            </p>
          </div>
        </div>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 p-4 sm:p-6 rounded-xl shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Market Details</h2>
          <ul className="space-y-2 text-sm sm:text-base">
            <li className="flex justify-between">
              <span>Market Rank:</span>
              <span className="font-medium">{coinData.market_cap_rank}</span>
            </li>
            <li className="flex justify-between">
              <span>Current Price:</span>
              <span className="font-medium">
                {Currency.symbol}
                {coinData.market_data.current_price[Currency.name].toLocaleString()}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Market Cap:</span>
              <span className="font-medium">
                {Currency.symbol}
                {coinData.market_data.market_cap[Currency.name].toLocaleString()}
              </span>
            </li>
            <li className="flex justify-between">
              <span>24h High:</span>
              <span className="font-medium">
                {Currency.symbol}
                {coinData.market_data.high_24h[Currency.name].toLocaleString()}
              </span>
            </li>
            <li className="flex justify-between">
              <span>24h Low:</span>
              <span className="font-medium">
                {Currency.symbol}
                {coinData.market_data.low_24h[Currency.name].toLocaleString()}
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white/10 p-4 sm:p-6 rounded-xl shadow-md">
          <TopCoinsPieChart coinId={decodedId} currency={Currency.name} />
        </div>
      </div>

      <div className="bg-white/10 p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Price History</h2>
        <LineChart
          symbol={binanceSymbol}
          name={coinData.name}
          currencySymbol={Currency.symbol}
        />
      </div>
    </div>
  );
}

export default Coin;
