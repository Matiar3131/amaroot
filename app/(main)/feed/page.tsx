import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/network/PostCard"; // আগের ডিজাইনের কার্ডটি এখানে ইম্পোর্ট করুন
import { getPosts } from "@/app/actions/postActions";
import { auth } from "@/app/lib/auth"; // আপনার অথেনটিকেশন অনুযায়ী

export default async function FeedPage() {
  const session = await auth();
  const posts = await getPosts();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* ১. পোস্ট তৈরি করার ইনপুট */}
     // এভাবে করুন:
<CreatePost 
  userId={session?.user?.id || ""}       // ✅
  userName={session?.user?.name || "ইউজার"}  // ✅
  userImage={session?.user?.image}
/>

      {/* ২. হেডার */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">আমার ফিড</h2>
        <p className="text-slate-400 text-sm font-medium">আপনার নেটওয়ার্কের আপডেটগুলো এখানে দেখা যাবে।</p>
      </div>

      {/* ৩. পোস্টের লিস্ট */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="border-2 border-dashed border-slate-100 rounded-[40px] p-20 flex flex-col items-center gap-4">
            <p className="text-slate-300 font-bold italic">এখনো কোনো পোস্ট নেই...</p>
          </div>
        )}
      </div>
    </div>
  );
}