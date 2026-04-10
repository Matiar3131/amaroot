"use client";

import { useState } from "react";

// ১. প্রপস এর জন্য ইন্টারফেস যোগ করা হয়েছে
interface BioNodeProps {
  onSave: (data: any) => void;
}

export default function BioNode({ onSave }: BioNodeProps) {
  const [bio, setBio] = useState({
    gender: "",
    bloodGroup: "",
    religion: "",
    maritalStatus: "",
  });

  // ২. ইভেন্ট 'e' এর টাইপ (React.FormEvent) ডিফাইন করা হয়েছে
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(bio); 
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl border border-gray-100 grid grid-cols-2 gap-4">
      <h3 className="col-span-2 text-lg font-semibold mb-2">ব্যক্তিগত প্রোফাইল</h3>
      
      <div className="flex flex-col gap-1">
        <label className="text-sm">রক্তের গ্রুপ</label>
        <select 
          onChange={(e) => setBio({...bio, bloodGroup: e.target.value})} 
          className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">সিলেক্ট করুন</option>
          <option value="A+">A+</option>
          <option value="B+">B+</option>
          <option value="O+">O+</option>
          <option value="AB+">AB+</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm">লিঙ্গ</label>
        <select 
          onChange={(e) => setBio({...bio, gender: e.target.value})} 
          className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">সিলেক্ট করুন</option>
          <option value="Male">পুরুষ</option>
          <option value="Female">মহিলা</option>
          <option value="Other">অন্যান্য</option>
        </select>
      </div>

      <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded-md mt-4 hover:bg-green-700 transition-colors">
        প্রোফাইল আপডেট করুন
      </button>
    </form>
  );
}