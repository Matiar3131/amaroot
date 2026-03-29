import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; // lib/prisma থেকে ইম্পোর্ট করুন

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database Connection Failed" }, { status: 500 });
  }
}