"use server";

import { prisma } from "@/app/lib/prisma";

export async function getSkillSuggestions(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const skills = await prisma.skillMaster.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query.toLowerCase(), mode: 'insensitive' } }
        ]
      },
      take: 10, // সর্বোচ্চ ১০টি সাজেশন দেখাবে
      orderBy: {
        count: 'desc' // পপুলার স্কিলগুলো আগে দেখাবে
      }
    });
    return skills;
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}

export async function saveOrUpdateSkill(skillName: string) {
  if (!skillName || skillName.trim().length === 0) return null;

  const name = skillName.trim();
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  try {
    // ১. প্রথমে চেক করি এই স্লাগ দিয়ে অলরেডি আছে কি না
    const existing = await prisma.skillMaster.findUnique({
      where: { slug: slug }
    });

    if (existing) {
      // যদি থাকে, শুধু কাউন্ট বাড়িয়ে দিন
      return await prisma.skillMaster.update({
        where: { slug: slug },
        data: { count: { increment: 1 } }
      });
    }

    // ২. যদি না থাকে, তবেই নতুন ক্রিয়েট করার চেষ্টা করুন
    return await prisma.skillMaster.create({
      data: {
        name: name,
        slug: slug,
        count: 1,
        category: "General"
      }
    });
  } catch (error: any) {
    // যদি একই নামের অন্য কেউ প্যারালালি ঢুকে যায় (P2002 Error)
    if (error.code === 'P2002') {
      return await prisma.skillMaster.findUnique({ where: { slug: slug } });
    }
    console.error("Skill Master Sync Error:", error);
    return null; 
  }
}