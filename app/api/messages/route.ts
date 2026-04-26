import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

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

    const newMessage = await prisma.message.create({
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

    await pusherServer.trigger(
      `user-${receiverId}`,
      "incoming-message",
      messagePayload
    );

    await pusherServer.trigger(
      `user-${session.user.id}`,
      "message-sent",
      messagePayload
    );

    return NextResponse.json(messagePayload);
  } catch (error) {
    console.error("POST /api/messages ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}