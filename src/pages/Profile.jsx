import React from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Profile = () => {
  const { user, logout } = useAppContext();

  return (
    <div className="p-10">
      <div className="max-w-3xl mx-auto bg-[#121212] rounded-3xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="space-y-6">
          <div>
            <p className="text-gray-400">Name</p>
            <p className="text-xl">{user?.name}</p>
          </div>

          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-xl">{user?.email}</p>
          </div>

          <div>
            <p className="text-gray-400">Credits</p>
            <p className="text-xl">💎 {user?.credits}</p>
          </div>

          <div>
            <p className="text-gray-400">Password</p>
            <button className="text-blue-500 hover:underline">
              Change Password
            </button>
          </div>

          <div className="mt-8">
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition"
            >
              <img
                src={assets.logout_icon}
                alt="logout"
                className="w-5 h-5 invert"
              />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
