import { PrismaClient } from '@prisma/client'
// crypto বিল্ট-ইন মডিউল আইডি জেনারেট করার জন্য
import crypto from 'crypto' 

const prisma = new PrismaClient()

async function main() {
  const nodes = [
    // --- Individual Nodes ---
    { name: 'BIO', label: 'ব্যক্তিগত তথ্য', category: 'INDIVIDUAL', isDefault: true },
    { name: 'PR_ADDR', label: 'বর্তমান ঠিকানা', category: 'INDIVIDUAL', isDefault: true },
    { name: 'PM_ADDR', label: 'স্থায়ী ঠিকানা', category: 'INDIVIDUAL', isDefault: true },
    { name: 'SCHOOL', label: 'স্কুল', category: 'INDIVIDUAL', isDefault: true },
    { name: 'COLLEGE', label: 'কলেজ', category: 'INDIVIDUAL', isDefault: true },
    { name: 'UNIVERSITY', label: 'বিশ্ববিদ্যালয়', category: 'INDIVIDUAL', isDefault: true },
    { name: 'WORK_EXP', label: 'কাজের অভিজ্ঞতা', category: 'INDIVIDUAL', isDefault: true },
    { name: 'SKILL', label: 'দক্ষতা', category: 'INDIVIDUAL', isDefault: false },
    { name: 'NOMINEE', label: 'নমিনি ও জরুরি যোগাযোগ', category: 'INDIVIDUAL', isDefault: false },

    // --- Corporate Nodes ---
    { name: 'ORG_DIV', label: 'ডিভিশন (Division)', category: 'CORPORATE', isDefault: true },
    { name: 'ORG_DEPT', label: 'ডিপার্টমেন্ট', category: 'CORPORATE', isDefault: true },
    { name: 'ORG_SEC', label: 'সেকশন (Section)', category: 'CORPORATE', isDefault: true },
    { name: 'ORG_UNIT', label: 'ইউনিট (Unit)', category: 'CORPORATE', isDefault: false },
    { name: 'ORG_LINE', label: 'প্রোডাকশন লাইন', category: 'CORPORATE', isDefault: false },
    { name: 'ORG_DESIG', label: 'পদবী (Designation)', category: 'CORPORATE', isDefault: true },
    { name: 'OFFICE_LOC', label: 'অফিসের অবস্থান', category: 'CORPORATE', isDefault: true },
  ];

  console.log('Cleaning old NodeList...');
  await prisma.nodeList.deleteMany();

  console.log('Seeding NodeList...');
  for (const node of nodes) {
    await prisma.nodeList.create({
      data: {
        ...node,
        // যেহেতু স্কিমাতে @default(cuid()) নেই, তাই ম্যানুয়ালি আইডি দিচ্ছি
        id: crypto.randomUUID() 
      }
    });
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  });