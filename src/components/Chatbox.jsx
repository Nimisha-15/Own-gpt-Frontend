import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";
import { PromptInputBox } from "./PromptInputBox";

const Chatbox = () => {
  const containerRef = useRef(null);

  const { selectedChats, user, axios, setSelectedChats, setChats } =
    useAppContext();

  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const messages = Array.isArray(selectedChats?.messages)
    ? selectedChats.messages
    : [];

  // Auto-scroll to bottom on new messages or loading
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleSend = async (message) => {
    if (!message.trim()) return;

    const fakeEvent = {
      preventDefault: () => {},
    };

    setPrompt(message);

    setTimeout(() => {
      onSubmit(fakeEvent);
    }, 0);
  };

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!prompt.trim() || !user || !selectedChats?._id || loading) return;

      const currentPrompt = prompt.trim();

      setPrompt("");

      const userMessage = {
        _id: Date.now().toString(),
        role: "user",
        content: currentPrompt,
        timestamp: Date.now(),
        isImage: false,
      };

      const typingMessage = {
        _id: "typing",
        isTyping: true,
      };

      setSelectedChats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [
            ...(Array.isArray(prev.messages) ? prev.messages : []),
            userMessage,
            typingMessage,
          ],
          updatedAt: new Date().toISOString(),
        };
      });

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChats._id
            ? {
                ...chat,
                messages: [
                  ...(Array.isArray(chat.messages) ? chat.messages : []),
                  userMessage,
                  typingMessage,
                ],
                updatedAt: new Date().toISOString(),
              }
            : chat,
        ),
      );

      setLoading(true);

      try {
        const { data } = await axios.post(`/api/message/${mode}`, {
          chatId: selectedChats._id,
          prompt: currentPrompt,
          isPublished,
        });

        // Use the server chat as the single source of truth
        if (data.success && data.chat) {
          setSelectedChats(data.chat);
          setChats((prev) =>
            prev.map((chat) => (chat._id === data.chat._id ? data.chat : chat)),
          );
        } else {
          throw new Error(data.message || "Failed to send message");
        }
      } catch (error) {
        setSelectedChats((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: (Array.isArray(prev.messages)
              ? prev.messages
              : []
            ).filter((m) => m._id !== "typing"),
          };
        });

        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    },
    [prompt, user, selectedChats, loading, mode, isPublished, axios],
  );

  // Allow Enter key to submit (Shift+Enter for newline if needed)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        onSubmit(e);
      }
    },
    [onSubmit],
  );

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-14">
      {/* ── CHAT MESSAGES ── */}
      <div ref={containerRef} className="flex-1 mb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-1 text-primary">
            <img
              className="w-full max-w-[200px] sm:max-w-[248px]"
              src={assets.custom_logo}
              alt="Logo"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask me anything...
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <Message
              key={msg._id ?? `${msg.timestamp ?? ""}-${index}`}
              message={msg}
            />
          ))
        )}
      </div>

      {/* ── PUBLISH TOGGLE (image mode only) ── */}
      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 mx-auto cursor-pointer select-none">
          <span className="text-xs">Publish generated image to Community</span>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      <div className="max-w-3xl mx-auto w-full">
        <PromptInputBox
          isLoading={loading}
          placeholder={
            mode === "image" ? "Describe the image..." : "Ask anything..."
          }
          onSend={handleSend}
        />
      </div>

      {/* jjj */}
    </div>
  );
};

export default Chatbox;
