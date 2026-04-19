import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// default url
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

// 🔥 NEW: Global Axios Interceptor for Bearer Tokens
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // console.log(`🚀 Sending Request to ${config.url} with token`);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChats, setSelectedChats] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch authenticated user
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }

    try {
      const { data } = await axios.get("/api/user/data");

      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // Create a new chat
  const createNewchat = async () => {
    const token = localStorage.getItem("token");
    console.log("🛠️ Attempting to create chat. Token present:", !!token);

    if (!user || !token) {
      toast.error("Login to create a new chat");
      return;
    }

    try {
      const { data } = await axios.post("/api/chat/create-chat");

      if (data.createdChat) {
        setChats((prev) => [data.createdChat, ...prev]);
        setSelectedChats(data.createdChat);
        navigate("/");
      }
    } catch (error) {
      console.error("🚨 Create Chat Error:", error.response?.data || error.message);
      toast.error("Failed to create chat");
    }
  };

  // Fetch all user chats
  const fetchUserChats = async () => {
    try {
      const { data } = await axios.get("/api/chat/get-chat");

      if (data.success) {
        setChats(data.chats);

        if (data.chats.length === 0) {
          await createNewchat(); // Auto-create first chat if none exist
        } else {
          setSelectedChats(data.chats[0]); // Select the most recent chat
        }
      }
    } catch (error) {
      toast.error("Failed to fetch chats");
      setChats([]);
      setSelectedChats(null);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post("/api/user/logout");
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setChats([]);
      setSelectedChats(null);
      navigate("/login");
    }
  };

  // Effects
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectedChats(null);
    }
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Removed empty useEffect

  const value = {
    navigate,
    user,
    setUser,
    fetchUser,
    fetchUserChats,
    logout,
    chats,
    setChats,
    selectedChats,
    setSelectedChats,
    theme,
    setTheme,
    createNewchat,
    loadingUser,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
