"use client";
import React, { useEffect, useState, useRef } from "react";
import { 
  Users, MessageCircle, X, ChevronUp, ChevronDown, 
  Search, Send, UserPlus, Paperclip, Video, Phone 
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getRouteMembers } from "@/app/actions/userActions";
import { sendChatMessage, getChatMessages } from "@/app/actions/chatActions";
import { pusherClient } from "@/lib/pusher";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useUploadThing } from "@/utils/uploadthing";
import VideoCallModal from "@/components/chat/VideoCallModal"
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
  const [searchTerm, setSearchTerm] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [videoToken, setVideoToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);

  const handleVideoCall = async () => {
  if (!activeChat || !currentUserId) return;
  
  const room = [currentUserId, activeChat.id].sort().join("-"); // ইউনিক রুম আইডি
  setRoomName(room);
  
  try {
    const resp = await fetch(`/api/livekit?room=${room}&username=${session?.user?.name || 'User'}`);
    const data = await resp.json();
    setVideoToken(data.token);
  } catch (e) {
    console.error(e);
    toast.error("কল কানেক্ট করা যাচ্ছে না!");
  }
};

  // UploadThing Setup
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        const fileUrl = res[0].url;
        handleSend(undefined, `FILE_URL:${fileUrl}`);
        toast.dismiss();
        toast.success("ফাইল পাঠানো হয়েছে!");
      }
    },
    onUploadError: (error) => {
      toast.dismiss();
      toast.error("আপলোড ব্যর্থ হয়েছে: " + error.message);
    },
  });

  // ১. মেম্বার লোড করার লজিক
  useEffect(() => {
    async function loadMembers() {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const data = await getRouteMembers(activeNodeId, currentUserId);
        setMembers(data || []);
      } catch (error) {
        console.error("Failed to load members", error);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, [activeNodeId, currentUserId]);

  // ২. চ্যাট হিস্ট্রি লোড
  useEffect(() => {
    if (activeChat && currentUserId) {
      const loadHistory = async () => {
        const history = await getChatMessages(activeChat.id, currentUserId);
        setMessages(history || []);
      };
      loadHistory();
    }
  }, [activeChat, currentUserId]);

  // ৩. পুশার লিসেনার
  useEffect(() => {
    if (!currentUserId || !pusherClient) return;

    const channelName = `chat-${currentUserId}`;
    const channel = pusherClient.subscribe(channelName);

    const handleMessage = (data: any) => {
      if (activeChat && data.senderId === activeChat.id) {
        setMessages((prev) => {
          const isDuplicate = prev.some((msg) => msg.id === data.id);
          if (isDuplicate) return prev;
          return [...prev, data];
        });
      } else {
        toast.success(`নতুন মেসেজ এসেছে!`, { icon: '💬' });
      }
    };

    const handleTyping = (data: any) => {
      if (activeChat && data.userId === activeChat.id) {
        setTypingUser(activeChat.name.split(" ")[0]);
        setTimeout(() => setTypingUser(null), 3000);
      }
    };

    channel.bind("incoming-message", handleMessage);
    channel.bind("client-typing", handleTyping);

    return () => {
      channel.unbind("incoming-message", handleMessage);
      channel.unbind("client-typing", handleTyping);
      pusherClient?.unsubscribe(channelName);
    };
  }, [currentUserId, activeChat]);

  // ৪. অটো স্ক্রল
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingUser]);

  // ৫. টাইপিং ইভেন্ট ট্রিগার
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (activeChat && pusherClient) {
      pusherClient.send_event('client-typing', { userId: currentUserId }, `chat-${activeChat.id}`);
    }
  };

  // ৬. মেসেজ পাঠানোর মেইন ফাংশন
  const handleSend = async (e?: React.FormEvent, customContent?: string) => {
    if (e) e.preventDefault();
    const contentToSend = customContent || inputMessage;
    
    if (!contentToSend.trim() || !activeChat || !currentUserId) return;

    const payload = {
      id: Date.now().toString(),
      senderId: currentUserId as string,
      receiverId: activeChat.id,
      content: contentToSend,
      nodeId: activeNodeId || undefined,
    };

    setMessages((prev) => [...prev, payload]);
    if (!customContent) setInputMessage("");

    try {
      await sendChatMessage(payload);
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("মেসেজ পাঠানো যায়নি");
    }
  };

  const filteredMembers = members.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <div key={member.id} className="relative" onMouseEnter={() => setHoveredMember(member.id)} onMouseLeave={() => setHoveredMember(null)}>
                <div 
                  onClick={() => { setActiveChat(member); setMessages([]); }}
                  className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden border border-slate-50 flex items-center justify-center font-bold text-slate-400 text-xs shadow-sm">
                    {member.image ? <img src={member.image} className="w-full h-full object-cover" alt="" /> : member.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[11px] font-black text-slate-800 truncate uppercase tracking-tight">{member.name}</h5>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">Verified Member</p>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <MessageCircle size={16} />
                  </button>
                </div>

                <AnimatePresence>

{videoToken && roomName && (
  <VideoCallModal 
    room={roomName} 
    token={videoToken} 
    onDisconnect={() => {
      setVideoToken(null);
      setRoomName(null);
    }} 
  />
)}

                  {hoveredMember === member.id && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: -10 }} exit={{ opacity: 0, x: -20 }} className="absolute right-full top-0 mr-4 w-48 bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 z-[300]">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl mb-2 flex items-center justify-center text-blue-600 font-black">
                          {member.name.charAt(0)}
                        </div>
                        <h6 className="text-[10px] font-black uppercase text-slate-800">{member.name}</h6>
                        <button className="mt-3 w-full py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                          <UserPlus size={12} /> Connect
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

      {/* ২. মডাল: View All Members */}
      <AnimatePresence>
        {isAllMembersOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAllMembersOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">All Members</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Network Community</p>
                </div>
                <button onClick={() => setIsAllMembersOpen(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-3">
                  {members.map((m) => (
                    <div key={m.id} className="p-4 border border-slate-50 rounded-3xl flex items-center gap-3 hover:border-blue-100 transition-all">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center font-black text-blue-600 text-xs">
                        {m.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase text-slate-800 truncate">{m.name}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Active Now</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ৩. ফ্লোটিং চ্যাট বক্স */}
      <AnimatePresence>
        {activeChat && (
          <motion.div 
            initial={{ y: 100, opacity: 0, scale: 0.9 }} 
            animate={{ y: 0, opacity: 1, scale: 1 }} 
            exit={{ y: 100, opacity: 0, scale: 0.9 }} 
            className="fixed bottom-0 right-[350px] w-80 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[32px] border border-slate-200 z-[200] overflow-hidden"
          >
            {/* হেডার সেকশন */}
            <div className="bg-blue-600 p-4 flex items-center justify-between text-white shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center text-[10px] font-black uppercase">
                  {activeChat.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                    {activeChat.name}
                  </span>
                  <span className="text-[7px] font-bold opacity-70 uppercase mt-1 tracking-tighter">
                    Active Now
                  </span>
                </div>
              </div>

              {/* কল এবং ক্লোজ বাটন */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toast.success(`${activeChat.name}-কে অডিও কল দেওয়া হচ্ছে...`)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-90"
                  title="Audio Call"
                >
                  <Phone size={15} />
                </button>
                <button 
                  onClick={() => toast.success(`${activeChat.name}-কে ভিডিও কল দেওয়া হচ্ছে...`)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-90"
                  title="Video Call"
                >
                  <Video size={16} />
                </button>
                <div className="w-[1px] h-4 bg-white/20 mx-1" />
                <button 
                  onClick={() => setActiveChat(null)} 
                  className="p-2 hover:bg-red-500/20 rounded-xl transition-all hover:rotate-90"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* চ্যাট মেসেজ সেকশন */}
            <div className="h-64 bg-slate-50/50 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUserId;
                const isFile = msg.content?.startsWith("FILE_URL:");
                
                return (
                  <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[8px] font-black uppercase text-slate-400 mb-1 px-1">
                      {isMe ? "Me" : activeChat.name.split(" ")[0]}
                    </span>
                    
                    <div className={`p-3 rounded-2xl text-[10px] font-bold shadow-sm max-w-[85%] 
                      ${isMe 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                      }`}
                    >
                      {isFile ? (
                        <img 
                          src={msg.content.replace("FILE_URL:", "")} 
                          alt="Shared file" 
                          className="max-w-full rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                          onClick={() => window.open(msg.content.replace("FILE_URL:", ""), "_blank")}
                        />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                );
              })}
              {typingUser && (
                <div className="text-[8px] font-black text-blue-500 animate-pulse uppercase px-1">
                  {typingUser} is typing...
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* ইনপুট সেকশন */}
            <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    toast.loading("আপলোড হচ্ছে...");
                    await startUpload([file]);
                  }
                }}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Paperclip size={18} />
              </button>
              
              <input 
                value={inputMessage} 
                onChange={handleInputChange} 
                onKeyDown={(e) => e.key === "Enter" && handleSend()} 
                placeholder="Aa" 
                className="flex-1 text-xs bg-slate-50 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 px-4 transition-all" 
              />
              <button 
                onClick={() => handleSend()} 
                className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ৪. মেসেজিং টগল বার */}
      <div className="mt-auto relative">
        <AnimatePresence>
          {isMessagingOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 430, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="absolute bottom-full left-0 right-0 bg-white border border-slate-100 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] rounded-t-[32px] overflow-hidden z-[150] mb-[-1px]">
              <div className="p-4 border-b border-slate-50 flex flex-col gap-3 bg-slate-50/50">
                <div className="flex items-center justify-between px-1">
                  <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Messages</h5>
                  <Search size={14} className="text-slate-400" />
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Search contacts..." 
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-4 text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all uppercase" 
                  />
                </div>
              </div>

              <div className="overflow-y-auto h-[330px] p-2 custom-scrollbar">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((m) => (
                    <div key={m.id} onClick={() => { setActiveChat(m); setIsMessagingOpen(false); setSearchTerm(""); }} className="flex items-center gap-3 p-3.5 hover:bg-blue-50/50 rounded-2xl cursor-pointer transition-all border-b border-slate-50/50 last:border-0 group">
                      <div className="relative">
                        <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-blue-600 font-black text-xs shadow-sm">{m.name.charAt(0)}</div>
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
                  ))
                ) : (
                  <div className="p-10 text-center"><p className="text-[10px] font-black text-slate-300 uppercase">No results found</p></div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div onClick={() => setIsMessagingOpen(!isMessagingOpen)} className={`bg-white border border-slate-100 rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all z-[160] relative ${isMessagingOpen ? 'border-b-blue-600 border-b-2' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl"><MessageCircle size={20} className="text-blue-600 fill-blue-600/10" /></div>
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