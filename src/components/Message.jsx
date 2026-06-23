import React, { useEffect, useMemo, useRef } from "react";
import { assets } from "../assets/assets";
import Markdown from "react-markdown";
import Prism from "prismjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Message = React.memo(({ message }) => {
  const messageRef = useRef(null);

  // Highlight only this message
  useEffect(() => {
    if (messageRef.current) {
      Prism.highlightAllUnder(messageRef.current);
    }
  }, [message?.content]);

  if (!message || typeof message !== "object") return null;

  const isUser = message.role === "user";
  const isImage = message.isImage;

  const timestamp = useMemo(() => {
    return message.timestamp ? dayjs(message.timestamp).fromNow() : "";
  }, [message.timestamp]);

  const markdownContent = useMemo(() => {
    return <Markdown>{message.content}</Markdown>;
  }, [message.content]);

  // Typing Indicator
  if (message.isTyping) {
    return (
      <div className="flex items-start gap-3 my-4">
        <img
          src={assets.logo_icon}
          className="w-8 h-8 rounded-full object-cover shrink-0"
          alt="AI"
        />

        <div className="inline-flex items-center gap-1.5 p-4 bg-primary/30 dark:bg-[#4d95ab]/30 border border-[#80609F]/30 rounded-xl">
          {[0, 0.2, 0.4].map((delay, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-500 dark:bg-white animate-pulse"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-end gap-3 my-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <img
          src={assets.custom_logo}
          className="w-8 h-8 rounded-full object-cover shrink-0"
          alt="AI"
        />
      )}

      <div
        className={`flex flex-col gap-1 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          ref={messageRef}
          className={`p-4 rounded-2xl text-sm leading-7 overflow-wrap-anywhere max-w-[750px] ${
            isUser
              ? "bg-slate-200 dark:bg-[#4277a5d4] border border-[#80609F]/30 rounded-br-sm"
              : "bg-primary/20 dark:bg-[#4d95ab]/30 border border-[#80609F]/30 rounded-bl-sm"
          }`}
        >
          {isImage ? (
            <img
              src={message.content}
              alt="Generated"
              loading="lazy"
              decoding="async"
              className="max-w-full max-h-96 rounded-lg object-contain"
            />
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {markdownContent}
            </div>
          )}
        </div>

        {timestamp && (
          <span className="text-xs text-zinc-400 dark:text-[#6bb2c7bf] px-1">
            {timestamp}
          </span>
        )}
      </div>

      {isUser && (
        <img
          src={assets.profile_icon ?? assets.user_icon}
          className="w-8 h-8 rounded-full object-cover shrink-0"
          alt="User"
        />
      )}
    </div>
  );
});

export default Message;
