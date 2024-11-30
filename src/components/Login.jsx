import React, { useState, useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { FaRadio, FaHeadphones, FaMusic, FaGlobe } from "react-icons/fa6";
import {
  FaShieldAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaSpinner,
} from "react-icons/fa";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { saveToLocalStorage } from "../utils/useLocalStorage";

function Login() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      saveToLocalStorage("login", true);

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName,
        });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    setUser(null);
    localStorage.removeItem("login");
  };

  const features = [
    { icon: FaGlobe, text: "Access your favorite radio stations everywhere" },
    {
      icon: FaRadio,
      text: "Listen to custom radio stations with streaming URLs",
    },
    { icon: FaHeadphones, text: "High-quality audio streaming" },
    { icon: FaMusic, text: "Discover new music from around the world" },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <FaSpinner className="w-16 h-16 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full flex items-center justify-center p-4 ">
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        {!user ? (
          <div className="flex flex-col lg:flex-row">
            <div className="p-6 md:p-8 lg:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <FaRadio className="w-8 h-8 text-indigo-400" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  NepTune
                </h1>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">
                Your Personal Radio Companion
              </h2>
              <p className="text-gray-300 mb-6 md:mb-8 text-sm md:text-base">
                Listen to your favorite radio stations anytime, anywhere. Join
                our community of music lovers and discover new sounds from
                around the world.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                    <span className="text-xs md:text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={signInWithGoogle}
                className="w-full bg-white rounded-lg py-2 md:py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl text-gray2 font-bold">G</span>{" "}
                <span className="font-semibold text-sm md:text-base text-gray2">
                  Sign in with Google
                </span>
              </button>
            </div>

            <div className="hidden lg:block lg:w-1/2 relative min-h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80"
                  alt="Radio Background"
                  className="w-full h-full object-cover mix-blend-overlay"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-6 md:p-8 bg-black/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-16 h-16 rounded-full border-3 border-indigo-400"
                    />
                  ) : (
                    <FaUserCircle className="w-16 h-16 text-gray-300" />
                  )}
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {user.displayName}
                    </h2>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-colors">
                <FaRadio className="w-10 h-10 mx-auto text-indigo-400 mb-2" />
                <span className="text-white">My Stations</span>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-colors">
                <FaMusic className="w-10 h-10 mx-auto text-indigo-400 mb-2" />
                <span className="text-white">Playlists</span>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-colors">
                <FaGlobe className="w-10 h-10 mx-auto text-indigo-400 mb-2" />
                <span className="text-white">Discover</span>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-colors">
                <FaHeadphones className="w-10 h-10 mx-auto text-indigo-400 mb-2" />
                <span className="text-white">History</span>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 md:px-8 py-4 bg-black/20 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div className="flex items-center gap-2 text-gray-300">
            <FaShieldAlt className="w-4 h-4" />
            <span className="text-xs md:text-sm">
              Secured by Google Authentication
            </span>
          </div>
          <span className="text-xs md:text-sm text-gray-400">
            © 2024 NepTune
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
