"use server";
import {prisma} from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";


{/*export async function sendChatMessage(data: {
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
} */}

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
        // এখানে পরিবর্তন: যদি nodeId খালি স্ট্রিং হয়, তবে সেটাকে null হিসেবে পাঠান
        nodeId: data.nodeId && data.nodeId.trim() !== "" ? data.nodeId : null,
      },
      include: {
        sender: { select: { name: true, image: true } }
      }
    });

    await pusherServer.trigger(`chat-${data.receiverId}`, "incoming-message", newMessage);

    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Chat Error:", error);
    return { success: false };
  }
}

export async function getChatMessages(receiverId: string, senderId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
    return messages;
  } catch (error) {
    return [];
  }
}