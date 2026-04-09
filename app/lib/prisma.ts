import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

// গ্লোবাল টাইপ ডিক্লেয়ারেশন যাতে ডেভেলপমেন্টে মাল্টিপল ক্লায়েন্ট তৈরি না হয়
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma