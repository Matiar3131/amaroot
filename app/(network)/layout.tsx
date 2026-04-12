// app/(network)/network/layout.tsx
import SidebarLeft from "@/components/network/SidebarLeft";
import SidebarRight from "@/components/network/SidebarRight";
import { prisma } from "@/app/lib/prisma";
import { getUserNodes } from "@/app/actions/nodeActions";

export default async function NetworkLayout({ children }: { children: React.ReactNode }) {
  const user = await prisma.user.findFirst();
  const userNodes = user ? await getUserNodes(user.id) : [];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1440px] mx-auto pt-20 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 h-[calc(100vh-120px)]">
            <SidebarLeft userNodes={userNodes} /> 
          </aside>

          <main className="col-span-1 lg:col-span-6 min-h-screen">
            <div className="max-w-[680px] mx-auto">
              {children}
            </div>
          </main>

          <aside className="hidden xl:block xl:col-span-3 sticky top-24 h-[calc(100vh-120px)]">
            <SidebarRight />
          </aside>
        </div>
      </div>
    </div>
  );
}