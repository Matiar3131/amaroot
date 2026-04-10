"use client";

import { useState } from "react";

// ১. টাইপ ডিফাইন করা (Interface)
interface EducationNodeProps {
  type: string;
  label: string;
  onSave: (data: any) => void;
}

export default function EducationNode({ type, label, onSave }: EducationNodeProps) {
  const [edu, setEdu] = useState({
    instituteName: "",
    passingYear: "",
    result: "",
    major: "" // Science, Commerce, Arts or Dept
  });

  // ২. ইভেন্ট 'e' এর টাইপ (React.FormEvent) ডিফাইন করা হয়েছে
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(edu);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
      <h3 className="col-span-2 text-lg font-semibold mb-2">{label} তথ্য</h3>
      
      <div className="col-span-2 flex flex-col gap-1">
        <label className="text-sm font-medium">প্রতিষ্ঠানের নাম</label>
        <input 
          required
          value={edu.instituteName}
          onChange={(e) => setEdu({...edu, instituteName: e.target.value})}
          className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none" 
          placeholder={`যেমন: ${label === 'স্কুল' ? 'বড়খাতা উচ্চ বিদ্যালয়' : 'ঢাকা বিশ্ববিদ্যালয়'}`}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">পাশের সাল</label>
        <input 
          type="number"
          value={edu.passingYear}
          onChange={(e) => setEdu({...edu, passingYear: e.target.value})}
          className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none" 
          placeholder="২০১০"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">বিভাগ/বিষয়</label>
        <input 
          value={edu.major}
          onChange={(e) => setEdu({...edu, major: e.target.value})}
          className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none" 
          placeholder="যেমন: বিজ্ঞান / CSE"
        />
      </div>

      <button type="submit" className="col-span-2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors mt-2 shadow-sm">
        তথ্য সেভ করুন
      </button>
    </form>
  );
}