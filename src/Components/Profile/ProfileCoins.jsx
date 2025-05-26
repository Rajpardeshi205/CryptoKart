import React, { useEffect, useState } from "react";
import { FaBitcoin } from "react-icons/fa"; // fallback icon
import axios from "axios";

const ProfileCoins = ({ portfolio }) => {
  const [coinData, setCoinData] = useState({});

  useEffect(() => {
    const fetchCoinData = async () => {
      if (!portfolio || Object.keys(portfolio).length === 0) return;

      try {
        const ids = Object.keys(portfolio).join(",");
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets`,
          {
            params: {
              vs_currency: "inr",
              ids,
            },
          }
        );

        const dataMap = {};
        response.data.forEach((coin) => {
          dataMap[coin.id] = {
            name: coin.name,
            symbol: coin.symbol,
            image: coin.image,
          };
        });

        setCoinData(dataMap);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };

    fetchCoinData();
  }, [portfolio]);

  if (!portfolio || Object.keys(portfolio).length === 0) {
    return <p>No coins owned yet.</p>;
  }

  return (
    <div className="mt-4 p-4 bg-gray-900 rounded-lg text-white">
      <h2 className="text-xl font-semibold mb-2">Your Coins Portfolio</h2>
      <ul className="space-y-2 max-h-60 overflow-auto">
        {Object.entries(portfolio).map(([coinId, coin]) => {
          const meta = coinData[coinId];
          return (
            <li
              key={coinId}
              className="flex items-center justify-between border-b border-gray-700 py-2"
            >
              <div className="flex items-center gap-3">
                {meta?.image ? (
                  <img
                    src={meta.image}
                    alt={meta.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <FaBitcoin className="text-yellow-400 text-2xl" />
                )}
                <div>
                  <p className="font-semibold">
                    {meta?.name || coin.name} (
                    {(meta?.symbol || coin.symbol).toUpperCase()})
                  </p>
                  <p className="text-sm text-gray-400">
                    Avg Price: ₹{coin.avgPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="font-semibold">{coin.amount.toFixed(4)}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProfileCoins;
