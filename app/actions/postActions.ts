"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * ১. সব পোস্ট নিয়ে আসা (ফিডের জন্য)
 * এখানে user, node এবং likes এর তথ্যসহ কমেন্ট কাউন্ট অন্তর্ভুক্ত করা হয়েছে।
 */
export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true, // ইউজারের নাম ও ছবি দেখানোর জন্য
        node: true, // কোন নোড থেকে পোস্ট করা হয়েছে তা দেখানোর জন্য (জরুরি)
        likes: true, // লাইক চেক করার জন্য
        _count: {
          select: { 
            likes: true, 
            shares: true, 
            comments: true // কমেন্ট সংখ্যা দেখানোর জন্য
          }
        }
      },
      orderBy: { 
        createdAt: 'desc' // লেটেস্ট পোস্ট আগে দেখাবে
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

/**
 * ২. নতুন পোস্ট তৈরি করা
 */
export async function createPost(content: string, userId: string, nodeId?: string) {
  if (!content || content.trim().length < 2) {
    throw new Error("পোস্টের বিষয়বস্তু খুব ছোট!");
  }

  try {
    const post = await prisma.post.create({
      data: {
        content,
        userId,
        nodeId: nodeId || null, // যদি নোড আইডি না থাকে তবে নাল হিসেবে সেভ হবে
      },
    });

    // পেজ রিফ্রেশ না করেই নতুন পোস্ট ডাটা রিvalidate করবে
    revalidatePath("/network"); 
    return post;
  } catch (error) {
    console.error("Post create failed:", error);
    throw new Error("পোস্ট তৈরি করতে ব্যর্থ হয়েছে।");
  }
}