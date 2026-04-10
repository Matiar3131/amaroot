"use client";

import { useState, useEffect } from "react";
import { getDistricts, getUpazilas, getUnions } from "@/app/actions/geoActions";

export default function AddressNode({ type, onSave }: { type: string, onSave: (data: any) => void }) {
  const [isUrban, setIsUrban] = useState(false);
  const [districts, setDistricts] = useState<any[]>([]);
  const [upazilas, setUpazilas] = useState<any[]>([]);
  const [unions, setUnions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    district: "",
    upazila: "",
    union: "",
    wordNo: "",
    village: "",
    area: "",     // আরবান এরিয়া/হাউজিং
    road: "",     // রোড নং
    section: "",  // সেকশন/ব্লক
    mohalla: "",  // মহল্লা
    house: "",    // বাড়ি নম্বর
  });

  useEffect(() => {
    getDistricts().then(setDistricts);
  }, []);

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dId = e.target.value;
    const dName = e.target.options[e.target.selectedIndex].text;
    setFormData({ ...formData, district: dId === "" ? "" : dName, upazila: "", union: "" });
    if (dId) {
      const data = await getUpazilas(dId);
      setUpazilas(data);
    }
  };

  const handleUpazilaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uId = e.target.value;
    const uName = e.target.options[e.target.selectedIndex].text;
    setFormData({ ...formData, upazila: uId === "" ? "" : uName, union: "" });
    if (uId && !isUrban) {
      const data = await getUnions(uId);
      setUnions(data);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      addressType: isUrban ? "URBAN" : "RURAL"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-5">
      <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
        {type === "PR_ADDR" ? "বর্তমান" : "স্থায়ী"} ঠিকানা
      </h3>
      
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200">
        <button type="button" onClick={() => setIsUrban(false)} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${!isUrban ? "bg-white shadow-md text-blue-600" : "text-slate-50"}`}>গ্রাম</button>
        <button type="button" onClick={() => setIsUrban(true)} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${isUrban ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}>শহর</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* কমন ফিল্ডস */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400">জেলা</label>
          <select onChange={handleDistrictChange} className="border-2 border-slate-50 p-3 rounded-2xl bg-slate-50 outline-none focus:border-blue-500" required>
            <option value="">সিলেক্ট করুন</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400">{isUrban ? "থানা" : "উপজেলা"}</label>
          <select onChange={handleUpazilaChange} className="border-2 border-slate-50 p-3 rounded-2xl bg-slate-50 disabled:opacity-50" required disabled={!formData.district}>
            <option value="">সিলেক্ট করুন</option>
            {upazilas.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        {/* আরবান ফিল্ডস */}
        {isUrban ? (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">মহল্লা নাম</label>
              <input type="text" onChange={(e) => setFormData({...formData, mohalla: e.target.value})} className="border-2 border-slate-50 p-3 rounded-2xl bg-slate-50" placeholder="উদা: বনানী" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">এরিয়া/হাউজিং</label>
              <input type="text" onChange={(e) => setFormData({...formData, area: e.target.value})} className="border-2 border-slate-50 p-3 rounded-2xl bg-slate-50" placeholder="উদা: ডিওএইচএস" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">সেকশন/ব্লক</label>
              <input type="text" onChange={(e) => setFormData({...formData, section: e.target.value})} className="border-2 border-slate-50 p-3 rounded-2xl bg-slate-50" placeholder="উদা: সেকশন-৬" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">রোড নং</label>
              <input type="text" onChange={(e) => setFormData({...formData, road: e.target.value})} className="border-2 border-slate-50 p-3 rounded-2xl bg-slate-50" placeholder="উদা: রোড-১২" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">বাড়ি নম্বর</label>
              <input type="text" onChange={(e) => setFormData({...formData, house: e.target.value})} className="border-2 border-slate-50 p-3 rounded-2xl bg-slate-50" placeholder="উদা: হাউজ-৪৫/এ" />
            </div>
          </>
        ) : (
          /* রুরাল ফিল্ডস */
          <>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">ইউনিয়ন</label>
              <select onChange={(e) => setFormData({...formData, union: e.target.options[e.target.selectedIndex].text})} className="border-2 border-slate-50 p-3 rounded-2xl bg-slate-50" required disabled={!formData.upazila}>
                <option value="">সিলেক্ট করুন</option>
                {unions.map(un => <option key={un.id} value={un.id}>{un.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">ওয়ার্ড নং</label>
              <input type="number" onChange={(e) => setFormData({...formData, wordNo: e.target.value})} className="border-2 border-slate-50 p-3 rounded-2xl bg-slate-50" placeholder="যেমন: ৩" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400">গ্রাম/পাড়া</label>
              <input type="text" onChange={(e) => setFormData({...formData, village: e.target.value})} className="border-2 border-slate-50 p-3 rounded-2xl bg-slate-50" placeholder="যেমন: পশ্চিম বেজগ্রাম" />
            </div>
          </>
        )}
      </div>

      <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all">
        ঠিকানা কনফার্ম করুন
      </button>
    </form>
  );
}