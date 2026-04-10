import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    let type = searchParams.get("type") || "";

    // আপনার NodeType Enum অনুযায়ী ম্যাপিং (যদি ফ্রন্টএন্ড থেকে CORPORATE আসে তবে সেটাকে JOB করবে)
    if (type === 'CORPORATE') type = 'JOB'; 

    const results = await prisma.institution.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive',
        },
        // শুধুমাত্র ভ্যালিড টাইপ থাকলে ফিল্টার করবে
        ...(type && { type: type as any })
      },
      take: 8,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}