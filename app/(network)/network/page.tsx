import { auth } from "@/app/lib/auth";
import { getPosts } from "@/app/actions/postActions";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/network/PostCard";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function PostSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-100 rounded-full" />
        <div className="space-y-1.5">
          <div className="h-2.5 w-28 bg-slate-100 rounded-full" />
          <div className="h-2 w-16 bg-slate-100 rounded-full" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-2.5 w-full bg-slate-100 rounded-full" />
        <div className="h-2.5 w-4/5 bg-slate-100 rounded-full" />
        <div className="h-2.5 w-3/5 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-3">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
}

async function PostFeed({ userId, session }: { userId?: string; session: any }) {
  const posts = await getPosts().catch(() => []);

  return (
    <div className="space-y-3">
      {userId ? (
        <CreatePost
          userId={userId}
          userName={session?.user?.name || "ইউজার"}
          userImage={session?.user?.image}
        />
      ) : (
        <div className="bg-white p-4 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-xs font-bold uppercase">
          পোস্ট করতে লগইন করুন
        </div>
      )}

      {posts.length > 0 ? (
        posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-100">
          <p className="text-3xl mb-2">🌱</p>
          <p className="text-slate-400 text-sm font-bold">এখনো কোনো পোস্ট নেই</p>
          <p className="text-slate-300 text-xs mt-1">প্রথম পোস্টটি আপনিই করুন!</p>
        </div>
      )}
    </div>
  );
}

export default async function NetworkPage() {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div className="space-y-3">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-lg font-black text-slate-800 tracking-tight uppercase">
          নেটওয়ার্ক ফিড
        </h1>
        <p className="text-slate-400 text-xs font-medium mt-0.5">
          আপনার রুটের সাথে মিল আছে এমন মানুষদের সর্বশেষ আপডেট।
        </p>
      </div>

      <Suspense fallback={<FeedSkeleton />}>
        <PostFeed userId={userId} session={session} />
      </Suspense>
    </div>
  );
}