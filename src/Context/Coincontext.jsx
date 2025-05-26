import { createContext, useEffect, useState } from "react";

export const CoinContext = createContext();

const CoinContextProvider = ({ children }) => {
  const [allCoin, setAllCoin] = useState([]);

  // Use lowercase for currency name consistently
  const [Currency, setCurrency] = useState({ name: "usd", symbol: "$" });

  const fetchAllCoin = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-qxhq3ccNxpbRwqYtpFGCF6HE",
        },
      };

      // Fetch CoinGecko coins based on selected currency
      const coingeckoRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${Currency.name}&order=market_cap_rank&per_page=250&page=1&sparkline=false`,
        options
      );
      const coingeckoData = await coingeckoRes.json();

      // Fetch Binance prices
      const binanceRes = await fetch(
        "https://api.binance.com/api/v3/ticker/price"
      );
      const binanceData = await binanceRes.json();

      // Map CoinGecko currency to Binance pairs
      const binanceCurrency =
        Currency.name.toUpperCase() === "USD"
          ? "USDT"
          : Currency.name.toUpperCase();

      // Filter Binance prices for pairs that end with the currency (e.g. BTCUSDT)
      const filteredBinance = binanceData
        .filter((item) => item.symbol.endsWith(binanceCurrency))
        .map((item) => {
          const baseSymbol = item.symbol.replace(binanceCurrency, ""); // e.g. BTC from BTCUSDT
          return {
            id: item.symbol.toLowerCase(),
            symbol: baseSymbol.toLowerCase(),
            current_price: parseFloat(item.price),
            image: `https://cryptoicon-api.vercel.app/api/icon/${baseSymbol.toLowerCase()}`,
          };
        });

      // Merge Binance price info into CoinGecko coins, fallback to CoinGecko price/image
      const mergedCoins = coingeckoData.map((coin) => {
        const binanceCoin = filteredBinance.find(
          (b) => b.symbol.toLowerCase() === coin.symbol.toLowerCase()
        );
        return {
          ...coin,
          current_price: binanceCoin
            ? binanceCoin.current_price
            : coin.current_price,
          image: coin.image || (binanceCoin ? binanceCoin.image : null),
        };
      });

      setAllCoin(mergedCoins);
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  // Refetch coins every time the Currency changes
  useEffect(() => {
    fetchAllCoin();
  }, [Currency]);

  // The context value: all coins + current currency + setter
  const contextValue = {
    allCoin,
    Currency,
    setCurrency,
  };

  return (
    <CoinContext.Provider value={contextValue}>{children}</CoinContext.Provider>
  );
};

export default CoinContextProvider;
