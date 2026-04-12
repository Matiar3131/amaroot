"use client";

import React from "react";
import { Image, Send, Globe } from "lucide-react";

export default function CreatePost() {
  return (
    <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex-shrink-0 shadow-lg shadow-blue-100" />
        <button className="flex-1 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl text-left px-5 text-slate-400 text-sm font-medium transition-all">
          নতুন কি ভাবছেন, মাতিয়ার?
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 px-2">
        <div className="flex items-center gap-1 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors">
          <Image size={18} />
          <span className="text-xs font-black uppercase tracking-tighter">Media</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-slate-500">
            <Globe size={14} />
            <span className="text-[10px] font-black uppercase">Public</span>
          </div>
          <button className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-md shadow-blue-200">
            <Send size={16} fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
}