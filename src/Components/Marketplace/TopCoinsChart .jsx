import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const intervalOptions = {
  "1h": { label: "1 Hour", binance: "1m", limit: 60 },
  "1d": { label: "1 Day", binance: "5m", limit: 288 },
  "7d": { label: "7 Days", binance: "1h", limit: 168 },
  "10d": { label: "10 Days", binance: "1h", limit: 240 },
  "30d": { label: "30 Days", binance: "4h", limit: 180 },
  "90d": { label: "90 Days", binance: "12h", limit: 180 },
};

const currencySymbols = {
  USDT: "$",
  BUSD: "$",
  BTC: "₿",
  ETH: "Ξ",
};

const TopCoinsChart = () => {
  const [topCoins, setTopCoins] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [chartData, setChartData] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState("1h");
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
        }));

      setTopCoins(usdtPairs);

      if (!usdtPairs.find((coin) => coin.symbol === selectedSymbol)) {
        setSelectedSymbol(usdtPairs[0]?.symbol || "BTCUSDT");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchChartData = async () => {
    try {
      const intervalInfo = intervalOptions[selectedInterval];
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${selectedSymbol}&interval=${intervalInfo.binance}&limit=${intervalInfo.limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch chart data");

      const data = await res.json();
      const formatted = data.map((entry) => {
        const timestamp = entry[0];
        const price = parseFloat(entry[4]);
        const dateObj = new Date(timestamp);
        const formattedDate =
          selectedInterval === "1h"
            ? dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : dateObj.toLocaleDateString([], {
                month: "short",
                day: "numeric",
              });

        return {
          timestamp,
          price: Number(price.toFixed(4)),
          date: formattedDate,
        };
      });

      setChartData(formatted);
      setError(null);
    } catch (err) {
      setError(err.message);
      setChartData([]);
    }
  };

  useEffect(() => {
    fetchTopCoins();
  }, []);

  useEffect(() => {
    if (!selectedSymbol) return;
    fetchChartData();
    const interval = setInterval(fetchChartData, 60000);
    return () => clearInterval(interval);
  }, [selectedSymbol, selectedInterval]);

  const yTicks =
    chartData.length > 0
      ? (() => {
          const prices = chartData.map((d) => d.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          const step = (max - min) / 10;
          return Array.from({ length: 11 }, (_, i) => min + step * i);
        })()
      : [];

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-300 py-20">
        Loading chart data...
      </div>
    );
  }

  const now = new Date().getTime();
  let currentIndex = chartData.findIndex((d) => d.timestamp >= now);
  if (currentIndex === -1) currentIndex = chartData.length - 1;

  const quoteCurrency = selectedSymbol.replace(/^[A-Z]+/, "");
  const currencySymbol = currencySymbols[quoteCurrency] || "$";

  return (
    <div className="bg-white/10 text-white rounded-xl p-6 shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Top Coins Chart: {selectedSymbol}
      </h2>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <label className="mr-2 font-medium">Select Coin:</label>
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="bg-black text-white px-3 py-1 rounded-lg"
        >
          {topCoins.map((coin) => (
            <option key={coin.symbol} value={coin.symbol}>
              {coin.name}
            </option>
          ))}
        </select>

        <div className="ml-auto flex gap-2 flex-wrap">
          {Object.entries(intervalOptions).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setSelectedInterval(key)}
              className={`px-3 py-1 rounded-lg border ${
                selectedInterval === key
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ReLineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 50, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="date"
            tick={{ fill: "white" }}
            tickLine={false}
            axisLine={{ stroke: "#888" }}
          />
          <YAxis
            domain={["dataMin", "dataMax"]}
            ticks={yTicks}
            tickFormatter={(value) =>
              `${currencySymbol}${value.toLocaleString(undefined, {
                maximumFractionDigits: 4,
              })}`
            }
            tick={{ fill: "white" }}
            tickLine={false}
            axisLine={{ stroke: "#888" }}
          />
          <Tooltip
            formatter={(value) =>
              `${currencySymbol}${Number(value).toLocaleString(undefined, {
                maximumFractionDigits: 4,
              })}`
            }
            contentStyle={{ backgroundColor: "#222", borderRadius: "8px" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ color: "white" }}
          />
          <ReferenceLine
            x={chartData[currentIndex]?.date}
            stroke="yellow"
            label="Now"
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#14ff04"
            dot={false}
            strokeWidth={2}
            name={`${selectedSymbol} Price`}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCoinsChart;
