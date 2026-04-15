export interface Member {
  id: string;
  name: string;
  image?: string | null;
  role?: string;
  status?: "online" | "offline" | "busy";
}

export interface Message {
  id?: string;
  senderId: string;
  content: string;
  timestamp: Date;
  fileUrl?: string;
}

export interface SidebarRightProps {
  activeNodeMembers?: Member[];
  currentUser?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}