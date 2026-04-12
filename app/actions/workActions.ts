"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveWorkExperienceAction(metadata: any, userId: string) {
  try {
    // ১. WorkExperience টেবিলে ডাটা সেভ করা (আপনার নতুন স্কিমা অনুযায়ী)
    const experience = await prisma.workExperience.create({
      data: {
        userId: userId,
        companyName: metadata.company,
        sector: metadata.sector,
        department: metadata.department,
        designation: metadata.designation,
        desk: metadata.deskUnit || "",
        expertise: metadata.expertness,
        jobDetails: metadata.jobDetails,
        fromDate: new Date(metadata.dateFrom), // UI থেকে dateFrom আসছে
        toDate: metadata.isCurrent ? null : new Date(metadata.dateTo),
        isCurrent: metadata.isCurrent,
      },
    });

    // ২. একটি মূল নোড তৈরি করা (পুরো এক্সপেরিয়েন্সের সামারি হিসেবে)
    const mainNode = await prisma.node.create({
      data: {
        title: `${metadata.designation} at ${metadata.company}`,
        type: "WORK_EXP",
        userId: userId,
        metadata: metadata,
      },
    });

    revalidatePath("/root");

    return { 
      success: true, 
      node: JSON.parse(JSON.stringify(mainNode)) 
    };
  } catch (error) {
    console.error("Work Experience Save Error:", error);
    return { success: false, error: "Failed to save work experience" };
  }
}