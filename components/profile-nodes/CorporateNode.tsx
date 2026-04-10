"use client";

import { useState } from "react";

// ১. টাইপ ডিফাইন করা (Interface)
interface CorporateNodeProps {
  type: string;
  label: string;
  onSave: (data: any) => void;
}

// ২. আর্গুমেন্টে টাইপটি অ্যাসাইন করা
export default function CorporateNode({ type, label, onSave }: CorporateNodeProps) {
  const [value, setValue] = useState("");
  const [headOfUnit, setHeadOfUnit] = useState("");

  // ৩. ইভেন্ট 'e' এর টাইপ ডিফাইন করা
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: value,
      manager: headOfUnit,
      type: type
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl border border-blue-100 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-blue-800">{label} তথ্য যুক্ত করুন</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{label} এর নাম</label>
          <input 
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none" 
            placeholder={`যেমন: ${label === 'ডিভিশন' ? 'IT Division' : 'Software Dept'}`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">প্রধান/ম্যানেজার (ঐচ্ছিক)</label>
          <input 
            value={headOfUnit}
            onChange={(e) => setHeadOfUnit(e.target.value)}
            className="border p-2 rounded-md outline-none" 
            placeholder="নাম বা পদবী"
          />
        </div>

        <button type="submit" className="bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition shadow-md mt-2">
          তথ্য আপডেট করুন
        </button>
      </div>
    </form>
  );
}