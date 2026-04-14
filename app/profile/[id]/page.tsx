import { prisma } from "@/lib/prisma"; // আপনার আগের কথা অনুযায়ী এই পাথটি সঠিক
import { auth } from "@/app/lib/auth"; // সাধারণত auth রুটে থাকে
import Image from "next/image";
import { notFound } from "next/navigation";

// ১. টাইপ ডিফাইন করা (প্যারামিটার এরর দূর করার জন্য)
interface RootNode {
  id: string;
  title: string;
  type: string;
  subject?: string | null;
  year?: string | null;
  userId?: string;
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const session = await auth();
  const targetUserId = params.id;

  // ২. যার প্রোফাইল দেখছি তার তথ্য এবং তার শিকড় (Nodes) নিয়ে আসা
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: {
      nodes: true, 
    },
  });

  if (!targetUser) return notFound();

  // ৩. লগইন করা ইউজারের (আপনার) শিকড় নিয়ে আসা এবং টাইপ কাস্টিং করা
  const currentUserNodes = session?.user?.id 
    ? await prisma.node.findMany({ where: { userId: session.user.id } }) as RootNode[]
    : [];

  const targetUserNodes = targetUser.nodes as RootNode[];

  // ৪. কমন রুট বের করা (প্যারামিটারে টাইপ বসানো হয়েছে)
  const commonRoots = targetUserNodes.filter((targetNode: RootNode) =>
    currentUserNodes.some(
      (myNode: RootNode) => myNode.title.toLowerCase() === targetNode.title.toLowerCase()
    )
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* প্রোফাইল হেডার */}
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 text-center mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="w-full h-full rounded-full overflow-hidden bg-blue-50 ring-4 ring-blue-50">
              {targetUser.image ? (
                <Image src={targetUser.image} alt={targetUser.name || ""} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-400 text-5xl font-black">
                  {targetUser.name?.[0] || "?"}
                </div>
              )}
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-900">{targetUser.name || "Anonymous"}</h1>
          <p className="text-gray-500 font-medium">{targetUser.email}</p>
        </div>

        {/* ৫. Common Roots Section - টাইপ এরর ফিক্সড */}
        {commonRoots.length > 0 && (
          <div className="bg-blue-600 rounded-[32px] p-8 mb-8 text-white shadow-xl shadow-blue-200 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-black flex items-center gap-2 mb-4">
              ✨ Common Roots ({commonRoots.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {commonRoots.map((root: RootNode) => (
                <div key={root.id} className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-sm font-bold">
                  🤝 You both were at <span className="underline">{root.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ৬. তার সব শিকড় (Timeline) - টাইপ এরর ফিক্সড */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 ml-2">Root Timeline</h2>
          {targetUserNodes.map((node: RootNode) => (
            <div key={node.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex justify-between items-center group hover:border-blue-200 transition-all">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{node.type}</span>
                <h3 className="text-lg font-bold text-gray-900">{node.title}</h3>
                {node.subject && <p className="text-sm text-gray-500 font-medium">📚 {node.subject}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-400">{node.year || "এখন পর্যন্ত"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}