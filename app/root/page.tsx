import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import RootClient from "./RootClient";

export default async function RootPage() {
  const session = await auth();

  // ১. সেশন প্রোটেকশন
  if (!session || !session.user) {
    redirect("/login");
  }

  // ২. ডাটাবেজ থেকে ইউজার ভিত্তিক নোড নিয়ে আসা
  const userNodes = await prisma.node.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // ৩. ক্লায়েন্ট কম্পোনেন্টে ডেটা পাস করা
  return <RootClient initialNodes={userNodes} />;
}