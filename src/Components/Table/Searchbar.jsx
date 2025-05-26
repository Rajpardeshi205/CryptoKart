import React, { useState } from "react";

const Searchbar = ({ allCoin, setDisplayCoin }) => {
  const [inputValue, setInputValue] = useState("");

  const inputValueHandler = (event) => {
    setInputValue(event.target.value);
    searchHandler(event.target.value);
  };

  const searchHandler = (value) => {
    console.log("Searching for:", value);

    if (value === "") {
      setDisplayCoin(allCoin);
      return;
    }

    const filteredCoins = allCoin.filter((coin) =>
      coin.name.toLowerCase().includes(value.toLowerCase())
    );

    console.log("Filtered coins:", filteredCoins);
    setDisplayCoin(filteredCoins);
  };

  return (
    <form className="flex gap-2">
      <input
        type="text"
        placeholder="Search coin..."
        value={inputValue}
        onChange={inputValueHandler}
        className="px-3 py-2 rounded-md bg-white/20 text-white focus:outline-none"
        list="coinlist"
      />
      <datalist id="coinlist">
        {allCoin.map((item, index) => (
          <option key={index} value={item.name} />
        ))}
      </datalist>
    </form>
  );
};

export default Searchbar;
