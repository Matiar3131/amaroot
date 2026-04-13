"use client";

import { useState } from "react";
import { createPost } from "@/app/actions/postActions";
import { ImageIcon, Send } from "lucide-react";

interface CreatePostProps {
  userId: string;
  userName: string;
  userImage?: string | null;
}

export default function CreatePost({ userId, userName, userImage }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!content.trim() || content.trim().length < 2) {
      setError("পোস্ট খুব ছোট!");
      return;
    }
    setLoading(true);
    setError("");
    const result = await createPost(content, userId);
    if (result.success) {
      setContent("");
    } else {
      setError(result.error || "পোস্ট করতে ব্যর্থ হয়েছে।");
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {userImage ? (
            <img src={userImage} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-400 text-xs font-black uppercase">
              {userName?.charAt(0) || "?"}
            </span>
          )}
        </div>

        {/* Input */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`${userName}, আপনার মনে কী আসছে?`}
            rows={3}
            className="w-full resize-none text-sm text-slate-700 placeholder:text-slate-300 bg-slate-50 rounded-2xl p-4 border border-slate-100 focus:outline-none focus:border-blue-200 focus:bg-white transition-all"
          />

          {error && (
            <p className="text-red-400 text-xs font-bold mt-1 px-1">{error}</p>
          )}

          <div className="flex items-center justify-between mt-3">
            <button className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-all text-xs font-bold">
              <ImageIcon size={16} />
              ছবি যোগ করুন
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all"
            >
              {loading ? (
                <span className="animate-pulse">পোস্ট হচ্ছে...</span>
              ) : (
                <>
                  <Send size={14} />
                  পোস্ট করুন
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}