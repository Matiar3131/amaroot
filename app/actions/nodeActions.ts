"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

// ১. নোড ক্রিয়েট ফাংশন
export async function createNode(payload: any, userId: string) {
  try {
    const newNode = await prisma.node.create({
      data: {
        title: payload.title,
        type: payload.type,
        metadata: payload.metadata || {},
        isPublic: true,
        isCommon: payload.isCommon || false,
        userId: userId,
      },
    });
    revalidatePath("/root");
    return { success: true, node: JSON.parse(JSON.stringify(newNode)) };
  } catch (error) {
    console.error("Create Node Error:", error);
    return { success: false, error: "Failed to save" };
  }
}

// ২. নেটওয়ার্ক কানেকশন ফাংশন
export async function getNetworkConnections(currentUserId: string) {
  try {
    const connections = await prisma.node.findMany({
      where: {
        NOT: { userId: currentUserId },
        isPublic: true,
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    return JSON.parse(JSON.stringify(connections));
  } catch (error) {
    console.error("Connection Error:", error);
    return [];
  }
}

// নোড ডিলিট করার ফাংশন
export async function deleteNode(nodeId: string) {
    try {
        await prisma.node.delete({
            where: {
                id: nodeId,
            },
        });

        // ডিলিট করার পর পেজটি রিভ্যালিডেট করুন যাতে ডাটা আপডেট হয়
        revalidatePath("/root"); 
        
        return { success: true, message: "Node deleted successfully" };
    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false, message: "Failed to delete node" };
    }
}