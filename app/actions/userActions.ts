"use server";

import { prisma } from "@/lib/prisma";

/**
 * নির্দিষ্ট রুটের মেম্বারদের ডাটাবেস থেকে নিয়ে আসা
 */

export async function getRouteMembers(nodeId?: string) {
  try {
    // ১. nodeId চেক এবং সঠিক কুয়েরি গঠন
    // যদি nodeId না থাকে তবে রেন্ডম বা রিসেন্ট ৬ জন ইউজার দেখাবে
    const users = await prisma.user.findMany({
      where: nodeId 
        ? {
            posts: {
              some: {
                nodeId: nodeId,
              },
            },
          }
        : {}, // nodeId না থাকলে সব ইউজারের মধ্য থেকে ফিল্টার হবে
      select: {
        id: true,
        name: true,
        image: true,
        // এখানে আপনি চাইলে ইউজারের টাইটেল বা রোল যোগ করতে পারেন
      },
      take: 6,
      // ২. পারফরম্যান্স টিপ: যদি ডাটাবেস লেভেলে ইউনিক ইউজার দরকার হয়
      // findMany এ distinct এর সাথে select এ id থাকলেই হয়।
      distinct: ['id'], 
      orderBy: {
        posts: {
          _count: 'desc' // যারা বেশি পোস্ট করেছে তাদের আগে দেখানোর জন্য (ঐচ্ছিক)
        }
      }
    });

    // ৩. JSON.stringify করার প্রয়োজন নেই যদি না আপনার অবজেক্টে 
    // Date বা Decimal টাইপ থাকে। Prisma plain object রিটার্ন করে।
    return users; 
    
  } catch (error) {
    // ৪. এরর লগিং
    console.error("Error fetching route members:", error);
    return []; // এরর হলে খালি অ্যারে রিটার্ন করা সেফ
  }
}