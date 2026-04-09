'use client';

import { useState, useEffect } from 'react';
import { createNode, getNetworkConnections, getNodeList } from "@/app/actions/nodeActions";

interface RootNode {
  id: string;
  type: string;
  title: string;
  year?: string | null;
  subject?: string | null; // নতুন ফিল্ড যোগ করা হয়েছে
}

interface NetworkMember {
  id: string;
  title: string;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface NodeListItem {
  name: string;
  label: string;
}

export default function RootClient({ initialNodes }: { initialNodes: RootNode[] }) {
  const [nodes, setNodes] = useState<RootNode[]>(initialNodes);
  const [network, setNetwork] = useState<NetworkMember[]>([]);
  const [availableNodeTypes, setAvailableNodeTypes] = useState<NodeListItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  // ১. ডাইনামিক ফিল্ড স্টেট (subject সহ)
  const [newNode, setNewNode] = useState({ 
    type: 'SCHOOL', 
    title: '', 
    year: '', 
    subject: '' 
  });

  useEffect(() => {
    const initData = async () => {
      const networkData = await getNetworkConnections();
      // @ts-ignore
      setNetwork(networkData);

      const list = await getNodeList();
      if (list && list.length > 0) {
        setAvailableNodeTypes(list);
        setNewNode(prev => ({ ...prev, type: list[0].name }));
      }
    };
    initData();
  }, [nodes]);

  const filteredNetwork = selectedTitle 
    ? network.filter(item => item.title.toLowerCase() === selectedTitle.toLowerCase())
    : network;

  const handleAddNode = async () => {
    if (!newNode.title) {
      alert("প্রতিষ্ঠানের নাম অবশ্যই দিতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const result = await createNode(newNode);

      if (result.success && result.node) {
        const formattedNode: RootNode = {
          id: result.node.id,
          type: result.node.type,
          title: result.node.title,
          year: result.node.year,
          subject: result.node.subject // subject অ্যাড করা হলো
        };
        setNodes([formattedNode, ...nodes]);
        setNewNode({ type: availableNodeTypes[0]?.name || 'SCHOOL', title: '', year: '', subject: '' });
        setIsModalOpen(false);
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("কিছু একটা ভুল হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* হেডার */}
      <div className="bg-white border-b border-gray-100 py-10 px-6 mb-8 text-center md:text-left">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">আমার শিকড় (Root Map)</h1>
            <p className="text-gray-500 mt-2">আপনার শিক্ষা ও কর্মজীবনের ঐতিহাসিক চেইন তৈরি করুন।</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
          >
            <span className="text-xl">+</span> নতুন রুট যোগ করুন
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* ২. ইউজার নোড লিস্ট গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map((node) => {
            const isSelected = selectedTitle?.toLowerCase() === node.title.toLowerCase();
            return (
              <div 
                key={node.id} 
                onClick={() => setSelectedTitle(isSelected ? null : node.title)}
                className={`group cursor-pointer p-6 rounded-[32px] border transition-all duration-300 relative overflow-hidden ${
                  isSelected 
                    ? "bg-blue-600 border-blue-600 shadow-2xl text-white scale-105" 
                    : "bg-white border-gray-100 shadow-sm hover:border-blue-100"
                }`}
              >
                <span className={`relative inline-block text-[10px] font-black px-3 py-1 rounded-full uppercase mb-4 ${
                  isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                }`}>
                  {node.type}
                </span>
                <h3 className="relative text-xl font-bold">{node.title}</h3>
                
                {/* সাবজেক্ট ডিসপ্লে */}
                {node.subject && (
                  <p className={`text-[11px] font-bold mt-1 uppercase tracking-wider ${isSelected ? "text-blue-100" : "text-blue-500"}`}>
                    📚 {node.subject}
                  </p>
                )}
                
                <p className={`relative mt-4 text-sm font-medium ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                  {node.year || "এখন পর্যন্ত"}
                </p>
              </div>
            );
          })}
        </div>

        {/* ৩. কানেক্টেড নেটওয়ার্ক */}
        {network.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 italic">
                {selectedTitle ? `"${selectedTitle}"-এর মেম্বাররা` : "নেটওয়ার্ক মেম্বাররা"}
              </h2>
              {selectedTitle && (
                <button onClick={() => setSelectedTitle(null)} className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">সবাইকে দেখুন</button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredNetwork.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black overflow-hidden ring-2 ring-blue-50">
                      {item.user.image ? <img src={item.user.image} alt="" className="w-full h-full object-cover" /> : item.user.name?.[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">{item.user.name}</h4>
                      <p className="text-[10px] text-blue-600 font-bold uppercase">{item.title}</p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-gray-50 text-gray-600 font-bold text-xs rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">প্রোফাইল দেখুন</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ৪. মোডাল (ডাইনামিক ও কন্ডিশনাল ফিল্ড সহ) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-8 border-b pb-4">রুট তথ্য যোগ করুন</h2>
            <div className="space-y-5">
              
              {/* টাইপ সিলেকশন */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 ml-2 mb-1 block uppercase">ক্যাটাগরি</label>
                <select 
                  value={newNode.type}
                  onChange={(e) => setNewNode({...newNode, type: e.target.value, subject: ''})}
                  className="w-full bg-gray-50 p-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-700"
                >
                  {availableNodeTypes.map((item) => (
                    <option key={item.name} value={item.name}>{item.label}</option>
                  ))}
                </select>
              </div>

              {/* প্রতিষ্ঠানের নাম */}
              <input 
                type="text"
                placeholder="প্রতিষ্ঠানের নাম"
                value={newNode.title}
                onChange={(e) => setNewNode({...newNode, title: e.target.value})}
                className="w-full bg-gray-50 p-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
              />

              {/* সময়কাল */}
              <input 
                type="text"
                placeholder="সময়কাল (উদা: ২০০৫ - ২০১০)"
                value={newNode.year}
                onChange={(e) => setNewNode({...newNode, year: e.target.value})}
                className="w-full bg-gray-50 p-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
              />

              {/* কন্ডিশনাল সাবজেক্ট ফিল্ড (SCHOOL, COLLEGE, UNIVERSITY হলে দেখাবে) */}
              {(newNode.type === 'SCHOOL' || newNode.type === 'COLLEGE' || newNode.type === 'UNIVERSITY') && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold text-blue-600 ml-2 mb-1 block uppercase">সাবজেক্ট / গ্রুপ</label>
                  <select 
                    value={newNode.subject}
                    onChange={(e) => setNewNode({...newNode, subject: e.target.value})}
                    className="w-full bg-blue-50 p-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-blue-700"
                  >
                    <option value="">সাবজেক্ট বেছে নিন</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="General">General</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-10">
              <button 
                onClick={handleAddNode} 
                disabled={loading} 
                className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all"
              >
                {loading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </button>
              <button onClick={() => setIsModalOpen(false)} className="py-2 text-gray-400 font-bold hover:text-gray-600">পরে করব</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}