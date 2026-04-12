"use client";

import React, { useState, useEffect } from "react";
import { getSkillSuggestions } from "@/app/actions/skillActions"; 
import { X, Search, Plus, Save } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  slug: string;
}

interface SkillSelectorProps {
  onSave: (metadata: any) => Promise<void>;
}

export default function SkillSelector({ onSave }: SkillSelectorProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  // সার্চ লজিক
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        const results = await getSkillSuggestions(query); 
        const filtered = results.filter(
          (s: any) => !selectedSkills.find((selected) => selected.id === s.id)
        );
        setSuggestions(filtered as Skill[]);
        setLoading(false);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedSkills]);

  const addSkill = (skill: Skill) => {
    setSelectedSkills([...selectedSkills, skill]);
    setQuery("");
    setSuggestions([]);
  };

  const removeSkill = (id: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== id));
  };

  const handleSave = async () => {
    if (selectedSkills.length > 0) {
      await onSave({ skills: selectedSkills });
      setSelectedSkills([]); // সেভ করার পর ক্লিয়ার
    }
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <Plus size={20} strokeWidth={3} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">আপনার দক্ষতা যোগ করুন</h2>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Add your professional skills</p>
        </div>
      </div>
      {/* ইনপুট বক্স */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="সার্চ করুন (যেমন: React, Python...)"
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
        />
        
        {/* সাজেশন ড্রপডাউন */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-48 overflow-auto p-2">
            {suggestions.map((skill) => (
              <div
                key={skill.id}
                onClick={() => addSkill(skill)}
                className="flex items-center justify-between px-4 py-2 hover:bg-blue-50 rounded-xl cursor-pointer text-sm font-medium text-slate-700 transition-colors"
              >
                <span>{skill.name}</span>
                <Plus size={14} className="text-blue-500" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* সিলেক্টেড স্কিলগুলো এখানে পাশাপাশি ট্যাগ হিসেবে দেখাবে */}
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <div 
            key={skill.id} 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm animate-in zoom-in-50"
          >
            {skill.name}
            <button onClick={() => removeSkill(skill.id)} className="hover:text-red-200 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* সেভ বাটন */}
      {selectedSkills.length > 0 && (
        <button
          onClick={handleSave}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
        >
          <Save size={18} />
          দক্ষতাগুলো যোগ করুন
        </button>
      )}
    </div>
  );
}