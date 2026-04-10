"use server"

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * নতুন নোড (স্কুল/কলেজ/জব) তৈরি করার ফাংশন
 */
export async function createNode(data: { 
  type: string, 
  title: string, 
  year?: string, 
  subject?: string // Designation বা Subject এর জন্য
}) {
  try {
    const session = await auth();

    // ইউজার লগইন চেক
    if (!session || !session.user) {
      return { error: "দয়া করে আগে লগইন করুন।" };
    }

    // ডাটাবেজে নতুন নোড তৈরি করা
    const newNode = await prisma.node.create({
      data: {
        type: data.type.toUpperCase() as any, 
        title: data.title.trim(), 
        year: data.year,
        subject: data.subject?.trim(), // নতুন যোগ করা হয়েছে
        userId: session.user.id,
      },
    });

    revalidatePath("/root");
    return { success: true, node: newNode };

  } catch (error: any) {
    console.error("Node creation error:", error);
    
    // NID বা অন্য কোনো Unique Constraint এরর হ্যান্ডলিং (যদি এখানে দরকার হয়)
    if (error.code === 'P2002') {
      return { error: "NID, এই তথ্যটি ইতিমধ্যে ডাটাবেজে আছে।" };
    }

    return { error: "ডেটা সেভ করতে সমস্যা হয়েছে।" };
  }
}

/**
 * একই প্রতিষ্ঠানের অন্য মেম্বারদের খুঁজে বের করার ফাংশন (Internal Connectivity)
 */
export async function getNetworkConnections() {
  try {
    const session = await auth();
    if (!session || !session.user) return [];

    // ১. ইউজারের সব নোড টাইটেল বের করা
    const userNodes = await prisma.node.findMany({
      where: { userId: session.user.id },
      select: { title: true }
    });

    if (userNodes.length === 0) return [];


    const titles = userNodes.map((n: { title: string }) => n.title);

    // ২. একই টাইটেলধারী অন্য ইউজারদের খুঁজে বের করা
    const connections = await prisma.node.findMany({
      where: {
        title: { 
          in: titles,
          mode: 'insensitive' 
        },
        userId: { not: session.user.id }
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            email: true,
            userType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return connections;
  } catch (error) {
    console.error("Network fetch error:", error);
    return [];
  }
}

export async function getNodeList() {
  try {
    const list = await prisma.nodeList.findMany({
      orderBy: { label: 'asc' }
    });
    return list;
  } catch (error) {
    console.error("Error fetching node list:", error);
    return [];
  }
}