"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Member } from "@/types/sidebar";

interface SidebarMembersProps {
  members: Member[];
  loading: boolean;
  hoveredMember: string | null;
  setHoveredMember: (id: string | null) => void;
  onMemberClick: (member: Member) => void;
  isAllMembersOpen: boolean;
  setIsAllMembersOpen: (val: boolean) => void;
}

function Avatar({ member, size = "sm" }: { member: Member; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return member.image ? (
    <img
      src={member.image}
      alt={member.name}
      className={`${sz} rounded-full object-cover ring-2 ring-white`}
    />
  ) : (
    <div
      className={`${sz} rounded-full bg-gradient-to-br from-blue-500 to-blue-700 
        flex items-center justify-center text-white font-black ring-2 ring-white`}
    >
      {member.name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

function StatusDot({ status }: { status?: Member["status"] }) {
  const color =
    status === "online" ? "bg-green-400" :
    status === "busy"   ? "bg-yellow-400" :
                          "bg-slate-300";
  return (
    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${color} 
      rounded-full ring-2 ring-white`} 
    />
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2.5 bg-slate-100 rounded-full w-3/4" />
        <div className="h-2 bg-slate-50 rounded-full w-1/2" />
      </div>
    </div>
  );
}

export function SidebarMembers({
  members,
  loading,
  hoveredMember,
  setHoveredMember,
  onMemberClick,
  isAllMembersOpen,
  setIsAllMembersOpen,
}: SidebarMembersProps) {
  const visibleMembers = isAllMembersOpen ? members : members.slice(0, 5);

  return (
    <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
            রুটের সদস্য
          </p>
          {!loading && (
            <p className="text-[11px] font-black text-slate-700 mt-0.5">
              {members.length} জন সক্রিয়
            </p>
          )}
        </div>
        {members.length > 0 && !loading && (
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((m) => (
              <div key={m.id} className="relative">
                <Avatar member={m} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-slate-50" />

      {/* Body */}
      <div className="px-5 py-3 space-y-2.5">
        {loading ? (
          <div className="space-y-3 py-1 animate-pulse">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-lg">
              🌿
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
              কোনো সদস্য নেই
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {visibleMembers.map((member, i) => (
              <motion.button
                key={member.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onMemberClick(member)}
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
                className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all duration-150 text-left
                  ${hoveredMember === member.id 
                    ? "bg-blue-50 shadow-sm" 
                    : "hover:bg-slate-50"}`}
              >
                <div className="relative shrink-0">
                  <Avatar member={member} size="sm" />
                  <StatusDot status={member.status} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-800 truncate leading-tight">
                    {member.name}
                  </p>
                  {member.role && (
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                      {member.role}
                    </p>
                  )}
                </div>
                <motion.div
                  animate={{ opacity: hoveredMember === member.id ? 1 : 0, x: hoveredMember === member.id ? 0 : 4 }}
                  className="text-blue-500 text-[10px] font-black"
                >
                  →
                </motion.div>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Show more/less */}
      {members.length > 5 && !loading && (
        <button
          onClick={() => setIsAllMembersOpen(!isAllMembersOpen)}
          className="w-full px-5 py-3 text-[9px] font-black uppercase tracking-widest 
            text-blue-500 hover:text-blue-700 border-t border-slate-50 
            transition-colors hover:bg-blue-50/50"
        >
          {isAllMembersOpen ? "কম দেখুন ↑" : `আরো ${members.length - 5} জন দেখুন ↓`}
        </button>
      )}
    </div>
  );
}