"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * ১. সব পোস্ট নিয়ে আসা (ফিড ও নেটওয়ার্কের জন্য)
 * nodeId প্যারামিটার যোগ করা হয়েছে ফিল্টারিংয়ের জন্য
 */
export async function getPosts(nodeId?: string) {
  try {
    const posts = await prisma.post.findMany({
      // যদি nodeId থাকে তবে শুধু সেই নোডের পোস্ট আসবে, নাহলে সব আসবে
      where: nodeId ? {
        nodeId: nodeId
      } : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        node: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        likes: true,
        _count: {
          select: {
            likes: true,
            shares: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Prisma objects গুলোকে প্লেইন অবজেক্টে কনভার্ট করা (Next.js Server Actions এর জন্য নিরাপদ)
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

/**
 * ২. নতুন পোস্ট তৈরি করা
 */
export async function createPost(
  content: string,
  userId: string,
  nodeId?: string
) {
  if (!content || content.trim().length < 2) {
    return { success: false, error: "পোস্টের বিষয়বস্তু খুব ছোট!" };
  }

  if (!userId) {
    return { success: false, error: "ইউজার আইডি পাওয়া যায়নি।" };
  }

  try {
    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        userId: userId,
        // nodeId যদি থাকে তবে সেটি সেভ হবে, নাহলে নাল থাকবে
        nodeId: nodeId || null,
      },
    });

    revalidatePath("/feed");
    revalidatePath("/network");
    // যদি স্পেসিফিক নোড ফিল্টারে থাকে, তবে সেই পাথ রিভ্যালিডেট করা ভালো
    if (nodeId) {
      revalidatePath(`/network?nodeId=${nodeId}`);
    }

    return { success: true, post: JSON.parse(JSON.stringify(post)) };
  } catch (error) {
    console.error("Post create failed:", error);
    return { success: false, error: "পোস্ট তৈরি করতে ব্যর্থ হয়েছে।" };
  }
}

/**
 * ৩. লাইক টগল ফাংশন
 */
export async function toggleLike(postId: string, userId: string) {
  if (!postId || !userId) {
    return { success: false, error: "প্যারামিটার মিসিং।" };
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: { userId, postId },
      });
    }

    revalidatePath("/feed");
    revalidatePath("/network");

    return { success: true };
  } catch (error) {
    console.error("Like toggle failed:", error);
    return { success: false, error: "লাইক দিতে ব্যর্থ হয়েছে।" };
  }
}