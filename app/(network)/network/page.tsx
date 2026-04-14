import { auth } from "@/app/lib/auth";
import { getPosts } from "@/app/actions/postActions";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/network/PostCard";
import { Suspense } from "react";
// ১. প্রিজমা ইমপোর্ট ফিক্স (Named Import)
import { prisma } from "@/lib/prisma"; 

export const dynamic = "force-dynamic";

function PostSkeleton() {
  return (
    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-2xl" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-slate-100 rounded-full" />
          <div className="h-2 w-16 bg-slate-100 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-100 rounded-full" />
        <div className="h-3 w-4/5 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
}

async function PostFeed({ 
  userId, 
  session, 
  nodeId 
}: { 
  userId?: string; 
  session: any; 
  nodeId?: string 
}) {
  // getPosts ফাংশনে nodeId পাঠানো হচ্ছে
  const posts = await getPosts(nodeId).catch(() => []);

  return (
    <div className="space-y-4">
      {userId ? (
        <CreatePost
          userId={userId}
          userName={session?.user?.name || "ইউজার"}
          userImage={session?.user?.image}
          activeNodeId={nodeId} 
        />
      ) : (
        <div className="bg-white p-6 rounded-[32px] border border-dashed border-slate-200 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
          পোস্ট করতে লগইন করুন
        </div>
      )}

      {posts.length > 0 ? (
        posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="bg-white rounded-[32px] p-16 text-center border border-dashed border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🌱</div>
          <p className="text-slate-500 text-sm font-black uppercase tracking-tight">এখনো কোনো পোস্ট নেই</p>
          <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase">আপনার রুটের প্রথম পোস্টটি আপনিই করুন!</p>
        </div>
      )}
    </div>
  );
}

// ২. Next.js 15 অনুযায়ী searchParams কে Promise হিসেবে হ্যান্ডেল করা হয়েছে
export default async function NetworkPage(props: {
  searchParams: Promise<{ nodeId?: string }>;
}) {
  // searchParams কে await করে আনর্যাপ করা হয়েছে
  const searchParams = await props.searchParams;
  const selectedNodeId = searchParams.nodeId;

  const session = await auth();
  const userId = session?.user?.id;

  // ডাটাবেস থেকে সিলেক্টেড নোডের টাইটেল নিয়ে আসা
  const activeNode = selectedNodeId 
    ? await prisma.node.findUnique({ where: { id: selectedNodeId } }) 
    : null;

  return (
    <div className="space-y-4">
      {/* ডাইনামিক হেডার */}
      <div className={`p-6 rounded-[32px] border transition-all duration-500 ${
        activeNode 
        ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-100 text-white" 
        : "bg-white border-slate-100 shadow-sm text-slate-800"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase leading-none">
              {activeNode ? activeNode.title : "নেটওয়ার্ক ফিড"}
            </h1>
            <p className={`text-[10px] font-bold mt-2 uppercase tracking-[0.1em] opacity-80`}>
              {activeNode 
                ? `${activeNode.title} রুটের সাথে মিল আছে এমন মানুষদের আপডেট` 
                : "আপনার রুটের সাথে মিল আছে এমন মানুষদের সর্বশেষ আপডেট।"}
            </p>
          </div>
          
          {activeNode && (
            <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-sm">
              <span className="text-[10px] font-black uppercase px-2">Active Route</span>
            </div>
          )}
        </div>
      </div>

      {/* পোস্ট ফিড */}
      <Suspense fallback={<FeedSkeleton />}>
        <PostFeed 
          userId={userId} 
          session={session} 
          nodeId={selectedNodeId} 
        />
      </Suspense>
    </div>
  );
}