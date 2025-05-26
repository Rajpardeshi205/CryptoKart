import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./Signin/Signin";
import Layout from "./Components/Layout";
import Table from "./Components/Table/Table";
import Coin from "./Components/Coins Data/Coin";
import Marketplace from "./Components/Marketplace/Marketplace";
import Dashboard from "./Components/Dashboard/Dashboard";
import Homepage from "./Components/Homepage/Homepage";
import Signup from "./Signin/Signup";
import { Toaster } from "react-hot-toast";
import Profile from "./Components/Profile/Profile";

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          marginLeft: "255px",
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Homepage />
            </Layout>
          }
        />
        <Route
          path="/signin"
          element={
            <Layout>
              <Signin />
            </Layout>
          }
        />
        <Route
          path="/signin/Signup"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />
        <Route
          path="/Dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/table"
          element={
            <Layout>
              <Table />
            </Layout>
          }
        />
        <Route
          path="/marketplace"
          element={
            <Layout>
              <Marketplace />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/Coin/:id"
          element={
            <Layout>
              <Coin />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
