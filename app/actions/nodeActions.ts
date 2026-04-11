"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

// ১. নোড ক্রিয়েট ফাংশন
export async function createNode(payload: any, userId: string) {
  try {
    const newNode = await prisma.node.create({
      data: {
        // uuid লাইব্রেরি ইনস্টল না থাকলে crypto ব্যবহার করা নিরাপদ
        id: crypto.randomUUID(), 
        title: payload.title,
        type: payload.type,
        metadata: payload.metadata || {},
        isPublic: true,
        isCommon: payload.isCommon || false,
        userId: userId,
        updatedAt: new Date(),
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
        User: { // স্কিমা অনুযায়ী 'User' (বড় হাতের U)
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

// ৩. ইন্সটিটিউট সাজেশন ফাংশন (এটি মিসিং ছিল বলে এরর আসছিল)
export async function getInstituteSuggestions(query: string) {
  try {
    const suggestions = await prisma.institution.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: { 
        id: true,
        name: true, 
        type: true,
        location: true 
      },
      take: 10
    });

    return suggestions.map(s => 
      s.location ? `${s.name} (${s.location})` : s.name
    );
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

// ৪. হলের সাজেশন ফাংশন
export async function getHallsByInstitute(instituteName: string) {
  try {
    const institute = await prisma.institution.findFirst({
      where: { 
        name: {
          contains: instituteName.split(" (")[0], 
          mode: 'insensitive'
        }
      },
      include: { 
        Hall: true // স্কিমা অনুযায়ী 'Hall' (বড় হাতের H)
      }
    });

    return institute?.Hall || []; 
  } catch (error) {
    console.error("Hall fetch error:", error);
    return [];
  }
}

// ৫. সাবজেক্ট সাজেশন ফাংশন
export async function getSubjectSuggestions() {
    try {
        const subjects = await prisma.subject.findMany({
            orderBy: { name: 'asc' }
        });
        return JSON.parse(JSON.stringify(subjects));
    } catch (error) {
        console.error("Error fetching subjects:", error);
        return [];
    }
}

// ৬. ডিলিট ফাংশন
export async function deleteNode(nodeId: string) {
  try {
    await prisma.node.delete({
      where: { id: nodeId },
    });
    revalidatePath("/root"); 
    return { success: true, message: "Node deleted successfully" };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Failed to delete node" };
  }
}