import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#D7263D",
  "#9D50BB",
  "#00B2CA",
  "#FFA07A",
];

const currencySymbols = {
  usd: "$",
  eur: "€",
  inr: "₹",
};

const BINANCE_TOP_COINS = [
  { name: "Bitcoin", symbol: "BTCUSDT" },
  { name: "Ethereum", symbol: "ETHUSDT" },
  { name: "Binance Coin", symbol: "BNBUSDT" },
  { name: "Ripple", symbol: "XRPUSDT" },
  { name: "Cardano", symbol: "ADAUSDT" },
  { name: "Dogecoin", symbol: "DOGEUSDT" },
  { name: "Polygon", symbol: "MATICUSDT" },
];

const MAX_SLICE_PERCENT = 0.5;

const TopCoinsPieChart = ({ coinId = "BTCUSDT", currency = "usd" }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const formatCurrency = (value) => {
    const symbol = currencySymbols[currency] || "";
    if (value >= 1e9) return `${symbol}${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${symbol}${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${symbol}${(value / 1e3).toFixed(1)}K`;
    return `${symbol}${value.toFixed(2)}`;
  };

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/price");
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const allPrices = await res.json();

        const priceMap = {};
        allPrices.forEach((item) => {
          priceMap[item.symbol] = parseFloat(item.price);
        });

        let formatted = BINANCE_TOP_COINS.map(({ name, symbol }) => ({
          name,
          value: priceMap[symbol] || 0,
        }));

        if (!BINANCE_TOP_COINS.some((c) => c.symbol === coinId)) {
          const selectedPrice = priceMap[coinId] || 0;
          const selectedName = coinId.replace("USDT", "");
          formatted.push({
            name: `${selectedName} (You)`,
            value: selectedPrice,
          });
          setSelectedCoin(selectedName);
        } else {
          setSelectedCoin(coinId.replace("USDT", ""));
        }

        const totalValue = formatted.reduce((acc, coin) => acc + coin.value, 0);
        const maxSliceValue = totalValue * MAX_SLICE_PERCENT;

        formatted = formatted.map((coin) => ({
          ...coin,
          value: Math.min(coin.value, maxSliceValue),
        }));

        setChartData(formatted);
      } catch (err) {
        console.error("Failed to fetch Binance prices:", err);
      }
    }

    fetchPrices();
  }, [coinId]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const words = name.split(" ");
    const lineHeight = 14;
    const color = COLORS[index % COLORS.length];

    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {words.map((word, i) => (
          <tspan key={i} x={x} dy={i === 0 ? 0 : lineHeight}>
            {word}
          </tspan>
        ))}
      </text>
    );
  };

  return (
    <div className="h-[450px] bg-white/10 p-6 rounded-xl shadow-md text-white max-w-full">
      <h2 className="text-xl font-semibold mb-4 truncate">
        {selectedCoin ? `Current Price vs Top 7 Coins (Binance)` : "Loading..."}
      </h2>

      <ResponsiveContainer width="100%" height="85%" minWidth={300}>
        <PieChart className="pt-10">
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={130}
            label={renderCustomizedLabel}
            labelLine={false}
            minAngle={10}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(val) => formatCurrency(val)} />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 12, color: "white" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCoinsPieChart;
