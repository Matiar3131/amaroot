import { auth } from "@/app/lib/auth";
import SidebarLeft from "@/components/network/SidebarLeft";
import SidebarRight from "@/components/network/SidebarRight";
import { getUserNodes } from "@/app/actions/nodeActions";

export default async function NetworkLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = session?.user?.id;
  const userNodes = userId ? await getUserNodes(userId).catch(() => []) : [];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1440px] mx-auto pt-4 px-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <aside className="hidden lg:block lg:col-span-3 sticky top-20 h-fit">
            <SidebarLeft userNodes={userNodes} userId={userId || ""} />
          </aside>
          <main className="col-span-1 lg:col-span-6">
            {children}
          </main>
          <aside className="hidden xl:block xl:col-span-3 sticky top-20 h-fit">
            <SidebarRight />
          </aside>
        </div>
      </div>
    </div>
  );
}