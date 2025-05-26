import React, { useState } from "react";
import Header from "../Pages/Header";
import Footer from "../Pages/Footer";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-black text-white rounded"
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      <div className="flex flex-1">
        <div
          className={`fixed top-0 left-0 bottom-0 w-64 bg-black text-white z-40 transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:w-64`}
        >
          <Header />
        </div>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          />
        )}

        <div className="flex-1 relative overflow-hidden">
          <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] absolute inset-0 z-0" />
          <main className="relative z-10 p-6 text-white">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
