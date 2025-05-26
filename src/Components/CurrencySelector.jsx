import React, { useContext } from "react";
import { CoinContext } from "../Context/Coincontext";

const CurrencySelector = () => {
  const { setCurrency } = useContext(CoinContext);

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd":
        setCurrency({ name: "usd", symbol: "$" });
        break;
      case "eur":
        setCurrency({ name: "eur", symbol: "€" });
        break;
      case "inr":
        setCurrency({ name: "inr", symbol: "₹" });
        break;
      default:
        setCurrency({ name: "usd", symbol: "$" });
    }
  };

  return (
    <select
      onChange={currencyHandler}
      className="appearance-none text-white bg-white/20 backdrop-blur-md hover:bg-white/30 focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-[inset_3px_3px_10px_rgba(255,255,255,0.4),_-1px_-1px_6px_rgba(0,0,0,0.2),4px_4px_8px_rgba(0,0,0,0.2)] font-medium rounded-lg text-xs px-3 py-2 pr-8 text-center min-w-[160px]"
    >
      <option value="usd" className="bg-black text-white">
        USD ($)
      </option>
      <option value="eur" className="bg-black text-white">
        EUR (€)
      </option>
      <option value="inr" className="bg-black text-white">
        INR (₹)
      </option>
    </select>
  );
};

export default CurrencySelector;
