import React, { useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Message from "./components/Message";
import Chatbox from "./components/Chatbox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Loading from "./pages/Loading";
import { assets } from "./assets/assets";
import { useAppContext } from "./context/AppContext";
import "./assets/prism.css";
import { Toaster } from "react-hot-toast";
import Frontpage from "./Landing/Frontpage";

const App = () => {
  const { user, loadingUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (loadingUser) return <Loading />;

  // Authenticated routes layout
  const AuthenticatedLayout = () => (
    <div className="dark:bg-gradient-to-b dark:from-[#242124] dark:to-[#000000] dark:text-white">
      <div className="flex h-screen w-screen p-2">
        {!isMenuOpen && (
          <img
            src={assets.menu_icon}
            className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
            onClick={() => setIsMenuOpen(true)}
          />
        )}
        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Routes>
          <Route path="/chat" element={<Chatbox />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/community" element={<Community />} />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
        <Message />
      </div>
    </div>
  );

  // Public routes layout
  const PublicLayout = () => (
    <>
      <Routes>
        <Route path="/" element={<Frontpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );

  return (
    <>
      <Toaster />
      {user ? <AuthenticatedLayout /> : <PublicLayout />}
    </>
  );
};

export default App;
