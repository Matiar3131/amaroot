import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getNetworkConnections } from "@/app/actions/nodeActions";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default async function IndividualDashboard() {
  const session = await auth();

  // ১. সেশন চেক
  if (!session || !session.user) redirect("/login");

  // ২. ইউজার টাইপ চেক
  const userType = (session.user as any).userType;
  if (userType === "COMPANY") redirect("/corporate/dashboard");

  const currentUserId = (session.user as any).id as string;

  // ৩. চেক করা - ইউজারের কোনো Node আছে কি না?
  // যদি ইউজার একদম নতুন হয় এবং কোনো এন্ট্রি না থাকে, তাকে /root পেইজে পাঠিয়ে দিন
  const userNodeCount = await prisma.node.count({
    where: { userId: currentUserId },
  });

  if (userNodeCount === 0) {
    // এখানে চাইলে আপনি redirect("/root") করতে পারেন 
    // অথবা ড্যাশবোর্ডেই একটি "Welcome/Setup" মোড দেখাতে পারেন।
    // আপাতত রিডাইরেক্ট করাটাই বেস্ট প্র্যাকটিস।
    redirect("/root"); 
  }

  // ৪. ডাটাবেজ থেকে ডাটা আনা (যদি Node থাকে তবেই এখানে আসবে)
  let connections: any[] = [];
  try {
    connections = await getNetworkConnections(currentUserId);
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            স্বাগতম, {session.user.name} 👋
          </h1>
          <p className="text-gray-500">
            আপনার প্রফেশনাল শিকড় এবং নেটওয়ার্কের বর্তমান অবস্থা।
          </p>
        </div>
        <Link
          href="/root"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition-all flex items-center gap-2 w-fit"
        >
          শিকড় আপডেট করুন <ArrowRight size={18} />
        </Link>
      </div>

      {/* Stats, Network, and Ecosystem Content (অপরিবর্তিত) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="opacity-80 text-sm font-medium">মোট কানেকশন (Nodes)</p>
            <h2 className="text-5xl font-bold mt-2">{userNodeCount}</h2>
            <p className="mt-4 text-xs bg-white/20 w-fit px-2 py-1 rounded-lg">আপনার প্রোফাইল ভ্যালু বাড়ছে</p>
          </div>
          <Briefcase className="absolute -right-4 -bottom-4 text-white/10" size={120} />
        </div>

        {/* ... বাকি কার্ডগুলো এখানে বসবে ... */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">ভেরিফিকেশন স্ট্যাটাস</p>
                <div className="flex items-center gap-2 mt-2">
                    <h2 className="text-2xl font-bold text-orange-500">পেন্ডিং</h2>
                    <ShieldCheck className="text-gray-300" />
                </div>
            </div>
            <button className="text-blue-600 text-sm font-semibold hover:underline mt-4 text-left">
                ভেরিফিকেশনের জন্য আবেদন করুন <ArrowRight size={14} className="inline" />
            </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">এলাকা/কমিউনিটি</p>
                <div className="flex items-center gap-2 mt-2">
                    <MapPin className="text-red-500" size={20} />
                    <h2 className="text-xl font-bold text-gray-800">ঢাকা, বাংলাদেশ</h2>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">লোকেশন ভিত্তিক ইউজার আশেপাশে আছে।</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Network section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">আপনার নেটওয়ার্কের মানুষ</h3>
            {connections && connections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connections.map((conn: any) => (
                  <div key={conn.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                      {conn.User?.name ? conn.User.name[0] : "U"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{conn.User?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{conn.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-10">কোনো কানেকশন পাওয়া যায়নি।</p>
            )}
          </div>
        </div>

        {/* Ecosystem Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-3xl text-white shadow-xl">
            <h3 className="text-lg font-bold mb-4">আমাদের ইকোসিস্টেম</h3>
            <div className="space-y-4">
              <Link href="https://pouchhai.vercel.app/" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 p-2 rounded-lg">📦</div>
                  <p className="text-sm font-bold">Pouchhai</p>
                </div>
                <ArrowRight size={14} />
              </Link>
              <Link href="https://eukil.vercel.app/" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500 p-2 rounded-lg">⚖️</div>
                  <p className="text-sm font-bold">eUkil</p>
                </div>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}