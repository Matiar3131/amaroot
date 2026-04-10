'use client';

import { useState, useEffect } from 'react';
import { createNode, getNetworkConnections, getNodeList } from "@/app/actions/nodeActions";
import Image from 'next/image';
import Link from 'next/link';

interface RootNode {
  id: string;
  type: string;
  title: string;
  year?: string | null;
  subject?: string | null;
}

interface NetworkMember {
  id: string;
  title: string;
  type: string; // নিশ্চিত করুন আপনার অ্যাকশন থেকে এই টাইপটি আসছে
  subject?: string | null;
  year?: string | null;
  user: {
    id: string;
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

  const [suggestions, setSuggestions] = useState<{ name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [newNode, setNewNode] = useState({
    type: 'SCHOOL',
    title: '',
    year: '',
    subject: ''
  });

  // ১. Autocomplete suggestions logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (newNode.title.length > 1) {
        let searchType = newNode.type;
        if (searchType === 'Present JOB') searchType = 'JOB';
        if (searchType === 'ACADEMY') searchType = 'SCHOOL';

        const res = await fetch(`/api/institutions?q=${newNode.title}&type=${searchType}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [newNode.title, newNode.type]);

  // ২. Initial network and nodelist loading
  useEffect(() => {
    const initData = async () => {
      const networkData = await getNetworkConnections();
      // @ts-ignore
      setNetwork(networkData);
      const list = await getNodeList();
      if (list && list.length > 0) setAvailableNodeTypes(list);
    };
    initData();
  }, [nodes]);

  // ৩. Filtering logic
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
        setNodes([{
          id: result.node.id,
          type: result.node.type,
          title: result.node.title,
          year: result.node.year,
          subject: result.node.subject
        }, ...nodes]);
        setNewNode({ type: 'SCHOOL', title: '', year: '', subject: '' });
        setIsModalOpen(false);
      }
    } catch (err) {
      alert("কিছু একটা ভুল হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10 px-6 mb-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">আমার শিকড় (Root Map)</h1>
            <p className="text-gray-500 mt-2">কার্ডে ক্লিক করে সেই প্রতিষ্ঠানের নেটওয়ার্ক মেম্বারদের দেখুন।</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            + নতুন রুট যোগ করুন
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* ৪. My Roots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div 
            onClick={() => setSelectedTitle(null)}
            className={`p-6 rounded-[32px] border transition-all cursor-pointer flex items-center justify-center ${
              selectedTitle === null ? "bg-black text-white shadow-xl shadow-gray-200" : "bg-white border-gray-100"
            }`}
          >
            <span className="font-bold uppercase tracking-widest text-xs">সবাইকে দেখুন (Show All)</span>
          </div>

          {nodes.map((node) => (
            <div 
              key={node.id} 
              onClick={() => setSelectedTitle(node.title)}
              className={`p-6 rounded-[32px] border transition-all cursor-pointer relative overflow-hidden ${
                selectedTitle === node.title ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-xl" : "bg-white border-gray-100 hover:border-blue-200"
              }`}
            >
              <span className={`text-[10px] font-black uppercase opacity-60 ${selectedTitle === node.title ? "text-white" : "text-blue-600"}`}>
                {node.type}
              </span>
              <h3 className="text-xl font-bold mt-1">{node.title}</h3>
              {node.subject && <p className="text-[11px] font-bold mt-1 opacity-80">📚 {node.subject}</p>}
              <p className="mt-4 text-sm opacity-60 font-medium">{node.year || "এখন পর্যন্ত"}</p>
            </div>
          ))}
        </div>

        {/* ৫. Network Members Grid with Hover Popup */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            {selectedTitle ? `👥 ${selectedTitle} এর মেম্বাররা` : "👥 সকল নেটওয়ার্ক মেম্বার"}
            <span className="text-sm font-medium bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
              {filteredNetwork.length}
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNetwork.map((member) => (
              <div 
                key={member.id} 
                className="relative group bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-4 hover:border-blue-100 transition-all cursor-default"
              >
                {/* Hover Popup Card */}
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-80 bg-white p-8 rounded-[40px] shadow-2xl shadow-blue-900/10 border border-gray-100 z-[120] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 pointer-events-none group-hover:pointer-events-auto">
                  <div className="text-center flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-blue-50 border-4 border-white ring-4 ring-blue-50 mb-4 shadow-inner">
                      {member.user.image ? (
                        <Image src={member.user.image} alt={member.user.name || ""} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-400 font-black text-4xl">
                          {member.user.name?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-extrabold text-2xl text-gray-950 leading-tight">
                      {member.user.name || "Anonymous"}
                    </h4>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full mt-2 mb-6">
                      {member.title}
                    </p>
                    
                    <div className="w-full text-left bg-gray-50 p-5 rounded-3xl space-y-3">
                      <p className="text-xs text-gray-700 font-medium flex justify-between">
                        <span className="font-bold text-gray-400 uppercase">ইনস্টিটিউশন:</span> 
                        <span className="text-gray-900">{member.title}</span>
                      </p>
                      {member.subject && (
                        <p className="text-xs text-gray-700 font-medium flex justify-between">
                          <span className="font-bold text-gray-400 uppercase">সাবজেক্ট:</span> 
                          <span className="text-gray-900">{member.subject}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-700 font-medium flex justify-between">
                        <span className="font-bold text-gray-400 uppercase">সময়কাল:</span> 
                        <span className="text-gray-900">{member.year || "তথ্য নেই"}</span>
                      </p>
                    </div>
                    
                 
<Link 
  href={`/profile/${member.user.id}`} // assuming member.user.id is the target user's ID
  className="w-full mt-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors active:scale-95 text-sm text-center block"
>
  সম্পূর্ণ প্রোফাইল দেখুন
</Link>
                  </div>
                  {/* Triangle Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-white"></div>
                </div>

                {/* Main Card Content */}
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-blue-50 flex-shrink-0">
                  {member.user.image ? (
                    <Image src={member.user.image} alt={member.user.name || ""} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold text-xl">
                      {member.user.name?.[0] || "?"}
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-gray-900 truncate">{member.user.name || "Anonymous"}</h4>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider truncate opacity-70">
                    {member.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredNetwork.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 mt-6">
              <p className="text-gray-400 font-medium italic">এই প্রতিষ্ঠানে আর কোনো মেম্বার পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Root Add Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-8 border-b pb-4 tracking-tight">রুট তথ্য যোগ করুন</h2>
            <div className="space-y-5">
              
              <div>
                <label className="text-[10px] font-bold text-gray-400 ml-2 mb-1 block uppercase tracking-widest">ক্যাটাগরি</label>
                <select 
                  value={newNode.type}
                  onChange={(e) => setNewNode({...newNode, type: e.target.value, title: '', subject: ''})}
                  className="w-full bg-gray-50 p-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold appearance-none"
                >
                  {availableNodeTypes.map((item) => (
                    <option key={item.name} value={item.name}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="text-[10px] font-bold text-gray-400 ml-2 mb-1 block uppercase tracking-widest">প্রতিষ্ঠানের নাম</label>
                <input 
                  type="text"
                  autoComplete="off"
                  placeholder="টাইপ করুন (উদা: University of Dhaka)"
                  value={newNode.title}
                  onChange={(e) => {
                    setNewNode({...newNode, title: e.target.value});
                    setShowSuggestions(true);
                  }}
                  className="w-full bg-gray-50 p-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
                
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-[210] left-0 right-0 bg-white mt-2 rounded-2xl shadow-2xl border border-gray-100 max-h-52 overflow-y-auto p-2">
                    {suggestions.map((s, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setNewNode({ ...newNode, title: s.name });
                          setSuggestions([]);
                          setShowSuggestions(false);
                        }}
                        className="p-4 hover:bg-blue-50 cursor-pointer font-bold text-gray-700 rounded-xl transition-colors flex items-center justify-between"
                      >
                        <span>{s.name}</span>
                        <span className="text-[9px] bg-blue-100 px-2 py-1 rounded text-blue-600 font-black">MATCH</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 ml-2 mb-1 block uppercase tracking-widest">সময়কাল</label>
                <input 
                  type="text"
                  placeholder="উদা: ২০০৫ - ২০১০"
                  value={newNode.year}
                  onChange={(e) => setNewNode({...newNode, year: e.target.value})}
                  className="w-full bg-gray-50 p-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {(newNode.type === 'SCHOOL' || newNode.type === 'COLLEGE' || newNode.type === 'UNIVERSITY') && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold text-blue-600 ml-2 mb-1 block uppercase tracking-widest">সাবজেক্ট / গ্রুপ</label>
                  <select 
                    value={newNode.subject}
                    onChange={(e) => setNewNode({...newNode, subject: e.target.value})}
                    className="w-full bg-blue-50 p-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-blue-700 appearance-none"
                  >
                    <option value="">সাবজেক্ট বেছে নিন</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commerce">Commerce</option>
                    <option value="CSE">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="BBA">BBA</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-10">
              <button 
                onClick={handleAddNode} 
                disabled={loading} 
                className="w-full py-5 bg-blue-600 text-white font-black rounded-[24px] shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all"
              >
                {loading ? "সংরক্ষণ হচ্ছে..." : "রুট সেভ করুন"}
              </button>
              <button onClick={() => setIsModalOpen(false)} className="py-2 text-gray-400 font-bold hover:text-gray-600 transition-colors">বাতিল করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}