"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Plus, Loader2, GraduationCap, Briefcase, Home, Users } from "lucide-react";
import { createNode, getInstituteSuggestions } from "@/app/actions/nodeActions";
import { toast } from "sonner";

const NODE_TYPES = [
  { id: "EDUCATION", label: "শিক্ষা", icon: GraduationCap },
  { id: "WORKPLACE", label: "কর্মক্ষেত্র", icon: Briefcase },
  { id: "LIVING", label: "আবাসন", icon: Home },
  { id: "ORGANIZATION", label: "সংগঠন", icon: Users },
  { id: "POLITICAL_PARTY", label: "রাজনৈতিক দল", icon: Users },
];

export default function AddNodeModal({ isOpen, onClose, userId }: any) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("EDUCATION");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        const results = await getInstituteSuggestions(query);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleAdd = async (title: string) => {
    setIsSubmitting(true);
    const res = await createNode({ title, type: selectedType }, userId);

    if (res.success) {
      toast.success(`${title} আপনার রুটে যোগ হয়েছে!`);
      setQuery("");
      onClose();
    } else {
      toast.error(res.error || "যোগ করা সম্ভব হয়নি");
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-white/20"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">নতুন রুট যোগ করুন</h3>
                <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* ১. টাইপ সিলেকশন */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {NODE_TYPES.map((t) => (
                  <button key={t.id} onClick={() => setSelectedType(t.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${selectedType === t.id ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200"}`}
                  >
                    <t.icon size={20} />
                    <span className="text-[10px] font-bold uppercase">{t.label}</span>
                  </button>
                ))}
              </div>

              {/* ২. সার্চ ইনপুট */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input autoFocus type="text" placeholder="নাম লিখুন..." value={query} onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                />
              </div>

              {/* ৩. সাজেশন ও কাস্টম বাটন */}
              <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                {query.length > 0 && (
                  <button onClick={() => handleAdd(query)}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 border border-dashed border-blue-200 rounded-2xl text-blue-700 hover:bg-blue-100 transition-all"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-bold">"{query}"</span>
                      <span className="text-[10px] font-black uppercase opacity-60">কাস্টম রুট হিসেবে যোগ করুন</span>
                    </div>
                    <Plus size={20} />
                  </button>
                )}

                {suggestions.map((name, i) => (
                  <button key={i} onClick={() => handleAdd(name)}
                    className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-sm transition-all text-slate-700 font-medium"
                  >
                    {name} <Plus size={18} className="text-slate-300" />
                  </button>
                ))}
              </div>
            </div>

            {isSubmitting && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}