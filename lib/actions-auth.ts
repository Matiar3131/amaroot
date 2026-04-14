"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const userType = (formData.get("userType") as string) || "individual";
  const nid_bin = formData.get("nid_bin") as string;

  if (!email || !password || !phone) {
    return { error: "ইমেইল, ফোন নম্বর এবং পাসওয়ার্ড অবশ্যই দিতে হবে!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name: name || null,
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        password: hashedPassword,
        nid: nid_bin || null,
        userType: userType.toUpperCase() === "COMPANY" ? "COMPANY" : "INDIVIDUAL",
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const target = error.meta?.target || [];
      if (Array.isArray(target) && target.includes('email') || (typeof target === 'string' && target.includes('email'))) {
        return { error: "এই ইমেইলটি দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।" };
      }
      if (Array.isArray(target) && target.includes('phone') || (typeof target === 'string' && target.includes('phone'))) {
        return { error: "এই ফোন নম্বরটি দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।" };
      }
    }
    console.error("Signup Database Error:", error);
    return { error: "নিবন্ধনে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।" };
  }

  redirect("/login?success=true");
}