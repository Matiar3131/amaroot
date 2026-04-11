"use server";

import { prisma } from "@/app/lib/prisma";

/**
 * ইউজার যখন প্রতিষ্ঠানের নাম টাইপ করবে তখন সাজেশনের জন্য
 */
export async function searchOrganizations(query: string) {
  if (!query || query.length < 2) return [];

  try {
    return await prisma.organization.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 5,
      select: { id: true, name: true, industry: true }
    });
  } catch (error) {
    console.error("Search Org Error:", error);
    return [];
  }
}

/**
 * সেক্টর অনুযায়ী কোম্পানি এবং কোম্পানি অনুযায়ী ডিপার্টমেন্ট পপুলেট করার জন্য
 */
export async function getOrgStructure(filter: { sector?: string, orgName?: string }) {
  try {
    // ১. শুধু সেক্টর দেওয়া থাকলে ওই সেক্টরের ইউনিক প্রতিষ্ঠানের নাম পাঠাবে
    if (filter.sector && !filter.orgName) {
      const orgs = await prisma.organizationStructure.findMany({
        where: { sector: filter.sector },
        distinct: ['orgName'],
        select: { orgName: true }
      });
      return orgs.map(o => o.orgName);
    }

    // ২. প্রতিষ্ঠানের নাম দেওয়া থাকলে ওই প্রতিষ্ঠানের সব ডিপার্টমেন্ট পাঠাবে
    if (filter.orgName) {
      const depts = await prisma.organizationStructure.findMany({
        where: { orgName: filter.orgName },
        select: { department: true }
      });
      return depts.map(d => d.department);
    }
  } catch (error) {
    console.error("Get Org Structure Error:", error);
    return [];
  }
  
  return [];
}