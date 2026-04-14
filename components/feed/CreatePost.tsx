"use client";

import { useState } from "react";
import { createPost } from "@/app/actions/postActions";
import { ImageIcon, Send } from "lucide-react";

interface CreatePostProps {
  userId: string;
  userName: string;
  userImage?: string | null;
  activeNodeId?: string; // নির্দিষ্ট রুটে থাকলে সেই আইডি এখানে আসবে
}

export default function CreatePost({ 
  userId, 
  userName, 
  userImage, 
  activeNodeId 
}: CreatePostProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    // ভ্যালিডেশন: খালি বা খুব ছোট পোস্ট আটকানো
    if (!content.trim() || content.trim().length < 2) {
      setError("পোস্টের বিষয়বস্তু খুব ছোট!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // activeNodeId সহ পোস্ট তৈরি করা
      const result = await createPost(content.trim(), userId, activeNodeId);
      
      if (result.success) {
        setContent(""); // পোস্ট সফল হলে ইনপুট ফিল্ড খালি করা
      } else {
        setError(result.error || "পোস্ট করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      setError("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* ইউজার অবতার */}
        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-slate-50">
          {userImage ? (
            <img 
              src={userImage} 
              alt={userName} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-slate-400 text-xs font-black uppercase">
              {userName?.charAt(0) || "?"}
            </span>
          )}
        </div>

        {/* টেক্সট এরিয়া ও বাটন */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError(""); // ইউজার টাইপ করা শুরু করলে এরর মেসেজ চলে যাবে
            }}
            placeholder={
              activeNodeId 
                ? `এই নির্দিষ্ট রুটে আপনার আপডেট শেয়ার করুন...` 
                : `${userName}, আপনার মনে কী আসছে?`
            }
            rows={3}
            className="w-full resize-none text-sm text-slate-700 placeholder:text-slate-300 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 focus:outline-none focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all"
          />

          {error && (
            <p className="text-red-500 text-[10px] font-black mt-2 px-1 uppercase tracking-tight">
              ⚠️ {error}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            {/* ফিউচার ফিচার: ছবি আপলোড */}
            <button 
              type="button"
              className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-all text-[11px] font-black uppercase tracking-tighter"
            >
              <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-50">
                <ImageIcon size={14} />
              </div>
              ছবি যোগ করুন
            </button>

            {/* পোস্ট বাটন */}
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 text-white text-[11px] font-black px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:shadow-none uppercase tracking-widest"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>পোস্ট হচ্ছে</span>
                </div>
              ) : (
                <>
                  <Send size={12} />
                  <span>পোস্ট করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}