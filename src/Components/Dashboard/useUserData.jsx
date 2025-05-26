import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

export function useUserData() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        setUserData(null);
        return;
      }
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData(null);
      }
    };

    fetchUserData();
  }, [auth.currentUser]);

  const updateBalance = async (amount, action) => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);

    let newBalance = (userData?.balance ?? 0) + amount;

    if (newBalance < 0) {
      alert("Insufficient balance!");
      return;
    }

    await updateDoc(userRef, { balance: newBalance });

    setUserData((prev) => ({ ...prev, balance: newBalance }));
  };

  return { userData, updateBalance };
}
