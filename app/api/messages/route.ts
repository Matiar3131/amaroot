import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth"; // আপনার auth path অনুযায়ী নিশ্চিত করুন

export async function POST(req: Request) {
  try {
    const session = await auth(); // সেশন থেকে লগইন করা ইউজারকে নিন
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, receiverId } = body;

    if (!content || !receiverId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // পুশার ট্রিগার: এটিই রিয়েল-টাইমে মেসেজ পাঠাবে
    await pusherServer.trigger(`user-${receiverId}`, "incoming-message", {
      content,
      senderId: session.user.id, // আপনার আইডি
      timestamp: new Date().toISOString(),
    });

    // নিজের আইডিতেও ট্রিগার করুন যেন নিজের চ্যাট উইন্ডো আপডেট হয়
    await pusherServer.trigger(`user-${session.user.id}`, "incoming-message", {
      content,
      senderId: session.user.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUSHER TRIGGER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}