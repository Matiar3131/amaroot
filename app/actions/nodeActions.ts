"use server"

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * নতুন নোড (স্কুল/কলেজ/জব) তৈরি করার ফাংশন
 */
export async function createNode(data: { type: string, title: string, year?: string }) {
  try {
    const session = await auth();

    // ইউজার লগইন করা আছে কি না চেক করা
    if (!session || !session.user) {
      return { error: "দয়া করে আগে লগইন করুন।" };
    }

    // ডাটাবেজে নতুন নোড তৈরি করা
    const newNode = await prisma.node.create({
      data: {
        type: data.type.toUpperCase() as any, // Enum এর সাথে মিল রাখতে বড় হাতের অক্ষর
        title: data.title.trim(), // স্পেস ট্রিম করে সেভ করা ভালো
        year: data.year,
        userId: session.user.id,
      },
    });

    // পেজ রিভ্যালিডেট করা যাতে নতুন ডেটা সাথে সাথে দেখায়
    revalidatePath("/root");

    return { success: true, node: newNode };
  } catch (error) {
    console.error("Node creation error:", error);
    return { error: "ডেটা সেভ করতে সমস্যা হয়েছে।" };
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
/**
 * একই প্রতিষ্ঠানের অন্য মেম্বারদের খুঁজে বের করার ফাংশন
 */
export async function getNetworkConnections() {
  try {
    const session = await auth();
    if (!session || !session.user) return [];

    // ১. বর্তমান ইউজারের সব প্রতিষ্ঠানের (Node) নাম বের করা
    const userNodes = await prisma.node.findMany({
      where: { userId: session.user.id },
      select: { title: true }
    });

    if (userNodes.length === 0) return [];

    const titles = userNodes.map(n => n.title);

    // ২. ওই একই নামে অন্য যারা আছে তাদের খুঁজে বের করা
    const connections = await prisma.node.findMany({
      where: {
        title: { 
          in: titles,
          mode: 'insensitive' // ছোট-বড় হাতের অক্ষরের পার্থক্য থাকলেও ম্যাচ করবে
        },
        userId: { not: session.user.id } // নিজেকে বাদে অন্যদের খোঁজা
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
      distinct: ['userId'] // একজন ইউজার একাধিকবার আসবে না
    });

    return connections;
  } catch (error) {
    console.error("Network fetch error:", error);
    return [];
  }
}