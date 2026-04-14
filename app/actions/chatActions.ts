"use server";
import {prisma} from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function sendChatMessage(data: {
  senderId: string;
  receiverId: string;
  content: string;
  nodeId?: string;
}) {
  try {
    const newMessage = await prisma.message.create({
      data: {
        content: data.content,
        senderId: data.senderId,
        receiverId: data.receiverId,
        nodeId: data.nodeId,
      },
      include: {
        sender: { select: { name: true, image: true } }
      }
    });

    // রিয়েল-টাইম ট্রিগার
    await pusherServer.trigger(`chat-${data.receiverId}`, "incoming-message", newMessage);

    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Chat Error:", error);
    return { success: false };
  }
}