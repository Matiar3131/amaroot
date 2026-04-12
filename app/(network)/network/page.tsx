// app/(network)/network/page.tsx
export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">আমার ফিড</h1>
        <p className="text-gray-500 mt-2">আপনার নেটওয়ার্কের সর্বশেষ আপডেটগুলো এখানে দেখুন।</p>
      </div>
      
      {/* এখানে আপনার পোস্ট ফিড বা মেইন কন্টেন্ট রেন্ডার হবে */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-400">
        পোস্ট ফিড শীঘ্রই আসছে...
      </div>
    </div>
  );
}