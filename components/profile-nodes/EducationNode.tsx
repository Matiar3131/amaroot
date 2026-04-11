"use client";

import { useState, useEffect } from "react";
import { 
  getInstituteSuggestions, 
  getSubjectSuggestions, 
  getHallsByInstitute 
} from "@/app/actions/nodeActions";

// টাইপ ডেফিনিশন
interface Subject {
  id: string;
  name: string;
  short_name: string | null;
}

interface Hall {
  id: string;
  name: string;
}

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
    major: "",
    hallId: "" 
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [dbSubjects, setDbSubjects] = useState<Subject[]>([]);
  const [dbHalls, setDbHalls] = useState<Hall[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ১. সাবজেক্ট লোড করা
  useEffect(() => {
    if (type === "UNIVERSITY") {
      const loadSubjects = async () => {
        try {
          const data = await getSubjectSuggestions();
          setDbSubjects(data as Subject[]);
        } catch (error) {
          console.error("Subject fetch error:", error);
        }
      };
      loadSubjects();
    }
  }, [type]);

  // ২. প্রতিষ্ঠান সাজেশন লজিক
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (edu.instituteName.length > 1) {
        try {
          const list = await getInstituteSuggestions(edu.instituteName);
          setSuggestions(list);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Suggestions fetch error:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [edu.instituteName]);

  // ৩. প্রতিষ্ঠান সিলেক্ট করার পর হল লোড করা
  const handleInstituteSelect = async (name: string) => {
    setEdu((prev) => ({ ...prev, instituteName: name, hallId: "" })); 
    setShowSuggestions(false);

    if (type === "UNIVERSITY") {
      try {
        const halls = await getHallsByInstitute(name);
        setDbHalls(halls as Hall[]);
      } catch (error) {
        console.error("Hall fetch error:", error);
        setDbHalls([]);
      }
    }
  };

  // ৪. সাবমিট হ্যান্ডলার (সংশোধিত)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // dbHalls থেকে সিলেক্ট করা হলের নাম খুঁজে বের করা
    const selectedHall = dbHalls.find((h) => h.id === edu.hallId);

    // metadata অবজেক্টে hallName যোগ করে পাঠানো হচ্ছে
    onSave({
      ...edu,
      hallName: selectedHall ? selectedHall.name : "", 
    });

    // ফর্ম রিসেট
    setEdu({ 
      instituteName: "", 
      passingYear: "", 
      result: "", 
      major: "", 
      hallId: "" 
    });
    setDbHalls([]);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
      <h3 className="col-span-2 text-lg font-semibold mb-2">{label} তথ্য</h3>

      {/* প্রতিষ্ঠানের নাম */}
      <div className="col-span-2 flex flex-col gap-1 relative">
        <label className="text-sm font-medium">প্রতিষ্ঠানের নাম</label>
        <input
          required
          value={edu.instituteName}
          onChange={(e) => setEdu({ ...edu, instituteName: e.target.value })}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => edu.instituteName.length > 1 && setShowSuggestions(true)}
          className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder={`যেমন: ${type === 'UNIVERSITY' ? 'ঢাকা বিশ্ববিদ্যালয়' : 'রাজউক কলেজ'}`}
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-[100%] left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl z-50 mt-1 overflow-hidden">
            {suggestions.map((name, index) => (
              <div
                key={index}
                onClick={() => handleInstituteSelect(name)}
                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm font-medium text-slate-700 border-b border-slate-50 last:border-0"
              >
                {name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* পাশের সাল / ব্যাচ */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">পাশের সাল / ব্যাচ</label>
        <input
          type="number"
          required
          value={edu.passingYear}
          onChange={(e) => setEdu({ ...edu, passingYear: e.target.value })}
          className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="২০১০"
        />
      </div>

      {/* বিভাগ/বিষয় */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">বিভাগ/বিষয়</label>
        {type === "UNIVERSITY" ? (
          <select
            required
            value={edu.major}
            onChange={(e) => setEdu({ ...edu, major: e.target.value })}
            className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            <option value="">সাবজেক্ট বেছে নিন</option>
            {dbSubjects.map((sub) => (
              <option key={sub.id} value={sub.short_name || sub.name}>
                {sub.name} {sub.short_name ? `(${sub.short_name})` : ""}
              </option>
            ))}
          </select>
        ) : (
          <select
            required
            value={edu.major}
            onChange={(e) => setEdu({ ...edu, major: e.target.value })}
            className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            <option value="">নির্বাচন করুন</option>
            <option value="Science">Science</option>
            <option value="Arts">Arts</option>
            <option value="Commerce">Commerce</option>
            <option value="Other">Other</option>
          </select>
        )}
      </div>

      {/* হল ড্রপডাউন */}
      {type === "UNIVERSITY" && dbHalls.length > 0 && (
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium">হলের নাম (ঐচ্ছিক)</label>
          <select
            value={edu.hallId}
            onChange={(e) => setEdu({ ...edu, hallId: e.target.value })}
            className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            <option value="">হল বেছে নিন</option>
            {dbHalls.map((hall) => (
              <option key={hall.id} value={hall.id}>
                {hall.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* রেজাল্ট ইনপুট */}
      <div className="col-span-2 flex flex-col gap-1">
        <label className="text-sm font-medium">ফলাফল (Result)</label>
        <input
          value={edu.result}
          onChange={(e) => setEdu({ ...edu, result: e.target.value })}
          className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="যেমন: GPA 5.00 / 3.80"
        />
      </div>

      <button
        type="submit"
        className="col-span-2 bg-indigo-600 text-white py-2.5 rounded-md hover:bg-indigo-700 transition-all mt-2 font-bold shadow-sm"
      >
        তথ্য সেভ করুন
      </button>
    </form>
  );
}