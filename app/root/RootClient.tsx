"use client";

import { useState, useEffect } from 'react';
import { createNode, deleteNode } from "@/app/actions/nodeActions";
import { saveWorkExperienceAction } from "@/app/actions/workActions"; 
import { saveOrUpdateSkill } from "@/app/actions/skillActions"; 

import { 
    FiMapPin, FiBookOpen, FiBriefcase, FiCpu, 
    FiCheckCircle, FiAlertCircle,
    FiUser, FiX, FiTrash2
} from "react-icons/fi";

import AddressNode from "@/components/profile-nodes/AddressNode";
import BioNode from "@/components/profile-nodes/BioNode";
import EducationNode from "@/components/profile-nodes/EducationNode";
import WorkExpNode from "@/components/profile-nodes/WorkExpNode"; 
import SkillSelector from "@/components/profile-nodes/SkillSelector"; 

interface RootNode {
    id: string;
    type: string;
    title: string;
    metadata?: any;
}

export default function RootClient({ initialNodes, userId }: { initialNodes: RootNode[], userId: string }) {
    const [nodes, setNodes] = useState<RootNode[]>(initialNodes);
    const [activeTab, setActiveTab] = useState("PR_ADDR");
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [filterLocation, setFilterLocation] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const tabs = [
        { id: "BIO", label: "ব্যক্তিগত", icon: <FiUser /> },
        { id: "PR_ADDR", label: "বর্তমান ঠিকানা", icon: <FiMapPin /> },
        { id: "PM_ADDR", label: "স্থায়ী ঠিকানা", icon: <FiMapPin /> },
        { id: "SCHOOL", label: "স্কুল", icon: <FiBookOpen /> },
        { id: "COLLEGE", label: "কলেজ", icon: <FiBookOpen /> },
        { id: "UNIVERSITY", label: "বিশ্ববিদ্যালয়", icon: <FiBookOpen /> },
        { id: "WORK_EXP", label: "কাজের অভিজ্ঞতা", icon: <FiBriefcase /> }, 
        { id: "SKILL", label: "দক্ষতা", icon: <FiCpu /> },
    ];

    const handleSaveToDB = async (metadata: any) => {
        setLoading(true);
        try {
            if (activeTab === "WORK_EXP") {
                const result = await saveWorkExperienceAction(metadata, userId);
                if (result.success) {
                    const nodeTitles = [
                        metadata.company, 
                        metadata.designation,
                        metadata.department,
                        metadata.deskUnit,
                        metadata.sector,
                        metadata.skills || metadata.expertness 
                    ].filter(Boolean);

                    const uniqueTitles = Array.from(new Set(nodeTitles));
                    for (const title of uniqueTitles) {
                        const nodeRes = await createNode({
                            title: title,
                            type: "WORK_EXP",
                            metadata: metadata
                        }, userId);
                        
                        if (nodeRes.success && nodeRes.node) {
                            setNodes(prev => [nodeRes.node as RootNode, ...prev]);
                        }
                    }
                }
            }
            else if (activeTab === "PR_ADDR" || activeTab === "PM_ADDR") {
                let locations = [];
                if (metadata.addressType === "URBAN") {
                    locations = [
                        { title: metadata.district }, { title: metadata.upazila },
                        { title: metadata.mohalla }, { title: metadata.area },
                        { title: metadata.road }, { title: metadata.house },
                        { title: metadata.section }
                    ];
                } else {
                    locations = [
                        { title: metadata.district }, { title: metadata.upazila },
                        { title: metadata.union }, { title: `Ward-${metadata.wordNo}` },
                        { title: metadata.village }
                    ];
                }

                const validLocations = locations.filter(loc => loc.title && loc.title.trim() !== "");
                for (const loc of validLocations) {
                    const result = await createNode({
                        title: loc.title,
                        type: activeTab,
                        metadata: metadata,
                    }, userId);
                    if (result.success && result.node) {
                        setNodes(prev => [result.node as RootNode, ...prev]);
                    }
                }
            } 
            else if (activeTab === "SKILL") {
                if (Array.isArray(metadata.skills)) {
                    const newNodes: RootNode[] = [];
                    for (const skill of metadata.skills) {
                        try {
                            await saveOrUpdateSkill(skill.name);
                            const result = await createNode({ 
                                title: skill.name, 
                                type: "SKILL", 
                                metadata: { slug: skill.slug } 
                            }, userId);

                            if (result.success && result.node) {
                                newNodes.push(result.node as RootNode);
                            }
                        } catch (err) {
                            console.error(`Skill save failed for ${skill.name}:`, err);
                        }
                    }
                    if (newNodes.length > 0) {
                        setNodes(prev => [...newNodes, ...prev]);
                    }
                }
            }
            else {
                let nodesToCreate = [];
                if (["SCHOOL", "COLLEGE", "UNIVERSITY"].includes(activeTab)) {
                    if (metadata.instituteName) nodesToCreate.push({ title: metadata.instituteName });
                    if (metadata.passingYear) nodesToCreate.push({ title: `Batch: ${metadata.passingYear}` });
                    if (metadata.major) nodesToCreate.push({ title: metadata.major });
                    if (activeTab === "UNIVERSITY" && metadata.hallName) {
                        nodesToCreate.push({ title: metadata.hallName });
                    }
                } else {
                    let titleStr = metadata.name || metadata.company || activeTab;
                    nodesToCreate.push({ title: titleStr });
                }

                for (const item of nodesToCreate) {
                    if (item.title && item.title.trim() !== "") {
                        const result = await createNode({ 
                            title: item.title, 
                            type: activeTab, 
                            metadata: metadata 
                        }, userId);

                        if (result.success && result.node) {
                            setNodes(prev => [result.node as RootNode, ...prev]);
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Save Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        try {
            const res = await deleteNode(deleteId);
            if (res.success) {
                setNodes(prev => prev.filter(n => n.id !== deleteId));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDeleteId(null);
            setLoading(false);
        }
    };

    const filteredNodes = nodes.filter(node => node.type === activeTab);
    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 text-slate-900 relative">
            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !loading && setDeleteId(null)}></div>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiAlertCircle size={40} />
                        </div>
                        <h3 className="text-xl font-black mb-2">আপনি কি নিশ্চিত?</h3>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-slate-100 font-bold rounded-2xl">না</button>
                            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-2xl">হ্যাঁ</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b py-8 px-6 mb-8 shadow-sm">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-black text-slate-800">আমার রুট ম্যাপ</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {/* Tabs */}
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-8 w-fit gap-1 overflow-x-auto shadow-inner border border-slate-200 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setFilterLocation(null); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-white text-blue-600 shadow-md scale-[1.02]" : "text-slate-600 hover:bg-slate-200"}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form Side */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
                            {activeTab === "BIO" && <BioNode onSave={handleSaveToDB} />}
                            {(activeTab === "PR_ADDR" || activeTab === "PM_ADDR") && <AddressNode type={activeTab as any} onSave={handleSaveToDB} />}
                            {["SCHOOL", "COLLEGE", "UNIVERSITY"].includes(activeTab) && (
                                <EducationNode 
                                    type={activeTab as any} 
                                    label={tabs.find(t=>t.id===activeTab)?.label || ""} 
                                    onSave={handleSaveToDB} 
                                />
                            )}
                            {activeTab === "WORK_EXP" && <WorkExpNode onSave={handleSaveToDB} />}
                            {activeTab === "SKILL" && <SkillSelector onSave={handleSaveToDB} />}
                        </div>
                    </div>

                    {/* Saved Data Side */}
                    <div className="lg:col-span-7 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                            <FiCheckCircle className="text-green-500" /> সংরক্ষিত তথ্য
                        </h3>

                        <div className="flex flex-wrap gap-3">
                            {filteredNodes.map((node) => (
                                <div key={node.id} className="group flex items-center gap-2 bg-white pl-4 pr-2 py-2.5 rounded-full border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer">
                                    <span className="text-sm font-bold text-slate-700" onClick={() => setFilterLocation(node.title)}>
                                        {node.title}
                                    </span>
                                    <button onClick={() => setDeleteId(node.id)} className="text-slate-300 hover:text-red-500 p-1 transition-colors">
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {filteredNodes.length === 0 && <p className="text-slate-400 italic text-sm ml-2">কোনো তথ্য যোগ করা হয়নি</p>}
                        </div>

                        {filterLocation && (
                            <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-tight">যারা "{filterLocation}"-এ আছেন</p>
                                    <button onClick={() => setFilterLocation(null)} className="text-slate-400 hover:text-slate-600"><FiX /></button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 bg-white p-2 pr-4 rounded-full shadow-sm border border-white hover:border-blue-200 transition-all">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold">UN</div>
                                        <span className="text-sm font-bold text-slate-700">ব্যবহারকারীর নাম</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}