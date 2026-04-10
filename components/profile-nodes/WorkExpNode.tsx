"use client";

import { useState } from "react";

// ১. টাইপ ডিফাইন করা (Interface)
interface WorkExpNodeProps {
  onSave: (data: any) => void;
}

export default function WorkExpNode({ onSave }: WorkExpNodeProps) {
  const [work, setWork] = useState({
    company: "",
    designation: "",
    duration: "",
    location: ""
  });

  // ২. সাবমিট ফাংশনে ইভেন্ট টাইপ যোগ করা
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(work);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4"
    >
      <h3 className="col-span-2 text-lg font-semibold mb-2 text-gray-800">কাজের অভিজ্ঞতা (Work Experience)</h3>
      
      <div className="col-span-2 flex flex-col gap-1">
        <label className="text-sm font-medium">প্রতিষ্ঠানের নাম</label>
        <input 
          required
          value={work.company}
          onChange={(e) => setWork({...work, company: e.target.value})}
          className="border p-2 rounded-md focus:ring-2 focus:ring-slate-400 outline-none" 
          placeholder="যেমন: ডাচ-বাংলা ব্যাংক"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">পদবী</label>
        <input 
          required
          value={work.designation}
          onChange={(e) => setWork({...work, designation: e.target.value})}
          className="border p-2 rounded-md focus:ring-2 focus:ring-slate-400 outline-none" 
          placeholder="যেমন: সিনিয়র অফিসার"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">সময়কাল (বছর)</label>
        <input 
          value={work.duration}
          onChange={(e) => setWork({...work, duration: e.target.value})}
          className="border p-2 rounded-md focus:ring-2 focus:ring-slate-400 outline-none" 
          placeholder="যেমন: ৩ বছর"
        />
      </div>

      <button type="submit" className="col-span-2 bg-slate-800 text-white py-2 rounded-md hover:bg-black transition-all mt-2 shadow-md">
        অভিজ্ঞতা যোগ করুন
      </button>
    </form>
  );
}