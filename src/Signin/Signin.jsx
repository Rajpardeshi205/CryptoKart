"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth, fireDB } from "../Components/Firebase/FirebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const saveUserToFirestore = async (user) => {
    const userRef = doc(fireDB, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "No Name",
        email: user.email,
        photoURL: user.photoURL || "",
        createdAt: new Date(),
      });
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await saveUserToFirestore(userCredential.user);
      toast.success("Signed in successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      toast.success("Google sign-in successful!");
    } catch (err) {
      toast.error("Google sign-in failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden w-full rounded-xl">
      <div className="relative hover:translate-y-2 z-10 w-full max-w-sm rounded-3xl bg-radial-[at_25%_25%] from-zinc-700/60 to-zinc-900/60 to-75% backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          CryptoKart
        </h2>
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <div className="text-sm text-red-400 text-left">{error}</div>
            )}
          </div>
          <hr className="opacity-10" />
          <div>
            <button
              onClick={handleSignIn}
              className="w-full bg-white/10 text-white font-medium px-5 py-3 rounded-full shadow hover:bg-white/20 transition mb-3 text-sm"
            >
              Sign in
            </button>
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#232526] to-[#2d2e30] rounded-full px-5 py-3 font-medium text-white shadow hover:brightness-110 transition mb-2 text-sm"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
            <div className="w-full text-center mt-2">
              <span className="text-xs text-gray-400">
                Don't have an account?{" "}
                <Link
                  className="underline text-white/80 hover:text-white"
                  to={"/Signin/Signup"}
                >
                  Sign up, it's free!
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-12 flex flex-col items-center text-center">
        <p className="text-gray-400 text-sm mb-2">
          Join <span className="font-medium text-white">thousands</span> of
          Traders who are already using CryptoKart.
        </p>
        <div className="flex">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
          />
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
          />
          <img
            src="https://randomuser.me/api/portraits/men/54.jpg"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
          />
          <img
            src="https://randomuser.me/api/portraits/women/68.jpg"
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-[#181824] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Signin;
