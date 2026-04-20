import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(true);

  // Load theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-7 py-3 bg-white/70 dark:bg-black/70 backdrop-blur-lg text-black dark:text-white border-b border-gray-200 dark:border-gray-800">
      {/* Left - Logo */}
      <h1 className="text-2xl font-extrabold">MyGPT</h1>

      {/* Center - Navigation */}
      <div className="hidden md:flex space-x-10 font-medium">
        <button
          onClick={() => scrollToSection("about")}
          className="hover:text-gray-400"
        >
          About
        </button>
        <button
          onClick={() => scrollToSection("support")}
          className="hover:text-gray-400"
        >
          Support
        </button>
        <button
          onClick={() => scrollToSection("contact")}
          className="hover:text-gray-400"
        >
          Contact
        </button>
      </div>

      {/* Right - Theme Toggle + Auth */}
      <div className="flex items-center space-x-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
