"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

// NodeType enum — schema.prisma থেকে exact values নেওয়া হয়েছে
const VALID_NODE_TYPES = [
  "PR_ADDR", "PM_ADDR", "SCHOOL", "COLLEGE", "UNIVERSITY",
  "WORK_EXP", "SKILL", "BIO", "ORG_DIV", "ORG_DEPT",
  "ORG_SEC", "ORG_UNIT", "ORG_LINE", "ORG_DESIG",
  "OFFICE_LOC", "NOMINEE", "OTHER",
] as const;
type NodeType = (typeof VALID_NODE_TYPES)[number];

// ১. নোড ক্রিয়েট ফাংশন
export async function createNode(
  payload: { title: string; type: string; metadata?: any; isCommon?: boolean },
  userId: string
) {
  try {
    // NodeType validate করা হচ্ছে schema-র enum দিয়ে
    if (!VALID_NODE_TYPES.includes(payload.type as NodeType)) {
      return { success: false, error: "Invalid node type provided." };
    }

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
      return { success: false, error: "এই নামে অলরেডি একটি রুট আছে!" };
    }

    const newNode = await prisma.node.create({
      data: {
        title: payload.title,
        type: payload.type as NodeType,
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

// সাইডবারের জন্য ইউজারের নোড নিয়ে আসা
export async function getUserNodes(userId: string) {
  try {
    const nodes = await prisma.node.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
    return JSON.parse(JSON.stringify(nodes));
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

// ২. নেটওয়ার্ক কানেকশন ফাংশন
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

// ৩. ইন্সটিটিউট সাজেশন ফাংশন
export async function getInstituteSuggestions(query: string) {
  if (!query) return [];
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

// ৪. হলের সাজেশন ফাংশন
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

// ৫. সাবজেক্ট সাজেশন ফাংশন
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

// ৬. ডিলিট ফাংশন — userId দিয়ে ownership চেক করা হয়েছে
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
        message: "Node not found or you are not authorized to delete it.",
      };
    }

    await prisma.node.delete({
      where: { id: nodeId },
    });

    revalidatePath("/network");
    revalidatePath("/root");
    return { success: true, message: "Node deleted successfully" };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Failed to delete node" };
  }
}