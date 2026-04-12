"use client";

import React from "react";
import { TrendingUp, Users, Zap } from "lucide-react";

export default function SidebarRight() {
  return (
    <div className="space-y-4">
      {/* সাজেশন কার্ড */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Zap size={18} className="text-yellow-500 fill-yellow-500" />
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">সাজেস্টেড কানেকশন</h4>
        </div>
        
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl" />
              <div className="flex-1">
                <h5 className="text-xs font-black text-slate-800">ইউজার {i}</h5>
                <p className="text-[10px] text-slate-400 font-bold">Matching: CUET Alumni</p>
              </div>
              <button className="text-[10px] font-black text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">
                CONNECT
              </button>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-6 py-3 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors">
          সবগুলো দেখুন →
        </button>
      </div>

      {/* প্রোমোশনাল বা হেল্প কার্ড */}
      <div className="bg-slate-900 rounded-[32px] p-6 text-white overflow-hidden relative group">
        <div className="relative z-10">
          <TrendingUp className="mb-4 text-blue-400" />
          <h4 className="text-lg font-black leading-tight">আপনার আইডেন্টিটি স্কোর বাড়ান</h4>
          <p className="text-xs text-slate-400 mt-2 font-medium">নতুন নোড যোগ করলে আপনার নেটওয়ার্ক ভিজিবিলিটি ২০% বৃদ্ধি পায়।</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-600/40 transition-all" />
      </div>
    </div>
  );
}