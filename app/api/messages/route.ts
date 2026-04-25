import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma"; // আপনার Prisma client

// পুরনো messages আনার জন্য
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("userId");

    if (!otherUserId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    // Frontend এর Message type এর সাথে মিলানো
    const formatted = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      timestamp: msg.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/messages ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, receiverId } = body;

    if (!content?.trim() || !receiverId) {
      return NextResponse.json({ error: "Missing content or receiverId" }, { status: 400 });
    }

    // ✅ Database এ save করুন
    const newMessage = await db.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId,
      },
    });

    const messagePayload = {
      id: newMessage.id,
      content: newMessage.content,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      timestamp: newMessage.createdAt.toISOString(),
    };

    // ✅ শুধু RECEIVER কে trigger করুন (sender নিজেই optimistic update করবে)
    await pusherServer.trigger(
      `user-${receiverId}`,
      "incoming-message",
      messagePayload
    );

    // ✅ Sender কে তার নিজের message confirm করতে trigger
    // (অন্য device/tab এর জন্য)
    await pusherServer.trigger(
      `user-${session.user.id}`,
      "message-sent",  // আলাদা event নাম
      messagePayload
    );

    return NextResponse.json(messagePayload);
  } catch (error) {
    console.error("POST /api/messages ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}