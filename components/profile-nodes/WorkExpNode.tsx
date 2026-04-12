"use client";

import React, { useState, useEffect } from "react";
import { getOrgStructure, getDesignations } from "@/app/actions/orgActions";
import { 
  Briefcase, Building2, Layers, MapPin, 
  UserCircle, Calendar, FileText, Save, CheckCircle2, Loader2 
} from "lucide-react";

export default function WorkExpNode({ onSave }: { onSave?: (data: any) => Promise<void> }) {
  const [sectors] = useState(["Banking", "IT", "Manufacturing", "Telecommunication", "Education"]);
  const [selectedSector, setSelectedSector] = useState("");
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [designations, setDesignations] = useState<string[]>([]);
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [desks, setDesks] = useState<string[]>([]);
  const [deskUnit, setDeskUnit] = useState("");
  
  const [expertness, setExpertness] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [jobDetails, setJobDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedSector) {
      setIsLoading(true);
      getOrgStructure({ sector: selectedSector }).then(data => {
        setOrganizations(data);
        setIsLoading(false);
      });
    }
  }, [selectedSector]);

  useEffect(() => {
    if (selectedOrg) {
      setIsLoading(true);
      Promise.all([
        getOrgStructure({ orgName: selectedOrg }),
        getDesignations(selectedSector, selectedOrg)
      ]).then(([deptData, desigData]) => {
        setDepartments(deptData);
        setDesignations(desigData);
        setIsLoading(false);
      });
    }
  }, [selectedOrg, selectedSector]);

  useEffect(() => {
    if (selectedOrg && selectedDept) {
      setIsLoading(true);
      getOrgStructure({ orgName: selectedOrg, department: selectedDept }).then(data => {
        setDesks(data);
        setIsLoading(false);
      });
    }
  }, [selectedDept, selectedOrg]);

  const handleSave = async () => {
    if (!selectedSector || !selectedOrg || !selectedDesignation || !dateFrom) {
      alert("প্রয়োজনীয় তথ্য (Sector, Company, Designation, Start Date) পূরণ করুন।");
      return;
    }
    const metadata = {
      sector: selectedSector,
      company: selectedOrg,
      department: selectedDept,
      designation: selectedDesignation,
      deskUnit,
      expertness,
      dateFrom, 
      dateTo: isCurrent ? "Present" : dateTo,
      isCurrent,
      jobDetails
    };
    if (onSave) await onSave(metadata);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 border border-blue-50 rounded-[2rem] shadow-xl bg-white space-y-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
            <Briefcase size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">Professional Experience</h3>
            <p className="text-sm text-gray-500">Manage your employment history</p>
          </div>
        </div>
        {isLoading && <Loader2 className="animate-spin text-blue-500" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><Layers size={14} /> Sector</label>
          <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium" value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
            <option value="">Select Industry</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><Building2 size={14} /> Company</label>
          <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium" value={selectedOrg} disabled={!selectedSector} onChange={(e) => setSelectedOrg(e.target.value)}>
            <option value="">Choose Company</option>
            {organizations.map(org => <option key={org} value={org}>{org}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><MapPin size={14} /> Department</label>
          <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium" value={selectedDept} disabled={!selectedOrg} onChange={(e) => setSelectedDept(e.target.value)}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><UserCircle size={14} /> Role</label>
          <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium" value={selectedDesignation} disabled={!selectedOrg} onChange={(e) => setSelectedDesignation(e.target.value)}>
            <option value="">Choose Role</option>
            {designations.map(des => <option key={des} value={des}>{des}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><Layers size={14} /> Desk/Unit</label>
          <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium" disabled={!selectedDesignation || !selectedDept} value={deskUnit} onChange={(e) => setDeskUnit(e.target.value)}>
            <option value="">Choose Desk</option>
            {desks.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><CheckCircle2 size={14} /> Skills</label>
          <input className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium" placeholder="Next.js, Banking etc" value={expertness} onChange={(e) => setExpertness(e.target.value)} />
        </div>
      </div>

      <div className="p-6 bg-blue-50/50 rounded-[1.5rem] grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div>
          <label className="text-xs font-bold uppercase text-blue-600">Joined</label>
          <input type="date" className="w-full bg-white rounded-xl p-3" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-blue-600">Resigned</label>
          <input type="date" className="w-full bg-white rounded-xl p-3" disabled={isCurrent} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <div className="flex items-center gap-3 mt-4">
          <input type="checkbox" className="w-6 h-6" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} />
          <label className="text-sm font-bold text-blue-800">Presently Working</label>
        </div>
      </div>

      <textarea rows={3} className="w-full bg-gray-50 border-none rounded-2xl p-4" placeholder="Job Responsibilities..." value={jobDetails} onChange={(e) => setJobDetails(e.target.value)} />

      <button onClick={handleSave} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
        <Save size={24} /> SAVE EXPERIENCE
      </button>
    </div>
  );
}