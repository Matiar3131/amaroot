import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function IndividualDashboard() {
  const session = await auth();
  
  // প্রোটেকশন: লগইন না থাকলে বা কোম্পানি ইউজার হলে রিডাইরেক্ট
  if (!session) redirect("/login");
  if (session.user.userType === "COMPANY") redirect("/corporate/dashboard");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">স্বাগতম, {session.user.name} 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-3xl text-white shadow-xl">
          <p className="opacity-80">আপনার শিকড় (Nodes)</p>
          <h2 className="text-4xl font-bold mt-2">০৫ টি</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">প্রোফাইল ভেরিফিকেশন</p>
          <h2 className="text-2xl font-bold text-green-500 mt-2">পেন্ডিং</h2>
        </div>
      </div>
    </div>
  );
}