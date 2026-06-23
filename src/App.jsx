import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
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
import Profile from "./pages/Profile";

const AuthenticatedLayout = ({ isMenuOpen, setIsMenuOpen }) => (
  <div className="flex h-screen w-full overflow-hidden dark:bg-gradient-to-b dark:from-[#242124] dark:to-[#000000] dark:text-white">
    {/* Mobile hamburger — only shown when sidebar is closed */}
    {!isMenuOpen && (
      <img
        src={assets.menu_icon}
        className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert z-20"
        onClick={() => setIsMenuOpen(true)}
        alt="Open menu"
      />
    )}

    <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

    {/* Main content — flex-1 fills remaining width, scrolls independently */}
    <main className="flex-1 h-full overflow-y-auto">
      <Routes>
        <Route path="/chat" element={<Chatbox />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        {/* Default & unknown → chat */}
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </main>
  </div>
);

const PublicLayout = () => (
  <Routes>
    <Route path="/" element={<Frontpage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Login />} />
    {/* Unknown public routes → home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

/* ─────────────────────────────────────────────────────────────────
   App — only owns auth state & menu-open toggle
───────────────────────────────────────────────────────────────── */
const App = () => {
  const { user, loadingUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Show full-screen glass loader while user session is being checked
  if (loadingUser) return <Loading />;

  return (
    <>
      <Toaster position="top-right" />
      {user ? (
        <AuthenticatedLayout
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
      ) : (
        <PublicLayout />
      )}
    </>
  );
};

export default App;
