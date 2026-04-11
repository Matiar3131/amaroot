"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveWorkExperienceAction(metadata: any, userId: string) {
  try {
    // ১. প্রথমে অর্গানাইজেশনটি ডাটাবেজে আছে কি না চেক করা বা তৈরি করা
    // আমরা metadata.company দিয়ে সার্চ করছি
    let org = await prisma.organization.findUnique({
      where: { name: metadata.company },
    });

    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: metadata.company,
          industry: metadata.industry || "Other",
          location: metadata.location || "",
        },
      });
    }

    // ২. এবার WorkExperience টেবিলে ডাটা সেভ করা
    const experience = await prisma.workExperience.create({
      data: {
        userId: userId,
        orgId: org.id,
        designation: metadata.designation,
        fromDate: new Date(metadata.fromDate),
        toDate: metadata.isCurrent ? null : new Date(metadata.toDate),
        isCurrent: metadata.isCurrent,
      },
    });

    // ৩. ইউজারের মেইন ফিড বা নোড লিস্টে দেখানোর জন্য একটি Node তৈরি করা
    // যাতে "সংরক্ষিত তথ্য" সেকশনে এটি দেখা যায়
    const node = await prisma.node.create({
      data: {
        id: crypto.randomUUID(),
        title: `${metadata.designation} at ${metadata.company}`,
        type: "WORK_EXP",
        userId: userId,
        metadata: metadata, // পুরো ডাটা এখানেও রাখা হলো ব্যাকআপ হিসেবে
        updatedAt: new Date(),
      },
    });

    revalidatePath("/root");

    return { 
      success: true, 
      node: JSON.parse(JSON.stringify(node)) // ফ্রন্টেন্ডে পাঠানোর জন্য সিরিয়ালাইজ করা
    };
  } catch (error) {
    console.error("Work Experience Save Error:", error);
    return { success: false, error: "Failed to save work experience" };
  }
}