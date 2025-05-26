import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fireDB } from "../Components/Firebase/FirebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Header = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [firestoreUser, setFirestoreUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);

      if (currentUser) {
        try {
          const userRef = doc(fireDB, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setFirestoreUser(userSnap.data());
          } else {
            console.warn("No user document found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user from Firestore:", error);
        }
      } else {
        setFirestoreUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setFirestoreUser(null);
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const routeMap = {
    Homepage: "/",
    Dashboard: "/dashboard",
    Marketplace: "/marketplace",
    Table: "/table",
    Profile: "/profile",
    "Sign in": "/signin",
  };

  const menuItems = [
    "Homepage",
    "Dashboard",
    "Marketplace",
    "Table",
    ...(firebaseUser ? ["Profile"] : []),
    firebaseUser ? "Logout" : "Sign in",
  ];

  return (
    <div
      className={`fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 z-40
        p-6 text-white transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:w-64 rounded-r-lg`}
    >
      <h1 className="text-2xl font-bold mb-6 ml-12">CryptoKart</h1>

      {firebaseUser && firestoreUser && (
        <div className="flex flex-col items-center mb-6">
          <img
            src={"https://randomuser.me/api/portraits/men/1.jpg"}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-white mb-2"
          />
          <p className="text-lg font-semibold text-center">
            {firestoreUser.name || firebaseUser.email}
          </p>
        </div>
      )}

      <nav className="flex flex-col gap-4">
        {menuItems.map((label) => {
          const isLogout = label === "Logout";

          return isLogout ? (
            <button
              key="Logout"
              onClick={handleLogout}
              className="relative flex justify-center items-center gap-2 border-4 border-[#000] rounded-xl text-[#FFF] font-black bg-transparent uppercase px-8 py-4 z-10 overflow-hidden ease-in-out duration-700 group hover:text-[#000] hover:bg-[#FFF] active:scale-95 active:duration-0 focus:bg-[#FFF] focus:text-[#000] isolation-auto"
            >
              <span className="truncate">{label}</span>

              <svg
                className="fill-[#FFF] group-hover:fill-[#000] group-hover:-translate-x-0 group-active:translate-x-96 group-focus:translate-x-96 ease-in-out duration-700"
                viewBox="0 0 512 512"
                height="16"
                width="16"
              >
                <path d="m476.59 227.05..."></path>
              </svg>
            </button>
          ) : (
            <Link
              key={label}
              to={routeMap[label]}
              className="relative flex justify-center items-center gap-2 border-4 border-[#000] rounded-xl text-[#FFF] font-black bg-transparent uppercase px-8 py-4 z-10 overflow-hidden ease-in-out duration-700 group hover:text-[#000] hover:bg-[#FFF] active:scale-95 active:duration-0 focus:bg-[#FFF] focus:text-[#000] isolation-auto"
            >
              <span className="truncate">{label}</span>

              <svg
                className="fill-[#FFF] group-hover:fill-[#000] group-hover:-translate-x-0 group-active:translate-x-96 group-focus:translate-x-96 ease-in-out duration-700"
                viewBox="0 0 512 512"
                height="16"
                width="16"
              >
                <path d="m476.59 227.05..."></path>
              </svg>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Header;
