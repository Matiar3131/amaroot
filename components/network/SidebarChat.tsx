"use client";

import React, { RefObject } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Video, 
  X, 
  Paperclip, 
  Send, 
  Smile, 
  MoreVertical 
} from "lucide-react"; 
import { Member, Message } from "@/types/sidebar";

interface SidebarChatProps {
  activeChat: Member;
  messages: Message[];
  currentUserId: string;
  inputMessage: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSend: (e?: React.FormEvent) => void;
  setActiveChat: (chat: Member | null) => void;
  startUpload: (files: File[]) => Promise<void>;
  typingUser: string | null;
  onVideoCall: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SidebarChat({
  activeChat,
  messages,
  currentUserId,
  inputMessage,
  handleInputChange,
  handleSend,
  setActiveChat,
  fileInputRef,
  startUpload,
  typingUser,
  scrollRef,
  onVideoCall,
}: SidebarChatProps) {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) startUpload(files);
  };

  return (
    <motion.div
      key="chat"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-[32px] border border-slate-100 shadow-2xl 
        flex flex-col overflow-hidden w-full max-w-[360px] mx-auto z-50"
      style={{ height: "450px" }}
    >
      {/* ১. স্ট্যান্ডার্ড চ্যাট হেডার */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 bg-white/80 backdrop-blur-sm">
        <div className="relative">
          {activeChat.image ? (
            <img
              src={activeChat.image}
              alt={activeChat.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {activeChat.name[0].toUpperCase()}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{activeChat.name}</p>
          <p className="text-[10px] font-semibold text-green-500 uppercase">অনলাইন</p>
        </div>

        {/* কল ও ক্লোজ বাটন এরিয়া */}
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors" title="অডিও কল">
            <Phone size={18} />
          </button>
          <button 
            onClick={onVideoCall}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-full transition-colors" 
            title="ভিডিও কল"
          >
            <Video size={20} />
          </button>
          <button 
            onClick={() => setActiveChat(null)}
            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ২. মেসেজ এরিয়া */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/30 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smile className="text-blue-500" size={24} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              কথোপকথন শুরু করুন
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.senderId === currentUserId;
            return (
              <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] font-medium shadow-sm
                  ${isMine 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <p className={`text-[9px] mt-1 opacity-70 ${isMine ? "text-right" : "text-left"}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        
        {typingUser && (
          <div className="flex items-center gap-1 bg-white border border-slate-100 w-12 py-2 px-3 rounded-2xl rounded-bl-none shadow-sm">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* ৩. চ্যাট ইনপুট (Standard Buttons & Logic) */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }} 
        className="px-4 py-3 border-t border-slate-100 bg-white"
      >
        <div className="flex items-center gap-2">
          {/* ফাইল আপলোড আইকন */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-full transition-all shrink-0"
            title="ফাইল যোগ করুন"
          >
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="মেসেজ লিখুন..."
            className="flex-1 bg-slate-100/80 rounded-2xl px-4 py-2 text-sm font-medium 
              text-slate-800 placeholder:text-slate-400 outline-none 
              focus:ring-2 focus:ring-blue-100 transition-all border-none"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className={`p-2.5 rounded-xl transition-all shrink-0 ${
              inputMessage.trim() 
                ? "bg-blue-600 text-white shadow-md shadow-blue-200 hover:scale-105 active:scale-95" 
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            <Send size={18} fill={inputMessage.trim() ? "currentColor" : "none"} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}