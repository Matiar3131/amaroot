"use server";

import { prisma } from "@/lib/prisma";

/**
 * নির্দিষ্ট রুটের মেম্বারদের ডাটাবেস থেকে নিয়ে আসা (বর্তমান ইউজার বাদে)
 */
export async function getRouteMembers(nodeId?: string, currentUserId?: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          // ১. যদি currentUserId থাকে, তবে তাকে লিস্ট থেকে বাদ দাও
          currentUserId ? { id: { not: currentUserId } } : {},
          
          // ২. যদি nodeId থাকে, তবে সেই নোডের মেম্বারদের ফিল্টার করো
          nodeId 
            ? {
                nodes: { 
                  some: {
                    id: nodeId,
                  },
                },
              }
            : {},
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      take: 6,
      distinct: ['id'],
    });

    return users; 
    
  } catch (error) {
    console.error("Error fetching route members:", error);
    return [];
  }
}