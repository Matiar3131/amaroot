"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ========================================
// NodeType (Prisma schema থেকে manually define)
// ========================================
type NodeType =
  // --- শিক্ষা ও একাডেমি ---
  | "SCHOOL"
  | "COLLEGE"
  | "UNIVERSITY"
  | "DEPARTMENT"
  | "HALL"
  | "BATCH"
  | "ALUMNI"
  | "ALUMNI_ASSOC"
  // --- প্রফেশনাল ও ক্যারিয়ার ---
  | "WORK_EXP"
  | "ORG_DIV"
  | "ORG_DEPT"
  | "ORG_SEC"
  | "ORG_UNIT"
  | "ORG_LINE"
  | "ORG_DESIG"
  | "OFFICE_LOC"
  | "PROJECT"
  // --- অবস্থান ও আদিম শিকড় ---
  | "VILLAGE"
  | "AREA"
  | "DISTRICT"
  | "PR_ADDR"
  | "PM_ADDR"
  // --- পরিবার ও ঐতিহ্য ---
  | "DYNASTY"
  | "DYNASTY_LINEAGE"
  | "FAMILY_TREE"
  | "PARENTAL_ROOT"
  | "CASTE_RELIGION"
  // --- সামাজিক ও সংগঠন ---
  | "CLUB"
  | "COMMUNITY"
  | "VOLUNTEER"
  | "INTEREST"
  | "AWARD"
  | "RELIGIOUS_ORG"
  | "SPIRITUAL_LINK"
  | "POLITICAL_VIEW"
  // --- পার্সোনাল ও ডিজিটাল ---
  | "BLOOD_GROUP"
  | "PHILOSOPHY"
  | "SKILL"
  | "BIO"
  | "NOMINEE"
  | "SOCIAL_LINK"
  |  "LIVING"
   | "ORGANIZATION"
   | "EDUCATION"
   | "WORKPLACE"
   | "POLITICAL_PARTY"
  | "OTHER";

const VALID_NODE_TYPES: string[] = [
  "SCHOOL", "COLLEGE", "UNIVERSITY", "DEPARTMENT",
  "HALL", "BATCH", "ALUMNI", "ALUMNI_ASSOC",
  "WORK_EXP", "ORG_DIV", "ORG_DEPT", "ORG_SEC",
  "ORG_UNIT", "ORG_LINE", "ORG_DESIG", "OFFICE_LOC", "PROJECT",
  "VILLAGE", "AREA", "DISTRICT", "PR_ADDR", "PM_ADDR",
  "DYNASTY", "DYNASTY_LINEAGE", "FAMILY_TREE",
  "PARENTAL_ROOT", "CASTE_RELIGION",
  "CLUB", "COMMUNITY", "VOLUNTEER", "INTEREST",
  "AWARD", "RELIGIOUS_ORG", "SPIRITUAL_LINK", "POLITICAL_VIEW",
  "BLOOD_GROUP", "PHILOSOPHY", "SKILL", "BIO",
  "NOMINEE", "SOCIAL_LINK","LIVING","ORGANIZATION","EDUCATION","WORKPLACE","POLITICAL_PARTY", "OTHER",
];

/**
 * ১. নতুন নোড/রুট তৈরি করার ফাংশন
 */
export async function createNode(
  payload: { title: string; type: string; metadata?: any; isCommon?: boolean },
  userId: string
) {
  try {
    if (!userId) {
      return { success: false, error: "ইউজার আইডি পাওয়া যায়নি।" };
    }

    // ✅ "OTHER" সরাসরি string — NodeType.OTHER নয়
    let finalType: NodeType = "OTHER";
    if (VALID_NODE_TYPES.includes(payload.type)) {
      finalType = payload.type as NodeType;
    }

    // ডুপ্লিকেট চেক
    const existingNode = await prisma.node.findFirst({
      where: {
        userId: userId,
        title: {
          equals: payload.title,
          mode: "insensitive",
        },
      },
    });

    if (existingNode) {
      return { success: false, error: "এই রুটটি অলরেডি আপনার লিস্টে আছে!" };
    }

    // ডাটাবেজে নতুন নোড সেভ
    const newNode = await prisma.node.create({
      data: {
        title: payload.title,
        type: finalType,
        metadata: payload.metadata || {},
        isPublic: true,
        isCommon: payload.isCommon || false,
        userId: userId,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/network");
    revalidatePath("/root");

    return { success: true, node: JSON.parse(JSON.stringify(newNode)) };
  } catch (error) {
    console.error("Create Node Error:", error);
    return { success: false, error: "সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।" };
  }
}

/**
 * ২. সাইডবারের জন্য ইউজারের সব নোড নিয়ে আসা
 */
export async function getUserNodes(userId: string) {
  try {
    if (!userId) return [];
    const nodes = await prisma.node.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
    return JSON.parse(JSON.stringify(nodes));
  } catch (error) {
    console.error("Fetch User Nodes Error:", error);
    return [];
  }
}

/**
 * ৩. ইন্সটিটিউট সাজেশনের জন্য
 */
export async function getInstituteSuggestions(query: string) {
  if (!query || query.length < 2) return [];
  try {
    const suggestions = await prisma.institution.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        location: true,
      },
      take: 10,
    });

    return suggestions.map(
      (s: { id: string; name: string; location: string | null }) =>
        s.location ? `${s.name} (${s.location})` : s.name
    );
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

/**
 * ৪. নেটওয়ার্ক কানেকশন দেখানো
 */
export async function getNetworkConnections(
  currentUserId: string,
  take: number = 10
) {
  try {
    const connections = await prisma.node.findMany({
      where: {
        NOT: { userId: currentUserId },
        isPublic: true,
      },
      include: {
        User: {
          select: { name: true, image: true },
        },
      },
      take,
      orderBy: { createdAt: "desc" },
    });

    return JSON.parse(JSON.stringify(connections));
  } catch (error) {
    console.error("Connection Error:", error);
    return [];
  }
}

/**
 * ৫. ইন্সটিটিউট অনুযায়ী হলের লিস্ট
 */
export async function getHallsByInstitute(instituteName: string) {
  try {
    const cleanName = instituteName.split(" (")[0];
    const institute = await prisma.institution.findFirst({
      where: {
        name: {
          equals: cleanName,
          mode: "insensitive",
        },
      },
      include: {
        Hall: true,
      },
    });

    return JSON.parse(JSON.stringify(institute?.Hall || []));
  } catch (error) {
    console.error("Hall fetch error:", error);
    return [];
  }
}

/**
 * ৬. সাবজেক্ট সাজেশনের জন্য
 */
export async function getSubjectSuggestions() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: "asc" },
    });
    return JSON.parse(JSON.stringify(subjects));
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}

export async function getFeedPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { name: true, image: true } },
        node: { select: { title: true } },
        likes: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Feed Fetch Error:", error);
    return [];
  }
}

/**
 * ৭. নোড ডিলিট করার ফাংশন
 */
export async function deleteNode(nodeId: string, userId: string) {
  try {
    const node = await prisma.node.findFirst({
      where: {
        id: nodeId,
        userId: userId,
      },
    });

    if (!node) {
      return {
        success: false,
        message: "রুটটি পাওয়া যায়নি অথবা আপনি এটি ডিলিট করার অধিকারী নন।",
      };
    }

    await prisma.node.delete({
      where: { id: nodeId },
    });

    revalidatePath("/network");
    revalidatePath("/root");
    return { success: true, message: "রুটটি সফলভাবে ডিলিট করা হয়েছে।" };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "ডিলিট করতে ব্যর্থ হয়েছে।" };
  }
}