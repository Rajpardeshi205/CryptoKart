import React, { useContext, useState, useEffect } from "react";
import { CoinContext } from "../../Context/CoinContext";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import Searchbar from "../Table/Searchbar";
import toast from "react-hot-toast";

const CryptoMarket = () => {
  const { allCoin, Currency, setCurrency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState(allCoin);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeType, setTradeType] = useState("");
  const [userData, setUserData] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        setUserData(null);
        return;
      }
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());
      } else {
        const initialData = {
          balance: 0,
          spending: 0,
          earnings: 0,
          sale: 0,
          coinsCount: 0,
          profit: 0,
          portfolio: {},
          currency: Currency.name,
        };
        await setDoc(userDocRef, initialData);
        setUserData(initialData);
      }
    };
    fetchUserData();
  }, [auth.currentUser, db, Currency.name]);

  const openTradeModal = (coin, type) => {
    setSelectedCoin(coin);
    setTradeType(type);
    setTradeAmount("");
  };

  const closeTradeModal = () => {
    setSelectedCoin(null);
    setTradeAmount("");
    setTradeType("");
  };

  const handleTrade = async () => {
    if (!tradeAmount || isNaN(tradeAmount) || tradeAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!userData) {
      toast.error("User not logged in or data not loaded.");
      return;
    }

    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const tradeQty = Number(tradeAmount);
    const coinPrice = selectedCoin.current_price;
    const totalCost = tradeQty * coinPrice;

    if (tradeType === "buy") {
      if (userData.balance < totalCost) {
        toast.error("Insufficient balance to buy.");
        return;
      }
      try {
        const portfolio = { ...userData.portfolio };
        const coinId = selectedCoin.id;

        if (portfolio[coinId]) {
          const existing = portfolio[coinId];
          const newAmount = existing.amount + tradeQty;
          const newAvgPrice =
            (existing.amount * existing.avgPrice + totalCost) / newAmount;
          portfolio[coinId] = {
            amount: newAmount,
            avgPrice: newAvgPrice,
            symbol: selectedCoin.symbol,
            name: selectedCoin.name,
          };
        } else {
          portfolio[coinId] = {
            amount: tradeQty,
            avgPrice: coinPrice,
            symbol: selectedCoin.symbol,
            name: selectedCoin.name,
          };
        }

        const coinsCount = Object.keys(portfolio).length;

        await updateDoc(userDocRef, {
          balance: userData.balance - totalCost,
          spending: increment(totalCost),
          portfolio,
          coinsCount,
        });

        toast.success(
          `Bought ${tradeAmount} ${selectedCoin.symbol.toUpperCase()}`
        );

        setUserData((prev) => ({
          ...prev,
          balance: prev.balance - totalCost,
          spending: (prev.spending || 0) + totalCost,
          portfolio,
          coinsCount,
        }));

        closeTradeModal();
      } catch (err) {
        console.error("Error buying coin:", err);
        toast.error("Failed to complete buy trade. Try again.");
      }
    } else if (tradeType === "sell") {
      const portfolio = { ...userData.portfolio };
      const coinId = selectedCoin.id;
      const owned = portfolio[coinId];

      if (!owned || owned.amount < tradeQty) {
        toast.error("Insufficient coin amount to sell.");
        return;
      }

      try {
        const revenue = totalCost;
        let newPortfolio = { ...portfolio };
        let newCoinsCount = userData.coinsCount;

        if (owned.amount === tradeQty) {
          delete newPortfolio[coinId];
          newCoinsCount = Object.keys(newPortfolio).length;
        } else {
          newPortfolio[coinId] = {
            ...owned,
            amount: owned.amount - tradeQty,
          };
        }

        const profitFromTrade = revenue - owned.avgPrice * tradeQty;

        await updateDoc(userDocRef, {
          balance: userData.balance + revenue,
          profit: increment(profitFromTrade),
          sale: increment(revenue),
          portfolio: newPortfolio,
          coinsCount: newCoinsCount,
        });

        toast.success(
          `Sold ${tradeAmount} ${selectedCoin.symbol.toUpperCase()}`
        );

        setUserData((prev) => ({
          ...prev,
          balance: prev.balance + revenue,
          profit: (prev.profit || 0) + profitFromTrade,
          sale: (prev.sale || 0) + revenue,
          portfolio: newPortfolio,
          coinsCount: newCoinsCount,
        }));

        closeTradeModal();
      } catch (err) {
        console.error("Error selling coin:", err);
        toast.error("Failed to complete sell trade. Try again.");
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Crypto Market ({Currency.name.toUpperCase()})
      </h1>

      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <label className="mr-4 font-semibold">Currency:</label>
          <select
            value={Currency.name}
            onChange={(e) =>
              setCurrency({
                name: e.target.value,
                symbol:
                  e.target.value === "usd" ? "$" : e.target.value.toUpperCase(),
              })
            }
            className="border bg-black border-gray-300 rounded px-2 py-1"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="inr">INR</option>
          </select>
        </div>

        <Searchbar allCoin={allCoin} setDisplayCoin={setDisplayCoin} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayCoin.length === 0 && <p>No coins found.</p>}
        {displayCoin.map((coin) => (
          <div
            key={coin.id}
            className="border rounded-lg p-4 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={coin.image}
              alt={coin.name}
              className="w-16 h-16 mb-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/64";
              }}
            />
            <h2 className="text-lg font-semibold">{coin.name}</h2>
            <p className="text-sm text-gray-500 uppercase">{coin.symbol}</p>
            <p className="text-xl font-bold my-2">
              {Currency.symbol}
              {coin.current_price.toFixed(4)}
            </p>

            <div className="flex gap-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                onClick={() => openTradeModal(coin, "buy")}
              >
                Buy
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                onClick={() => openTradeModal(coin, "sell")}
              >
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCoin && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeTradeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">
              {tradeType === "buy" ? "Buy" : "Sell"} {selectedCoin.name} (
              {selectedCoin.symbol.toUpperCase()})
            </h3>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="Amount"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              className="border text-black rounded w-full px-3 py-2 mb-4"
            />
            <button
              className={`w-full py-2 rounded text-white ${
                tradeType === "buy" ? "bg-green-600" : "bg-red-600"
              } hover:opacity-90`}
              onClick={handleTrade}
            >
              Confirm {tradeType === "buy" ? "Buy" : "Sell"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoMarket;
