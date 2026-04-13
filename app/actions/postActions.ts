"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * ১. সব পোস্ট নিয়ে আসা (ফিড ও নেটওয়ার্কের জন্য)
 */
export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
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
        nodeId: nodeId || null,
      },
    });

    revalidatePath("/feed");
    revalidatePath("/network");

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