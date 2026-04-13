"use client";

import React from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Link2 } from "lucide-react";

export default function PostCard({ post }: any) {
  return (
    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm mb-4">
      {/* পোস্ট হেডার */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden">
             <img src={post.user.image} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800">{post.user.name}</span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
               <span>{new Date(post.createdAt).toLocaleDateString()}</span>
               {post.node && (
                 <span className="text-blue-500 flex items-center gap-1">
                   <Link2 size={10} /> {post.node.title}
                 </span>
               )}
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* পোস্ট কন্টেন্ট */}
      <div className="text-slate-700 text-sm leading-relaxed mb-6">
        {post.content}
      </div>

      {/* পোস্ট অ্যাকশনস (Like, Comment, Share) */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors group">
            <Heart size={18} className="group-hover:fill-red-500" />
            <span className="text-[10px] font-black">{post.likes?.length || 0}</span>
          </button>
          
          <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors">
            <MessageCircle size={18} />
            <span className="text-[10px] font-black">{post.comments?.length || 0}</span>
          </button>
        </div>

        <button className="flex items-center gap-2 text-slate-400 hover:text-green-500 transition-colors">
          <Share2 size={18} />
          <span className="text-[10px] font-black uppercase">Share</span>
        </button>
      </div>
    </div>
  );
}