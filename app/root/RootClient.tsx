"use client";

import { useState, useEffect } from 'react';
import { createNode, deleteNode } from "@/app/actions/nodeActions";
import { 
    FiMapPin, FiBookOpen, FiBriefcase, FiCpu, 
    FiCheckCircle, FiAlertCircle,
    FiUser, FiX, FiTrash2
} from "react-icons/fi";

// কম্পোনেন্ট ইম্পোর্ট
import AddressNode from "@/components/profile-nodes/AddressNode";
import BioNode from "@/components/profile-nodes/BioNode";
// অন্যান্য নোডগুলো প্রয়োজন অনুযায়ী ইম্পোর্ট রাখুন

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
    
    // ডিলিট কনফার্মেশন স্টেট
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
        { id: "ORG_DIV", label: "কর্পোরেট", icon: <FiBriefcase /> },
        { id: "WORK_EXP", label: "কাজের অভিজ্ঞতা", icon: <FiBriefcase /> },
        { id: "SKILL", label: "দক্ষতা", icon: <FiCpu /> },
    ];

    const handleSaveToDB = async (metadata: any) => {
        setLoading(true);
        try {
            if (activeTab === "PR_ADDR" || activeTab === "PM_ADDR") {
                let locations = [];
                
                if (metadata.addressType === "URBAN") {
                    locations = [
                        { title: metadata.district },
                        { title: metadata.upazila },
                        { title: metadata.mohalla },
                        { title: metadata.area },
                        { title: metadata.section ? `Section/Block: ${metadata.section}` : "" },
                        { title: metadata.road ? `Road: ${metadata.road}` : "" },
                        { title: metadata.house ? `House: ${metadata.house}` : "" }
                    ];
                } else {
                    locations = [
                        { title: metadata.district },
                        { title: metadata.upazila },
                        { title: metadata.union },
                        { title: `${metadata.union}/Word-${metadata.wordNo}` }
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
            } else {
                let titleStr = metadata.instituteName || metadata.name || metadata.company || activeTab;
                const result = await createNode({ title: titleStr, type: activeTab, metadata }, userId);
                if (result.success && result.node) {
                    setNodes(prev => [result.node as RootNode, ...prev]);
                }
            }
        } catch (err) {
            console.error(err);
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
            
            {/* --- Modern Delete Modal --- */}
            {deleteId && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                        onClick={() => !loading && setDeleteId(null)}
                    ></div>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiAlertCircle size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">আপনি কি নিশ্চিত?</h3>
                        <p className="text-slate-500 text-sm mb-8">এই তথ্যটি ডিলিট করলে আর ফিরে পাওয়া যাবে না।</p>
                        <div className="flex gap-3">
                            <button 
                                disabled={loading}
                                onClick={() => setDeleteId(null)} 
                                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all disabled:opacity-50"
                            >
                                না, থাক
                            </button>
                            <button 
                                disabled={loading}
                                onClick={confirmDelete} 
                                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all disabled:opacity-50"
                            >
                                {loading ? "মুছছি..." : "হ্যাঁ, ডিলিট"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-8 px-6 mb-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">আমার রুট ম্যাপ</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {/* Tabs */}
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-8 w-fit gap-1 overflow-x-auto no-scrollbar shadow-inner">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setFilterLocation(null); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-white text-blue-600 shadow-md" : "text-slate-600 hover:bg-slate-200"}`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Form Side */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            {activeTab === "BIO" && <BioNode onSave={handleSaveToDB} />}
                            {(activeTab === "PR_ADDR" || activeTab === "PM_ADDR") && <AddressNode type={activeTab as any} onSave={handleSaveToDB} />}
                            {/* অন্য নোড ফর্মগুলো এখানে অ্যাড করুন */}
                        </div>
                    </div>

                    {/* Right Saved Nodes Side */}
                    <div className="lg:col-span-7 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                            <FiCheckCircle className="text-green-500" /> সংরক্ষিত তথ্য
                        </h3>

                        <div className="flex flex-wrap gap-3">
                            {filteredNodes.map((node) => (
                                <div 
                                    key={node.id} 
                                    className="group flex items-center gap-2 bg-white pl-4 pr-2 py-2.5 rounded-full border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-50 transition-all cursor-pointer"
                                >
                                    <span 
                                        className="text-sm font-bold text-slate-700"
                                        onClick={() => setFilterLocation(node.title)}
                                    >
                                        {node.title}
                                    </span>
                                    
                                    <div className="flex items-center gap-1 border-l border-slate-100 pl-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setDeleteId(node.id); }} 
                                            className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredNodes.length === 0 && (
                                <p className="text-slate-400 italic text-sm ml-2">কোনো তথ্য যোগ করা হয়নি</p>
                            )}
                        </div>

                        {/* People Insight Section */}
                        {filterLocation && (
                            <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-500">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter">যারা "{filterLocation}"-এ আছেন</p>
                                    <button onClick={() => setFilterLocation(null)} className="text-slate-400 hover:text-slate-600"><FiX /></button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 bg-white p-2 pr-4 rounded-full shadow-sm border border-white hover:border-blue-200 transition-all cursor-default">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold">MR</div>
                                        <span className="text-sm font-bold text-slate-700">Matiar Rahman</span>
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