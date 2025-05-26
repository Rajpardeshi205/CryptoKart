import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYApVDzT32-pZ9myFV6pInxf7zUg8s77Q",
  authDomain: "cryptokart-c4200.firebaseapp.com",
  projectId: "cryptokart-c4200",
  storageBucket: "cryptokart-c4200.firebasestorage.app",
  messagingSenderId: "746857105313",
  appId: "1:746857105313:web:a71e541ffe83cb77972de0",
  measurementId: "G-X5EEF81GVB",
};

const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { fireDB, auth, googleProvider, storage };
