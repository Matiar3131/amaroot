"use client";
import React, { useEffect, useState, useRef } from "react";
import { Users, Zap, ArrowRight, MessageCircle, X, ExternalLink, UserPlus, ChevronUp, ChevronDown, Search, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getRouteMembers } from "@/app/actions/userActions";
import { sendChatMessage } from "@/app/actions/chatActions";
import { pusherClient } from "@/lib/pusher";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function SidebarRight() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  
  const searchParams = useSearchParams();
  const activeNodeId = searchParams.get("nodeId") || undefined;
  
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [isAllMembersOpen, setIsAllMembersOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  // চ্যাট স্টেট
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // মেম্বার লোড করা
  useEffect(() => {
    async function loadMembers() {
      setLoading(true);
      const data = await getRouteMembers(activeNodeId);
      setMembers(data);
      setLoading(false);
    }
    loadMembers();
  }, [activeNodeId]);

  // পুশার লিসেনার
  useEffect(() => {
    if (!currentUserId) return;

    const channel = pusherClient.subscribe(`chat-${currentUserId}`);
    channel.bind("incoming-message", (data: any) => {
      // যদি মেসেজটি ওপেন থাকা চ্যাটের ইউজারের কাছ থেকে আসে
      if (activeChat && data.senderId === activeChat.id) {
        setMessages((prev) => [...prev, data]);
      } else {
        // এখানে আপনি নোটিফিকেশন লজিক দিতে পারেন
        console.log("New message from someone else:", data.sender.name);
      }
    });

    return () => {
      pusherClient.unsubscribe(`chat-${currentUserId}`);
    };
  }, [currentUserId, activeChat]);

  // স্ক্রল কন্ট্রোল
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // মেসেজ পাঠানো
  const handleSend = async () => {
    if (!inputMessage.trim() || !activeChat || !currentUserId) return;

    const payload = {
      senderId: currentUserId,
      receiverId: activeChat.id,
      content: inputMessage,
      nodeId: activeNodeId,
    };

    // অপ্টিমিস্টিক আপডেট (নিজের স্ক্রিনে সাথে সাথে দেখানো)
    setMessages((prev) => [...prev, { ...payload, id: Date.now().toString() }]);
    setInputMessage("");

    await sendChatMessage(payload);
  };

  return (
    <div className="h-[calc(100vh-120px)] sticky top-24 flex flex-col gap-4">
      
      {/* ১. মেম্বার লিস্ট কার্ড */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col min-h-[350px] relative">
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              {activeNodeId ? "রুটের মেম্বাররা" : "সাজেস্টেড কানেকশন"}
            </h4>
          </div>
          {!loading && members.length > 0 && (
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>

        <div className="space-y-5 flex-1 overflow-visible pr-2 custom-scrollbar">
          {loading ? (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 w-full bg-slate-50 animate-pulse rounded-2xl" />
                ))}
            </div>
          ) : members.length > 0 ? (
            members.map((member) => (
              <div 
                key={member.id} 
                className="relative"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div 
                  onClick={() => { setActiveChat(member); setMessages([]); }}
                  className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden border border-slate-50 flex items-center justify-center font-bold text-slate-400 text-xs shadow-sm">
                    {member.image ? <img src={member.image} className="w-full h-full object-cover" /> : member.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[11px] font-black text-slate-800 truncate uppercase tracking-tight">{member.name}</h5>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">Verified Member</p>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-[10px] font-black text-slate-300 uppercase">মেম্বার নেই</p>
          )}
        </div>
        
        <button onClick={() => setIsAllMembersOpen(true)} className="w-full mt-4 py-4 text-[10px] font-black text-slate-400 hover:text-blue-600 tracking-widest uppercase border-t border-slate-50 transition-all">
          View All Members →
        </button>
      </div>

      {/* ৫. ফ্লোটিং চ্যাট বক্স */}
      <AnimatePresence>
        {activeChat && (
          <motion.div 
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="fixed bottom-0 right-[350px] w-80 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[32px] border border-slate-200 z-[200] overflow-hidden"
          >
            <div className="bg-blue-600 p-4 flex items-center justify-between text-white shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center text-[10px] font-black uppercase">
                  {activeChat.name.charAt(0)}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">{activeChat.name}</span>
              </div>
              <button onClick={() => setActiveChat(null)} className="hover:rotate-90 transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="h-64 bg-slate-50/50 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-2">
               {messages.map((msg, idx) => (
                 <div 
                   key={idx} 
                   className={`p-3 rounded-2xl text-[10px] font-bold shadow-sm max-w-[85%] ${
                     msg.senderId === currentUserId 
                     ? 'bg-blue-600 text-white self-end rounded-tr-none' 
                     : 'bg-white text-slate-800 self-start rounded-tl-none border border-slate-100'
                   }`}
                 >
                    {msg.content}
                 </div>
               ))}
               <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
              <input 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Aa" 
                className="flex-1 text-xs bg-slate-50 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 px-4 transition-all" 
              />
              <button onClick={handleSend} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ৬. মেসেজিং টগল বার */}
      <div className="mt-auto relative">
        <AnimatePresence>
          {isMessagingOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 400, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="absolute bottom-full left-0 right-0 bg-white border border-slate-100 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] rounded-t-[32px] overflow-hidden z-[150] mb-[-1px]"
            >
              <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest px-1">Messages</h5>
                <div className="p-2 hover:bg-white rounded-xl cursor-pointer shadow-sm border border-slate-100 transition-all">
                  <Search size={14} className="text-slate-400" />
                </div>
              </div>

              <div className="overflow-y-auto h-[340px] p-2 custom-scrollbar">
                {members.map((m) => (
                  <div key={m.id} onClick={() => { setActiveChat(m); setIsMessagingOpen(false); }} className="flex items-center gap-3 p-3.5 hover:bg-blue-50/50 rounded-2xl cursor-pointer transition-all border-b border-slate-50/50 last:border-0 group">
                    <div className="relative">
                      <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-blue-600 font-black text-xs shadow-sm">
                        {m.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h6 className="text-[11px] font-black text-slate-800 truncate uppercase group-hover:text-blue-600 tracking-tight">{m.name}</h6>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Active</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate font-bold mt-0.5 uppercase tracking-tighter">Click to chat</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div onClick={() => setIsMessagingOpen(!isMessagingOpen)} className={`bg-white border border-slate-100 rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all z-[160] relative ${isMessagingOpen ? 'border-b-blue-600 border-b-2' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <MessageCircle size={20} className="text-blue-600 fill-blue-600/10" />
            </div>
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Messaging</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-lg">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-green-600 uppercase">Online</span>
            </div>
            {isMessagingOpen ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
          </div>
        </div>
      </div>

    </div>
  );
}