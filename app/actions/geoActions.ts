"use server";
import { prisma } from "@/lib/prisma";

export async function getDistricts() {
  return await prisma.district.findMany({ orderBy: { name: "asc" } });
}

export async function getUpazilas(districtId: string) {
  return await prisma.upazila.findMany({
    where: { districtId },
    orderBy: { name: "asc" }
  });
}

export async function getUnions(upazilaId: string) {
  return await prisma.union.findMany({
    where: { upazilaId },
    orderBy: { name: "asc" }
  });
}