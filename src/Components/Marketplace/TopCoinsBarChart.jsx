import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ffc0cb",
  "#ffbb28",
  "#00C49F",
];

const TopCoinsBarChart = () => {
  const [topCoins, setTopCoins] = useState([]);
  const [error, setError] = useState(null);

  const fetchTopCoins = async () => {
    try {
      const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      if (!res.ok) throw new Error("Failed to fetch top coins");

      const data = await res.json();

      const usdtPairs = data
        .filter((item) => item.symbol.endsWith("USDT"))
        .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
        .slice(0, 10)
        .map((item) => ({
          symbol: item.symbol,
          name: item.symbol.replace("USDT", ""),
          volume: Number(item.quoteVolume),
          price: Number(item.lastPrice),
        }));

      setTopCoins(usdtPairs);
      setError(null);
    } catch (err) {
      setError(err.message);
      setTopCoins([]);
    }
  };

  useEffect(() => {
    fetchTopCoins();
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (topCoins.length === 0) {
    return (
      <div className="text-center text-gray-300 py-20">
        Loading top coins data...
      </div>
    );
  }

  return (
    <div className="bg-white/10 text-white rounded-xl p-6 shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        Top 10 Coins by 24h Volume (USDT)
      </h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={topCoins}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            type="number"
            tickFormatter={(value) =>
              value >= 1e9
                ? (value / 1e9).toFixed(1) + "B"
                : value >= 1e6
                ? (value / 1e6).toFixed(1) + "M"
                : value >= 1e3
                ? (value / 1e3).toFixed(1) + "K"
                : value
            }
            tick={{ fill: "white" }}
            axisLine={{ stroke: "#888" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "white", fontWeight: "bold" }}
            axisLine={{ stroke: "#888" }}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [
              Number(value).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              }),
              "Volume (USDT)",
            ]}
            contentStyle={{ backgroundColor: "#222", borderRadius: "8px" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "white" }} />
          <Bar dataKey="volume" name="24h Volume">
            {topCoins.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCoinsBarChart;
