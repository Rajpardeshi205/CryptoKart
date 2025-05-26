import React, { useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { MdCurrencyBitcoin } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FcSalesPerformance } from "react-icons/fc";
import { useUserData } from "./useUserData";
import { toast } from "react-hot-toast";

const Buttons1 = ({ coinPrice = 2000 }) => {
  const { userData, updateBalance } = useUserData();
  const [showBalanceOptions, setShowBalanceOptions] = useState(false);
  const [amount, setAmount] = useState("");

  const buttonClass =
    "text-white bg-white/20 backdrop-blur-md " +
    "hover:bg-white/30 focus:ring-4 focus:outline-none focus:ring-blue-300 " +
    "shadow-[inset_3px_3px_10px_rgba(255,255,255,0.4),_-1px_-1px_6px_rgba(0,0,0,0.2),4px_4px_8px_rgba(0,0,0,0.2)] " +
    "font-medium rounded-lg text-xs px-3 py-2 " +
    "text-center flex flex-col items-start justify-center gap-2 min-w-[160px] h-[100px]";

  const handleAdd = () => {
    if (!amount || isNaN(amount)) {
      toast.error("Please enter a valid amount");
      return;
    }
    updateBalance(Number(amount), "add");
    toast.success(`Added ₹${amount} to your balance`);
    setAmount("");
  };

  const handleWithdraw = () => {
    if (!amount || isNaN(amount)) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (userData?.balance < amount) {
      toast.error("Insufficient balance!");
      return;
    }
    updateBalance(-Number(amount), "withdraw");
    toast.success(`Withdrew ₹${amount} from your balance`);
    setAmount("");
  };

  return (
    <div>
      <div className="mt-8 flex flex-nowrap overflow-x-auto gap-4 justify-evenly">
        {/* Spending */}
        <div className="flex flex-col items-center min-w-[160px]">
          <button className={buttonClass}>
            <FaRupeeSign className="text-3xl" />
            <div>
              <span className="text-sm">Spending</span>
              <div className="font-semibold text-base">
                ₹{userData?.spending ?? 0}
              </div>
            </div>
          </button>
        </div>

        {/* Sale */}
        <div className="flex flex-col items-center min-w-[160px]">
          <button className={buttonClass}>
            <FcSalesPerformance className="text-3xl" />
            <div>
              <span className="text-sm">Sale</span>
              <div className="font-semibold text-base">
                ₹{userData?.sale ?? 0}
              </div>
            </div>
          </button>
        </div>

        {/* Earnings */}
        <div className="flex flex-col items-center min-w-[160px]">
          <button className={buttonClass}>
            <FaMoneyBillTrendUp className="text-3xl" />
            <div>
              <span className="text-sm">Earnings</span>
              <div className="font-semibold text-base">
                ₹{(userData?.earnings ?? 0) * coinPrice}
              </div>
            </div>
          </button>
        </div>

        {/* Balance */}
        <div className="flex flex-col items-center min-w-[160px]">
          <button
            className={buttonClass}
            onClick={() => setShowBalanceOptions((prev) => !prev)}
          >
            <MdCurrencyBitcoin className="text-3xl" />
            <div>
              <span className="text-sm">Your Balance</span>
              <div className="font-semibold text-base">
                ₹{userData?.balance ?? 0}
              </div>
            </div>
          </button>
          {showBalanceOptions && (
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border border-gray-400 rounded px-2 py-1 text-black w-full"
              />
              <button
                className="bg-green-500 text-white px-3 rounded"
                onClick={handleAdd}
              >
                Add
              </button>
              <button
                className="bg-red-500 text-white px-3 rounded"
                onClick={handleWithdraw}
              >
                Withdraw
              </button>
            </div>
          )}
        </div>

        {/* Profit */}
        <div className="flex flex-col items-center min-w-[160px]">
          <button className={buttonClass}>
            <FaMoneyBillTrendUp className="text-3xl" />
            <div>
              <span className="text-sm">Profit</span>
              <div className="font-semibold text-base">
                ₹{userData?.profit ?? 0}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buttons1;
