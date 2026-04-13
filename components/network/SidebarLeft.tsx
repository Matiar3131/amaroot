"use client";

import React, { useState, useEffect } from "react";
import { User, MapPin, GraduationCap, Link2, ChevronDown, ChevronUp } from "lucide-react";
import AddNodeModal from "./AddNodeModal"; // পাথটি আপনার ফোল্ডার অনুযায়ী চেক করে নিন

interface NodeItem {
  id: string;
  title: string;
  type?: string;
}

export default function SidebarLeft({ 
  userNodes = [], 
  userId = "" // userId প্রপস হিসেবে নিতে হবে মডালের জন্য
}: { 
  userNodes?: NodeItem[];
  userId?: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const initialNodes = 5;
  const nodesToProcess = Array.isArray(userNodes) ? userNodes : [];
  const displayedNodes = showAll ? nodesToProcess : nodesToProcess.slice(0, initialNodes);

  // অটো-ক্ল্যাপস লজিক: ১৫ সেকেন্ড পর অটো ৫টি হয়ে যাবে
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAll) {
      timer = setTimeout(() => {
        setShowAll(false);
      }, 15000);
    }
    return () => clearTimeout(timer);
  }, [showAll]);

  return (
    <div className="space-y-4">
      {/* ১. প্রোফাইল কার্ড */}
      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
        <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="px-6 pb-6">
          <div className="relative -mt-10 mb-4">
            <div className="w-20 h-20 bg-white rounded-3xl p-1 shadow-xl">
              <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                <User size={40} />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">মাতিয়ার রহমান</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Software Developer | IT Specialist (Banking)
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin size={16} className="text-blue-500" />
              <span className="text-sm font-medium">Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <GraduationCap size={16} className="text-blue-500" />
              <span className="text-sm font-medium">CUET CSE</span>
            </div>
          </div>
        </div>
      </div>

      {/* ২. ডাইনামিক রুট লিস্ট */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm transition-all duration-500">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            আপনার আইডেন্টিটি রুট
          </h4>
          <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-lg font-bold">
            {nodesToProcess.length}
          </span>
        </div>
        
        <div className="space-y-2 transition-all duration-500">
          {displayedNodes.map((node) => (
            <div key={node.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-all cursor-pointer group border border-transparent hover:border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
                  <Link2 size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">{node.title}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">{node.type || "General"}</span>
                </div>
              </div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            </div>
          ))}

          {/* View More / View Less Toggle Button */}
          {nodesToProcess.length > initialNodes && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-black text-blue-600 hover:bg-blue-50 rounded-xl transition-all uppercase mt-2 border border-blue-100/50"
            >
              {showAll ? (
                <>View Less <ChevronUp size={14} /></>
              ) : (
                <>View More ({nodesToProcess.length - initialNodes}) <ChevronDown size={14} /></>
              )}
            </button>
          )}
        </div>

        {/* নতুন রুট যোগ করার বাটন */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-4 py-3 border border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all uppercase"
        >
          + নতুন রুট যোগ করুন
        </button>
      </div>

      {/* ৩. মডাল কম্পোনেন্ট ইমপ্লিমেন্টেশন */}
      <AddNodeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={userId}
        existingNodes={nodesToProcess} // অলরেডি থাকা রুটগুলো পাস করছি ফিল্টারিং এর জন্য
      />
    </div>
  );
}