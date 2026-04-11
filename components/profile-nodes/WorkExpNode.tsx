"use client";

import { useState, useEffect } from "react";
import { searchOrganizations } from "@/app/actions/orgActions"; 

interface WorkExpNodeProps {
  onSave: (data: any) => void;
}

export default function WorkExpNode({ onSave }: WorkExpNodeProps) {
  const [work, setWork] = useState({
    industry: "Banking",
    company: "",
    dept: "",
    designation: "",
    desk: "",
    expertness: "",
    fromDate: "",
    toDate: "",
    isCurrent: false,
    jobDescription: "",
  });

  const [orgSuggestions, setOrgSuggestions] = useState<any[]>([]);

  // কোম্পানি সাজেশনের জন্য Debounce Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (work.company.length > 1) {
        const results = await searchOrganizations(work.company);
        // শুধুমাত্র সিলেক্টেড ইন্ডাস্ট্রির কোম্পানি ফিল্টার করতে চাইলে এখানে লজিক দেওয়া যায়
        setOrgSuggestions(results);
      } else {
        setOrgSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [work.company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(work);
    // সেভ হওয়ার পর ফর্ম রিসেট বা অ্যাড মোর অপশন UI হ্যান্ডেল করবে
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg flex flex-col gap-4 max-w-2xl"
    >
      <h3 className="text-lg font-bold mb-2 text-slate-800 border-b pb-2 flex items-center gap-2">
        💼 কাজের অভিজ্ঞতা (Professional Experience)
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* ১. সেক্টর/ইন্ডাস্ট্রি (সবার উপরে) */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">সেক্টর/ইন্ডাস্ট্রি</label>
          <select 
            value={work.industry}
            onChange={(e) => setWork({...work, industry: e.target.value})}
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="Banking">Banking</option>
            <option value="IT & Software">IT & Software</option>
            <option value="Education">Education</option>
            <option value="RMG">RMG & Textile</option>
            <option value="Conglomerate">Conglomerate</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* ২. প্রতিষ্ঠানের নাম (Auto-complete) */}
        <div className="col-span-2 flex flex-col gap-1 relative">
          <label className="text-sm font-semibold text-gray-700">প্রতিষ্ঠানের নাম</label>
          <input 
            required
            list="org-list"
            value={work.company}
            onChange={(e) => setWork({...work, company: e.target.value})}
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            placeholder="যেমন: Dutch-Bangla Bank PLC"
          />
          <datalist id="org-list">
            {orgSuggestions.map((org, index) => (
              <option key={index} value={org.name}>
                {org.industry}
              </option>
            ))}
          </datalist>
        </div>

        {/* ৩. Department/Division/Branch */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Department/Division/Branch</label>
          <input 
            value={work.dept}
            onChange={(e) => setWork({...work, dept: e.target.value})}
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="যেমন: IT Division / Retail Banking"
          />
        </div>

        {/* ৪. পদবী (Designation) */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">পদবী (Designation)</label>
          <input 
            required
            value={work.designation}
            onChange={(e) => setWork({...work, designation: e.target.value})}
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="যেমন: Senior Officer"
          />
        </div>

        {/* ৫. Desk/Unit */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Desk/Unit</label>
          <input 
            value={work.desk}
            onChange={(e) => setWork({...work, desk: e.target.value})}
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="যেমন: Foreign Exchange / Software Dev"
          />
        </div>

        {/* ৬. Expertness Field */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Expertness (আপনার বিশেষ দক্ষতা)</label>
          <input 
            value={work.expertness}
            onChange={(e) => setWork({...work, expertness: e.target.value})}
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="যেমন: Core Banking System, Java, React"
          />
        </div>

        {/* ৭. সময়কাল */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">কবে থেকে (Join Date)</label>
          <input 
            type="date"
            required
            value={work.fromDate}
            onChange={(e) => setWork({...work, fromDate: e.target.value})}
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">কবে পর্যন্ত (End Date)</label>
          <input 
            type="date"
            disabled={work.isCurrent}
            value={work.isCurrent ? "" : work.toDate}
            onChange={(e) => setWork({...work, toDate: e.target.value})}
            className={`border p-2.5 rounded-lg outline-none ${work.isCurrent ? 'bg-gray-100 text-gray-400' : 'focus:ring-2 focus:ring-blue-500'}`} 
          />
        </div>

        {/* বর্তমানে কাজ করছেন কি না */}
        <div className="col-span-2 flex items-center gap-2">
          <input 
            type="checkbox" 
            id="current"
            checked={work.isCurrent}
            onChange={(e) => setWork({...work, isCurrent: e.target.checked})}
            className="w-4 h-4 accent-slate-800"
          />
          <label htmlFor="current" className="text-sm font-medium text-gray-600 cursor-pointer">আমি বর্তমানে এখানে কাজ করছি</label>
        </div>

        {/* ৮. Job Description (Max 500 chars) */}
        <div className="col-span-2 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">Job Description</label>
            <span className={`text-xs ${work.jobDescription.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
              {work.jobDescription.length}/500
            </span>
          </div>
          <textarea 
            maxLength={500}
            rows={3}
            value={work.jobDescription}
            onChange={(e) => setWork({...work, jobDescription: e.target.value})}
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="আপনার দায়িত্ব সংক্ষেপে লিখুন..."
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-black transition-all shadow-lg active:scale-95"
      >
        অভিজ্ঞতা সেভ করুন
      </button>

      {/* +Add More Option (UI Hint) */}
      <div className="flex justify-center mt-2">
        <button 
          type="button"
          onClick={() => { /* এখানে ফর্ম রিসেট লজিক দিতে পারেন */ }}
          className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
        >
          <span>+</span> আরও একটি অভিজ্ঞতা যোগ করুন
        </button>
      </div>
    </form>
  );
}