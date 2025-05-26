import React from "react";
import { Link } from "react-router-dom";

const CryptoChart = ({ displayCoin, Currency }) => {
  if (!displayCoin.length) {
    return <p className="text-white mt-4">No coins to display.</p>;
  }

  return (
    <div className="mt-10 text-white bg-white/20 backdrop-blur-md shadow-[inset_3px_3px_10px_rgba(255,255,255,0.4),_-1px_-1px_6px_rgba(0,0,0,0.2),4px_4px_8px_rgba(0,0,0,0.2)] font-medium rounded-lg text-xs px-3 py-2">
      <div className="grid grid-cols-5 gap-4 text-center">
        <p className="text-lg font-bold truncate">Market Rank</p>
        <p className="text-lg font-bold truncate">Coin</p>
        <p className="text-lg font-bold truncate">Price</p>
        <p className="text-lg font-bold truncate">24 Hr Changes</p>
        <p className="text-lg font-bold truncate">Market Cap</p>
      </div>
      {displayCoin.slice(0, 10).map((item, index) => (
        <div
          key={index}
          className="mt-6 text-white bg-white/20 backdrop-blur-md shadow-[inset_3px_3px_10px_rgba(255,255,255,0.4),_-1px_-1px_6px_rgba(0,0,0,0.2),4px_4px_8px_rgba(0,0,0,0.2)] font-medium rounded-lg text-xs px-3 py-2"
        >
          <Link
            to={`/Coin/${item.id}`}
            className="grid grid-cols-5 gap-4 text-center items-center"
          >
            <p className="text-lg font-bold truncate">{item.market_cap_rank}</p>
            <div className="flex items-center gap-2 justify-start overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 flex-shrink-0"
              />
              <p className="text-lg font-bold truncate">
                {item.name} - {item.symbol.toUpperCase()}
              </p>
            </div>
            <p className="text-lg font-bold truncate">
              {Currency.symbol} {item.current_price.toLocaleString()}
            </p>
            <p
              className={`text-lg font-bold truncate ${
                item.price_change_percentage_24h > 0
                  ? "text-green-900"
                  : "text-red-900"
              }`}
            >
              {item.price_change_percentage_24h
                ? item.price_change_percentage_24h.toFixed(2)
                : "0.00"}
              %
            </p>
            <p className="text-lg font-bold truncate">
              {Currency.symbol} {item.market_cap.toLocaleString()}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CryptoChart;
