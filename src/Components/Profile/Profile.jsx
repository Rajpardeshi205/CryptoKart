import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import { auth, fireDB, storage } from "../Firebase/FirebaseConfig";
import ProfileCoins from "./ProfileCoins";
import { useUserData } from "../Dashboard/useUserData";

const Profile = () => {
  const { userData } = useUserData();

  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhoto, setNewPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(fireDB, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({
            ...userData,
            uid: firebaseUser.uid,
            authRef: firebaseUser,
          });
          setNewName(userData.name);
          setNewEmail(firebaseUser.email);
          setNewPhoto(
            userData.photo || "https://randomuser.me/api/portraits/men/1.jpg"
          );
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (file) => {
    if (!user || !file) return;

    setUploading(true);
    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setNewPhoto(downloadURL);
      toast.success("Profile picture uploaded!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!user) return;

    try {
      const userRef = doc(fireDB, "users", user.uid);

      await updateDoc(userRef, {
        name: newName,
        photo: newPhoto,
        email: newEmail,
      });

      if (auth.currentUser.email !== newEmail) {
        await updateEmail(auth.currentUser, newEmail);
        toast.success("Email updated");
      }

      if (newPassword.length > 0) {
        await updatePassword(auth.currentUser, newPassword);
        toast.success("Password updated");
        setNewPassword("");
      }

      toast.success("Profile updated!");
      setUser((prev) => ({
        ...prev,
        name: newName,
        photo: newPhoto,
        email: newEmail,
      }));
    } catch (err) {
      console.error("Update error:", err);
      if (err.code === "auth/requires-recent-login") {
        toast.error("Re-authentication required. Please sign in again.");
      } else {
        toast.error("Update failed.");
      }
    }
  };

  if (loading)
    return (
      <div className="text-white text-center mt-10">Loading profile...</div>
    );

  return (
    <div className="min-h-screen px-4 py-10 text-white max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">User Profile</h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left - Profile Form */}
        <div className="flex-1 p-6 bg-zinc-800 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <img
              src={newPhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-gray-700 object-cover"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="text-sm text-gray-300"
            />
            {uploading && <p className="text-sm text-blue-400">Uploading...</p>}

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Username"
              className="w-full text-black px-4 py-2 rounded-lg bg-zinc-700 text-sm focus:outline-none"
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              className="w-full text-black px-4 py-2 rounded-lg bg-zinc-700 text-sm focus:outline-none"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password (optional)"
              className="w-full text-black px-4 py-2 rounded-lg bg-zinc-700 text-sm focus:outline-none"
            />

            <button
              onClick={handleUpdate}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Update Profile
            </button>
          </div>
          <div className="text-center text-gray-400 text-sm mt-4">
            UID: {user?.uid}
          </div>
        </div>

        {/* Right - Additional Info */}
        <div className="flex-1 p-6 bg-zinc-800 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Your Details</h3>
          <p>
            <strong>Name:</strong> {userData?.name}
          </p>
          <p>
            <strong>Email:</strong> {userData?.email}
          </p>
          <p>
            <strong>Balance:</strong> ₹{userData?.balance ?? 0}
          </p>
          <p>
            <strong>Earnings:</strong> ₹{userData?.earnings ?? 0}
          </p>

          {/* Portfolio */}
          <ProfileCoins portfolio={userData?.portfolio} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
