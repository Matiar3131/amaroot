"use client";
import React, { useState } from "react";
import { User, MapPin, GraduationCap, Link2, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react"; // লগইন করা ইউজারের ডাটা পাওয়ার জন্য
import AddNodeModal from "./AddNodeModal";

interface SidebarLeftProps {
  userNodes?: any[];
  userId?: string;
  userProfile?: {
    name?: string;
    image?: string;
    profession?: string;
    location?: string;
    education?: string;
  };
}

export default function SidebarLeft({ userNodes = [], userId = "", userProfile }: SidebarLeftProps) {
  const { data: session } = useSession();
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // সেশন অথবা প্রপস থেকে ডাটা প্রায়োরিটি সেট করা
  const displayName = userProfile?.name || session?.user?.name || "Member";
  const displayImage = userProfile?.image || session?.user?.image;
  const displayProfession = userProfile?.profession || "Professional";
  const displayLocation = userProfile?.location || "Bangladesh";
  const displayEducation = userProfile?.education || "Verified Profile";

  const activeNodeId = searchParams.get("nodeId");
  const initialNodes = 5;
  const nodesToProcess = Array.isArray(userNodes) ? userNodes : [];
  const displayedNodes = showAll ? nodesToProcess : nodesToProcess.slice(0, initialNodes);

  const handleNodeClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeNodeId === id) {
      params.delete("nodeId");
    } else {
      params.set("nodeId", id);
    }
    router.push(`/network?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* ১. ডাইনামিক প্রোফাইল কার্ড */}
      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <div className="h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600" />
        <div className="px-6 pb-6 text-center">
          <div className="relative -mt-12 mb-3 inline-block">
            <div className="w-24 h-24 bg-white rounded-[30px] p-1.5 shadow-xl mx-auto">
              <div className="w-full h-full bg-slate-100 rounded-[22px] flex items-center justify-center text-slate-400 overflow-hidden">
                {displayImage ? (
                  <img 
                    src={displayImage} 
                    alt={displayName} 
                    className="w-full h-full object-cover rounded-[22px]" 
                  />
                ) : (
                  <User size={48} />
                )}
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
            {displayName}
          </h3>
          
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 py-1 px-3 rounded-full self-center">
              {displayProfession}
            </span>
          </div>
          
          <div className="mt-5 space-y-2.5 border-t border-slate-50 pt-5">
            <div className="flex items-center gap-3 text-slate-500 justify-center">
              <MapPin size={14} className="text-blue-500" />
              <span className="text-xs font-bold tracking-tight">{displayLocation}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 justify-center">
              <GraduationCap size={14} className="text-blue-500" />
              <span className="text-xs font-bold tracking-tight">{displayEducation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ২. ডাইনামিক রুট লিস্ট */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-5 px-1">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">আইডেন্টিটি রুট</h4>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-full font-black">
            {nodesToProcess.length}
          </span>
        </div>
        
        <div className="space-y-2.5">
          {displayedNodes.map((node) => (
            <div 
              key={node.id} 
              onClick={() => handleNodeClick(node.id)}
              className={`flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer group border ${
                activeNodeId === node.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-slate-50/50 border-transparent hover:bg-white hover:shadow-md hover:border-blue-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl shadow-sm transition-colors ${
                  activeNodeId === node.id ? 'bg-white/20 text-white' : 'bg-white text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                }`}>
                  <Link2 size={14} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-black leading-none mb-1 ${activeNodeId === node.id ? 'text-white' : 'text-slate-700'}`}>
                    {node.title}
                  </span>
                  <span className={`text-[8px] font-bold uppercase tracking-tighter ${activeNodeId === node.id ? 'text-blue-100' : 'text-slate-400'}`}>
                    {node.type || "General"}
                  </span>
                </div>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse mr-1 ${activeNodeId === node.id ? 'bg-white' : 'bg-blue-500'}`} />
            </div>
          ))}

          {nodesToProcess.length > initialNodes && (
            <button 
              onClick={() => setShowAll(!showAll)} 
              className="w-full py-2 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-all uppercase mt-1"
            >
              {showAll ? <><ChevronUp size={12} className="inline mr-1"/> View Less</> : `+ ${nodesToProcess.length - initialNodes} more nodes`}
            </button>
          )}

          <button 
            onClick={() => setIsModalOpen(true)} 
            className="w-full mt-2 py-3.5 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30 transition-all uppercase"
          >
            Add New Route
          </button>
        </div>
      </div>
      
      <AddNodeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={userId} 
        existingNodes={nodesToProcess} 
      />
    </div>
  );
}