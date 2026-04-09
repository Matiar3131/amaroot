import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function CorporateDashboard() {
  const session = await auth();

  if (!session || session.user.userType !== "COMPANY") {
    redirect("/dashboard"); // কোম্পানি না হলে নরমাল ড্যাশবোর্ডে পাঠাও
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-gray-900">Corporate Panel 🏢</h1>
        <button className="bg-black text-white px-6 py-2 rounded-xl font-bold">Post a Job</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['টোটাল অ্যাপ্লিকেন্ট', 'ভেরিফাইড ইউজার', 'অ্যাক্টিভ জব', 'সেভড সিভি'].map((item) => (
          <div key={item} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-500">{item}</p>
            <h3 className="text-2xl font-bold mt-1">০</h3>
          </div>
        ))}
      </div>
    </div>
  );
}