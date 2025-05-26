import React from "react";
import HeroSec from "./HeroSec";
import { FaRocket, FaChartLine } from "react-icons/fa";
import { Typewriter } from "./Typewriter";
import { Link } from "react-router-dom";

const stats = [
  { label: "Coins Tracked", value: "500+" },
  { label: "Active Traders", value: "10K+" },
  { label: "Daily Volume", value: "$2B+" },
];

const Homepage = () => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between px-4 sm:px-6 md:px-12 py-16 overflow-hidden text-white">
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <span className="absolute rounded-full bg-indigo-700 opacity-20 w-56 h-56 -top-20 -left-16 animate-pulseSlow sm:w-72 sm:h-72 sm:-top-24 sm:-left-20"></span>
        <span className="absolute rounded-full bg-pink-700 opacity-20 w-72 h-72 -bottom-24 -right-20 animate-pulseSlow sm:w-96 sm:h-96 sm:-bottom-32 sm:-right-28"></span>
        <span className="absolute bg-purple-800 opacity-10 w-64 h-64 top-1/3 left-1/2 -translate-x-1/2 rounded-full animate-pulseSlow sm:w-80 sm:h-80"></span>
      </div>

      <div className="max-w-4xl w-full text-center mt-10 space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-wide drop-shadow-lg leading-tight">
          <HeroSec texts={["SEE THE SIGNS", "MAKE THE MOVE", "CryptoKart"]} />
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-16 sm:mt-24 justify-center w-full max-w-md">
        <Link
          to="/signin"
          className="flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 transition rounded-lg px-6 py-3 font-bold shadow-lg text-white text-lg w-full sm:w-auto"
        >
          <FaRocket /> Get Started
        </Link>

        <Link
          to="/marketplace"
          className="flex justify-center items-center gap-2 border border-white rounded-lg px-6 py-3 font-semibold hover:bg-white hover:text-purple-900 transition text-lg w-full sm:w-auto"
        >
          <FaChartLine /> Explore Market
        </Link>
      </div>

      <div className="mt-10 sm:mt-16">
        <Typewriter
          text={[
            "Real-time crypto trends,",
            "prices,",
            "and predictions.",
            "Analyze and trade smarter.",
          ]}
          speed={90}
          loop={true}
          className="inline-block text-lg sm:text-xl"
        />
      </div>

      <div className="mt-16 sm:mt-20 mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 max-w-5xl w-full px-4 text-center">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {value}
            </p>
            <p className="text-base sm:text-lg font-medium opacity-80">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
