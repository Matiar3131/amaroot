import { auth } from "@/app/lib/auth";
import SidebarLeft from "@/components/network/SidebarLeft";
import SidebarRight from "@/components/network/SidebarRight";
import { getUserNodes } from "@/app/actions/nodeActions";
import { Suspense } from "react";

export default async function NetworkLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = session?.user?.id;
  
  // ১. ইউজারের নোডগুলো সার্ভার সাইড থেকে ফেচ করা
  const userNodes = userId ? await getUserNodes(userId).catch(() => []) : [];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1440px] mx-auto pt-4 px-4 pb-6">
        {/* মেইন গ্রিড কন্টেইনার - ১২ কলামের লেআউট */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* ১. লেফট সাইডবার (৩ কলাম) */}
          {/* LG স্ক্রিন থেকে দেখাবে, স্টিকি পজিশন এবং কাস্টম স্ক্রল হ্যান্ডলিং */}
          <aside className="hidden lg:block col-span-3 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
            <SidebarLeft 
              userNodes={userNodes} 
              userId={userId || ""} 
            />
          </aside>

          {/* ২. মেইন কন্টেন্ট (মোবাইলে ১২ কলাম, লার্জ স্ক্রিনে ৬ কলাম) */}
          <main className="col-span-12 lg:col-span-9 xl:col-span-6 min-h-screen px-0 lg:px-2">
            {children}
          </main>

          {/* ৩. রাইট সাইডবার (৩ কলাম) */}
          {/* XL স্ক্রিন থেকে দেখাবে, স্টিকি পজিশন */}
          <aside className="hidden xl:block col-span-3 sticky top-24 h-[calc(100vh-120px)]">
            <Suspense fallback={
              <div className="w-full bg-white rounded-[32px] p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-slate-100 rounded-full" />
                  <div className="h-4 w-24 bg-slate-100 rounded" />
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 w-full bg-slate-50 rounded-2xl" />
                  ))}
                </div>
              </div>
            }>
              {/* SidebarRight এখন নিজ থেকেই nodeId চিনে মেম্বার ফেচ করবে */}
              <SidebarRight currentUser={session?.user} />
            </Suspense>
          </aside>

        </div>
      </div>
    </div>
  );
}