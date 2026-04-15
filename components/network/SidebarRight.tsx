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
  
  // মিসিং স্টেটগুলো এখানে যোগ করা হলো (এরর ১ ফিক্স করতে)
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [isAllMembersOpen, setIsAllMembersOpen] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // এরর ২ ফিক্স করতে

  // মেম্বার ফেচিং
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
        if (isMounted) setLoading(true);
      }
    }
    loadMembers();
    return () => { isMounted = false; };
  }, [nodeId, currentUser?.id]);

  // ফিল্টারিং
  const filteredMembers = useMemo(() => 
    members.filter((m) => m?.name?.toLowerCase().includes(searchTerm.toLowerCase())),
    [members, searchTerm]
  );

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;
    const newMessage: Message = {
      senderId: currentUser?.id ?? "anonymous",
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
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
            className="w-full bg-gray-100 border-none rounded-2xl py-2 pl-10 pr-4 text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      {/* ৩. মেম্বার লিস্ট (FIXED PROPS) */}
      <div className="flex-1 overflow-y-auto px-2">
        <SidebarMembers
          members={filteredMembers}
          loading={loading}
          onMemberClick={(m) => {
            setActiveChat(m);
            setMessages([]);
          }}
          hoveredMember={hoveredMember} // যোগ করা হয়েছে
          setHoveredMember={setHoveredMember} // যোগ করা হয়েছে
          isAllMembersOpen={isAllMembersOpen} // যোগ করা হয়েছে
          setIsAllMembersOpen={setIsAllMembersOpen} // যোগ করা হয়েছে
        />
      </div>

      {/* ৪. মেসেজিং টগল */}
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

      {/* ৫. চ্যাট উইন্ডো (FIXED PROPS) */}
      <AnimatePresence>
        {activeChat && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="absolute bottom-4 right-4 left-4 z-50">
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
              // মিসিং প্রপসগুলো নিচে যোগ করা হলো
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