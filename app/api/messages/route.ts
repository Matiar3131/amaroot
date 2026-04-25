import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth"; // আপনার প্রোজেক্টের সঠিক পাথ নিশ্চিত করুন

export async function POST(req: Request) {
  try {
    // ১. সেশন থেকে লগইন করা ইউজারকে নিন
    const session = await auth(); 
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ২. রিকোয়েস্ট বডি থেকে ডাটা নিন
    const body = await req.json();
    const { content, receiverId } = body;

    // ৩. ভ্যালিডেশন চেক
    if (!content || !receiverId) {
      return NextResponse.json({ error: "Missing content or receiverId" }, { status: 400 });
    }

    // ৪. পুশার ট্রিগার (রিসিভারের জন্য)
    // এটি অন্য ইউজারের স্ক্রিনে রিয়েল-টাইমে মেসেজ পাঠাবে
    await pusherServer.trigger(`user-${receiverId}`, "incoming-message", {
      content,
      senderId: session.user.id,
      timestamp: new Date().toISOString(),
    });

    // ৫. পুশার ট্রিগার (নিজের জন্য)
    // এটি আপনার নিজের অন্য কোনো ট্যাব বা ডিভাইসে চ্যাট উইন্ডো আপডেট করবে
    await pusherServer.trigger(`user-${session.user.id}`, "incoming-message", {
      content,
      senderId: session.user.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Message sent via Pusher" });
  } catch (error) {
    console.error("PUSHER TRIGGER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}