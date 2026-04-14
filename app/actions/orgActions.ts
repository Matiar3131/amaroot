"use server";

import { prisma } from "@/lib/prisma";

export async function getOrgStructure(filter: { sector?: string; orgName?: string; department?: string }) {
  try {
    // ১. নির্দিষ্ট সেক্টরের কোম্পানিগুলো বের করা
    if (filter.sector && !filter.orgName) {
      const orgs = await prisma.organizationStructure.findMany({
        where: { sector: filter.sector },
        select: { orgName: true },
        distinct: ["orgName"],
        orderBy: { orgName: "asc" },
      });
      return orgs.map((o: { orgName: string }) => o.orgName);
    }

    // ২. নির্দিষ্ট কোম্পানির ডিপার্টমেন্টগুলো বের করা
    if (filter.orgName && !filter.department) {
      const depts = await prisma.organizationStructure.findMany({
        where: { orgName: filter.orgName },
        select: { department: true },
        distinct: ["department"],
        orderBy: { department: "asc" },
      });
      return depts.map((d: { department: string }) => d.department);
    }

    // ৩. নির্দিষ্ট কোম্পানি ও ডিপার্টমেন্টের আন্ডারে থাকা ইউনিক ডেস্কগুলো বের করা
    if (filter.orgName && filter.department) {
      const desks = await prisma.organizationStructure.findMany({
        where: {
          orgName: filter.orgName,
          department: filter.department,
          desk: { not: null, notIn: [""] },
        },
        select: { desk: true },
        distinct: ["desk"],
        orderBy: { desk: "asc" },
      });
      // null ভ্যালু ফিল্টার আউট করে স্ট্রিং অ্যারে রিটার্ন করা
      return desks
        .map((d: { desk: string | null }) => d.desk)
        .filter((d: string | null): d is string => !!d);
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    return [];
  }
  return [];
}

// ৪. পদবী (Designation) বের করার অ্যাকশন
export async function getDesignations(sector: string, orgName: string) {
  try {
    const data = await prisma.sectorOrgWiseDesignation.findMany({
      where: {
        sector,
        OR: [{ orgName: orgName }, { orgName: "Global" }],
      },
      select: { designation: true },
      orderBy: { designation: "asc" },
    });
    return data.map((d: { designation: string }) => d.designation);
  } catch (error) {
    console.error("Designation fetch failed:", error);
    return [];
  }
}