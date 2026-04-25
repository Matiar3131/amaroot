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
import { pusherClient } from "@/lib/pusher";
import axios from "axios";

export default function SidebarRight({ currentUser }: SidebarRightProps) {
  const searchParams = useSearchParams();
  const nodeId = searchParams.get("nodeId");

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
  // ✅ activeChat কে ref এ রাখুন যাতে Pusher handler stale closure না হয়
  const activeChatRef = useRef<Member | null>(null);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // ১. Member fetching
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

  // ✅ ২. Pusher listener - activeChat এর উপর dependency নেই, ref ব্যবহার করছি
  useEffect(() => {
    if (!currentUser?.id || !pusherClient) return;

    const channelName = `user-${currentUser.id}`;
    const channel = pusherClient.subscribe(channelName);

    // Receiver হিসেবে নতুন message আসলে
    const incomingHandler = (newMessage: Message) => {
      const currentActiveChat = activeChatRef.current;
      if (
        currentActiveChat &&
        (newMessage.senderId === currentActiveChat.id ||
          newMessage.receiverId === currentActiveChat.id)
      ) {
        setMessages((prev) => {
          // Duplicate check
          if (prev.some((m) => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    };

    // Sender হিসেবে নিজের message অন্য device এ sync করতে
    const sentHandler = (newMessage: Message) => {
      const currentActiveChat = activeChatRef.current;
      if (currentActiveChat && newMessage.receiverId === currentActiveChat.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      }
    };

    channel.bind("incoming-message", incomingHandler);
    channel.bind("message-sent", sentHandler);

    return () => {
      channel.unbind("incoming-message", incomingHandler);
      channel.unbind("message-sent", sentHandler);
      pusherClient?.unsubscribe(channelName);
    };
  }, [currentUser?.id]); // ✅ শুধু currentUser.id, activeChat নয়!

  // ৩. পুরনো messages load
  useEffect(() => {
    if (!activeChat || !currentUser?.id) return;
    
    setMessages([]); // আগের messages clear
    
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages?userId=${activeChat.id}`);
        setMessages(res.data);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [activeChat?.id, currentUser?.id]);

  const filteredMembers = useMemo(() =>
    members.filter((m) => m?.name?.toLowerCase().includes(searchTerm.toLowerCase())),
    [members, searchTerm]
  );

  // ✅ ৪. Message পাঠানো - Optimistic update সহ
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !activeChat || !currentUser) return;

    const currentMsg = inputMessage;
    setInputMessage("");

    // Optimistic update - সাথে সাথে UI তে দেখানো
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content: currentMsg,
       senderId: currentUser.id ?? "",  
      receiverId: activeChat.id,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempMessage]);
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    try {
      const res = await axios.post("/api/messages", {
        content: currentMsg,
        receiverId: activeChat.id,
        nodeId,
      });

      // Temp message কে real message দিয়ে replace করুন
      setMessages((prev) =>
        prev.map((m) => (m.id === tempMessage.id ? res.data : m))
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      // Failed হলে temp message সরিয়ে দিন
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      alert("মেসেজ পাঠানো যায়নি! আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="h-[calc(100vh-110px)] sticky top-24 flex flex-col bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
      
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

      <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">
        <SidebarMembers
          members={filteredMembers}
          loading={loading}
          onMemberClick={(m) => setActiveChat(m)}
          hoveredMember={hoveredMember}
          setHoveredMember={setHoveredMember}
          isAllMembersOpen={isAllMembersOpen}
          setIsAllMembersOpen={setIsAllMembersOpen}
        />
      </div>

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