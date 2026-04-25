import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
// আপনার database instance ইমপোর্ট করুন (Prisma ব্যবহার করলে এমন হবে)
// import { db } from "@/lib/db"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, receiverId, nodeId } = body;

    // ১. এখানে আপনার ডাটাবেসে মেসেজটি সেভ করার লজিক দিন
    // const newMessage = await db.message.create({
    //   data: {
    //     content,
    //     receiverId,
    //     senderId: "current_user_id", // সেশন থেকে ইউজার আইডি নিতে হবে
    //   }
    // });

    // ২. পুশার ট্রিগার করা (এটিই রিয়েল-টাইমে অন্য ইউজারকে মেসেজ পাঠাবে)
    await pusherServer.trigger(`user-${receiverId}`, "incoming-message", {
      content,
      senderId: "sender_id_here", // সেশন থেকে প্রাপ্ত আইডি
      timestamp: new Date().toISOString(),
    });

    // ৩. নিজের স্ক্রিনেও আপডেট পাওয়ার জন্য নিজের আইডিতেও ট্রিগার করতে পারেন
    // await pusherServer.trigger(`user-sender_id`, "incoming-message", { ... });

    return NextResponse.json({ success: true, message: "Sent successfully" });
  } catch (error) {
    console.error("PUSHER TRIGGER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// পুরনো মেসেজ ফেচ করার জন্য GET মেথড
export async function GET(req: Request) {
    // এখানে ডাটাবেস থেকে মেসেজ তুলে আনার লজিক থাকবে
    return NextResponse.json([]); 
}