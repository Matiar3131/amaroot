"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarMembers } from "./SidebarMembers";
import { SidebarChat } from "./SidebarChat";
import { SidebarToggle } from "./SidebarToggle";
import VideoCallModal from "@/components/chat/VideoCallModal";
import { getNodeMembers } from "@/app/actions/nodeActions";
import { Member, Message, SidebarRightProps } from "@/types/sidebar";
import { Search, MoreHorizontal } from "lucide-react";
import { pusherClient } from "@/lib/pusher"; // নিশ্চিত করুন এই পাথটি সঠিক
import axios from "axios"; // axios অথবা fetch ব্যবহার করতে পারেন

export default function SidebarRight({ currentUser }: SidebarRightProps) {
  const searchParams = useSearchParams();
  const nodeId = searchParams.get("nodeId");

  // --- States ---
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<Member | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMessagingOpen, setIsMessagingOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [videoToken, setVideoToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [isAllMembersOpen, setIsAllMembersOpen] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ১. মেম্বার ফেচিং
  useEffect(() => {
    let isMounted = true;
    async function loadMembers() {
      if (!nodeId) { setMembers([]); return; }
      setLoading(true);
      try {
        const data = await getNodeMembers(nodeId, currentUser?.id);
        if (isMounted) setMembers((data as Member[]) || []);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadMembers();
    return () => { isMounted = false; };
  }, [nodeId, currentUser?.id]);

  // ২. রিয়েল-টাইম মেসেজ লিসেনার (Pusher)
  useEffect(() => {
    if (!currentUser?.id || !pusherClient) return;

    // ইউজারের নিজস্ব চ্যানেলে সাবস্ক্রাইব করা
    const channel = pusherClient.subscribe(`user-${currentUser.id}`);

    const messageHandler = (newMessage: Message) => {
      // যদি মেসেজটি বর্তমান চ্যাট উইন্ডোর ইউজারের কাছ থেকে আসে
      if (activeChat && (newMessage.senderId === activeChat.id || newMessage.senderId === currentUser.id)) {
        setMessages((prev) => [...prev, newMessage]);
        // স্ক্রল নিচে নামানো
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    };

    channel.bind("incoming-message", messageHandler);

    return () => {
      pusherClient?.unsubscribe(`user-${currentUser.id}`);
      channel.unbind("incoming-message", messageHandler);
    };
  }, [currentUser?.id, activeChat]);

  // ৩. পুরনো মেসেজ লোড করা (যখন চ্যাট ওপেন হয়)
  useEffect(() => {
    if (activeChat && currentUser?.id) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`/api/messages?userId=${activeChat.id}`);
          setMessages(res.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    }
  }, [activeChat, currentUser?.id]);

  const filteredMembers = useMemo(() => 
    members.filter((m) => m?.name?.toLowerCase().includes(searchTerm.toLowerCase())),
    [members, searchTerm]
  );

  // ৪. মেসেজ পাঠানোর ফাংশন
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !activeChat || !currentUser) return;

    const currentMsg = inputMessage;
    setInputMessage(""); // ইনপুট ক্লিয়ার

    try {
      // সার্ভারে পাঠানো (এটি Neon DB-তে সেভ করবে এবং Pusher trigger করবে)
      await axios.post("/api/messages", {
        content: currentMsg,
        receiverId: activeChat.id,
        nodeId: nodeId
      });
      
      // নোট: Pusher ইভেন্ট ফায়ার হলে উপরের useEffect মেসেজটি অটোমেটিক স্ক্রিনে যোগ করবে।
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("মেসেজ পাঠানো যায়নি!");
    }
  };

  return (
    <div className="h-[calc(100vh-110px)] sticky top-24 flex flex-col bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
      
      {/* হেডার */}
      <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Network</h3>
          <p className="text-xs text-green-500 font-medium">{members.length} members online</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><Search size={18} /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><MoreHorizontal size={18} /></button>
        </div>
      </div>

      {/* সার্চ বার */}
      <div className="px-4 py-2">
        <div className="relative">
          <input 
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-2xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-blue-200"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      {/* মেম্বার লিস্ট */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">
        <SidebarMembers
          members={filteredMembers}
          loading={loading}
          onMemberClick={(m) => {
            setActiveChat(m);
            setMessages([]); // নতুন চ্যাট ওপেন হলে আগের মেসেজ ক্লিয়ার হবে, তারপর fetch হবে
          }}
          hoveredMember={hoveredMember}
          setHoveredMember={setHoveredMember}
          isAllMembersOpen={isAllMembersOpen}
          setIsAllMembersOpen={setIsAllMembersOpen}
        />
      </div>

      {/* মেসেজিং টগল */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/30">
        <SidebarToggle 
          isMessagingOpen={isMessagingOpen}
          setIsMessagingOpen={setIsMessagingOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredMembers={filteredMembers}
          onSelectContact={setActiveChat}
        />
      </div>

      {/* চ্যাট উইন্ডো */}
      <AnimatePresence>
        {activeChat && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }} 
            className="absolute bottom-4 right-4 left-4 z-50"
          >
            <SidebarChat
              activeChat={activeChat}
              messages={messages}
              currentUserId={currentUser?.id ?? "anonymous"}
              inputMessage={inputMessage}
              handleInputChange={(e) => setInputMessage(e.target.value)}
              handleSend={handleSend}
              setActiveChat={setActiveChat}
              typingUser={null}
              scrollRef={scrollRef}
              onVideoCall={() => {
                setRoomName(`room_${activeChat.id}`);
                setVideoToken("sample_token");
              }}
              fileInputRef={fileInputRef} 
              startUpload={async (files) => console.log(files)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ভিডিও কল মডাল */}
      {videoToken && roomName && (
        <VideoCallModal
          room={roomName}
          token={videoToken}
          onDisconnect={() => { setVideoToken(null); setRoomName(null); }}
        />
      )}
    </div>
  );
}