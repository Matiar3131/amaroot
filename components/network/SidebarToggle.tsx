"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Member } from "@/types/sidebar";

interface SidebarToggleProps {
  isMessagingOpen: boolean;
  setIsMessagingOpen: (val: boolean) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filteredMembers: Member[];
  onSelectContact: (member: Member) => void;
}

export function SidebarToggle({
  isMessagingOpen,
  setIsMessagingOpen,
  searchTerm,
  setSearchTerm,
  filteredMembers,
  onSelectContact,
}: SidebarToggleProps) {
  return (
    <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsMessagingOpen(!isMessagingOpen)}
        className="w-full flex items-center justify-between px-5 py-4 
          hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-2xl flex items-center justify-center text-sm">
            💬
          </div>
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
              মেসেজিং
            </p>
            <p className="text-[11px] font-black text-slate-700">
              যোগাযোগ করুন
            </p>
          </div>
        </div>
        <motion.span
          animate={{ rotate: isMessagingOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="text-slate-400 font-black text-sm"
        >
          ↓
        </motion.span>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isMessagingOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-slate-50">
              {/* Search */}
              <div className="relative mt-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="সদস্য খুঁজুন..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-2xl 
                    text-xs font-semibold text-slate-700 placeholder:text-slate-300 
                    outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Contact List */}
              <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
                {filteredMembers.length === 0 ? (
                  <p className="text-center text-[9px] font-black uppercase tracking-widest 
                    text-slate-300 py-4">
                    কোনো ফলাফল নেই
                  </p>
                ) : (
                  filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        onSelectContact(member);
                        setIsMessagingOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-2xl 
                        hover:bg-blue-50 transition-colors text-left group"
                    >
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
                          flex items-center justify-center text-white text-[9px] font-black shrink-0">
                          {member.name[0].toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs font-black text-slate-700 truncate 
                        group-hover:text-blue-700 transition-colors">
                        {member.name}
                      </span>
                      <span className="ml-auto text-[9px] text-blue-400 font-black 
                        opacity-0 group-hover:opacity-100 transition-opacity">
                        চ্যাট →
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}