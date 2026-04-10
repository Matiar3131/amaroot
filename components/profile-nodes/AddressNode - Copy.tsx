"use client";

import { useState } from "react";

interface AddressNodeProps {
  type: "PR_ADDR" | "PM_ADDR"; // বর্তমান নাকি স্থায়ী ঠিকানা
  onSave: (metadata: any) => void;
}

export default function AddressNode({ type, onSave }: AddressNodeProps) {
  const [isUrban, setIsUrban] = useState(false);
  const [formData, setFormData] = useState({
    district: "",
    upazila: "",
    union: "",
    village: "",
    area: "",
    road: "",
    house: "",
    apartmentName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে আমরা metadata অবজেক্ট তৈরি করছি যা সরাসরি ডাটাবেসে যাবে
    const metadata = {
      addressType: isUrban ? "URBAN" : "RURAL",
      ...formData
    };
    onSave(metadata);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {type === "PR_ADDR" ? "বর্তমান ঠিকানা" : "স্থায়ী ঠিকানা"} সেটআপ করুন
      </h3>

      {/* Toggle Button for Urban/Rural */}
      <div className="flex bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setIsUrban(false)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isUrban ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
        >
          গ্রাম (Rural)
        </button>
        <button
          onClick={() => setIsUrban(true)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isUrban ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
        >
          শহর (Urban)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* কমন ফিল্ড: জেলা */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">জেলা</label>
          <select 
            name="district" 
            onChange={handleChange} 
            className="border p-2 rounded-md outline-blue-500"
            required
          >
            <option value="">সিলেক্ট করুন</option>
            <option value="Lalmonirhat">লালমনিরহাট</option>
            <option value="Dhaka">ঢাকা</option>
            {/* এখানে আপনার District টেবিল থেকে ডাটা আসবে */}
          </select>
        </div>

        {!isUrban ? (
          // গ্রামীণ ফিল্ডসমূহ
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">উপজেলা</label>
              <input name="upazila" onChange={handleChange} className="border p-2 rounded-md" placeholder="যেমন: হাতিবান্ধা" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">ইউনিয়ন</label>
              <input name="union" onChange={handleChange} className="border p-2 rounded-md" placeholder="যেমন: বড়খাতা" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">গ্রাম/পাড়া</label>
              <input name="village" onChange={handleChange} className="border p-2 rounded-md" placeholder="যেমন: মুন্সিপাড়া" />
            </div>
          </>
        ) : (
          // শহরের ফিল্ডসমূহ
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">এলাকা/প্রজেক্ট</label>
              <input name="area" onChange={handleChange} className="border p-2 rounded-md" placeholder="যেমন: মহানগর প্রজেক্ট" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">রোড নম্বর</label>
              <input name="road" onChange={handleChange} className="border p-2 rounded-md" placeholder="রোড নং ০২" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">বাসা/ফ্ল্যাট নং</label>
              <input name="house" onChange={handleChange} className="border p-2 rounded-md" placeholder="বাসা-১২/এ, ৪বি" />
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="md:col-span-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors mt-4"
        >
          ঠিকানা সেভ করুন
        </button>
      </form>
    </div>
  );
}