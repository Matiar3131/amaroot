import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getNetworkConnections } from "@/app/actions/nodeActions";
import Link from "next/link";
import { User, MapPin, Briefcase, GraduationCap, ArrowRight, ShieldCheck } from "lucide-react";

export default async function IndividualDashboard() {
  const session = await auth();
  
  if (!session) redirect("/login");
  if (session.user.userType === "COMPANY") redirect("/corporate/dashboard");

  // ডাটাবেজ থেকে ইউজারের নোড সংখ্যা এবং কানেকশন আনা
  const nodeCount = await prisma.node.count({ where: { userId: session.user.id } });
  const connections = await getNetworkConnections();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">স্বাগতম, {session.user.name} 👋</h1>
          <p className="text-gray-500">আপনার প্রফেশনাল শিকড় এবং নেটওয়ার্কের বর্তমান অবস্থা।</p>
        </div>
        <Link href="/root" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition-all flex items-center gap-2 w-fit">
          শিকড় আপডেট করুন <ArrowRight size={18} />
        </Link>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="opacity-80 text-sm font-medium">মোট কানেকশন (Nodes)</p>
            <h2 className="text-5xl font-bold mt-2">{nodeCount}</h2>
            <p className="mt-4 text-xs bg-white/20 w-fit px-2 py-1 rounded-lg">আপনার প্রোফাইল ভ্যালু বাড়ছে</p>
          </div>
          <Briefcase className="absolute -right-4 -bottom-4 text-white/10" size={120} />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">ভেরিফিকেশন স্ট্যাটাস</p>
            <div className="flex items-center gap-2 mt-2">
              <h2 className="text-2xl font-bold text-orange-500">পেন্ডিং</h2>
              <ShieldCheck className="text-gray-300" />
            </div>
          </div>
          <button className="text-blue-600 text-sm font-semibold hover:underline mt-4 text-left">ভেরিফিকেশনের জন্য আবেদন করুন →</button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">এলাকা/কমিউনিটি</p>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="text-red-500" size={20} />
              <h2 className="text-xl font-bold text-gray-800">ঢাকা, বাংলাদেশ</h2>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">আপনার লোকেশন ভিত্তিক ২০ জন ইউজার আশেপাশে আছে।</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Network/Connections */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">আপনার নেটওয়ার্কের মানুষ</h3>
              <Link href="/network" className="text-blue-600 text-sm font-medium">সব দেখুন</Link>
            </div>
            
            {connections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connections.slice(0, 4).map((conn: any) => (
                  <div key={conn.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {conn.user.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{conn.user.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <GraduationCap size={12} /> {conn.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400">আপনার রুট অনুযায়ী কোনো কানেকশন পাওয়া যায়নি।</p>
                <p className="text-sm text-blue-500 underline mt-2">আরও প্রতিষ্ঠান যোগ করুন</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ecosystem Services */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-3xl text-white shadow-xl">
            <h3 className="text-lg font-bold mb-4">আমাদের ইকোসিস্টেম</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 p-2 rounded-lg">📦</div>
                  <div>
                    <p className="text-sm font-bold">Pouchhai</p>
                    <p className="text-[10px] opacity-60">লজিস্টিক ও মুভিং সার্ভিস</p>
                  </div>
                </div>
                <ArrowRight size={14} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500 p-2 rounded-lg">⚖️</div>
                  <div>
                    <p className="text-sm font-bold">eUkil</p>
                    <p className="text-[10px] opacity-60">লিগ্যাল সাপোর্ট ও রিসার্চ</p>
                  </div>
                </div>
                <ArrowRight size={14} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500 p-2 rounded-lg">🔒</div>
                  <div>
                    <p className="text-sm font-bold">Amanat</p>
                    <p className="text-[10px] opacity-60">নিরাপদ লেনদেন (Escrow)</p>
                  </div>
                </div>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <h4 className="font-bold text-blue-900 text-sm">প্রো-টিপস 💡</h4>
            <p className="text-blue-700 text-xs mt-2 leading-relaxed">
              আপনার স্কুল এবং বর্তমান কর্মস্থল সঠিক ভাবে যোগ করলে ৫০% বেশি কানেকশন খুঁজে পাওয়ার সম্ভাবনা থাকে।
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}