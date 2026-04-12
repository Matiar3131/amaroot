import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting Seeding Process...');

  // --- ১. ক্লিন আপ (camelCase মেইনটেইন করা হয়েছে) ---
  console.log('🧹 Cleaning old data...');
  // এখানে 'SectorOrgWiseDesignation' এর বদলে 'sectorOrgWiseDesignation' হবে
  await prisma.sectorOrgWiseDesignation.deleteMany(); 
  await prisma.union.deleteMany();       
  await prisma.upazila.deleteMany();     
  await prisma.district.deleteMany();    
  await prisma.nodeList.deleteMany();
  await prisma.organizationStructure.deleteMany();

  // --- ২. নোড লিস্ট ডাটা (NodeList) ---
  const nodes = [
    { name: 'BIO', label: 'ব্যক্তিগত তথ্য', category: 'INDIVIDUAL', isDefault: true },
    { name: 'PR_ADDR', label: 'বর্তমান ঠিকানা', category: 'INDIVIDUAL', isDefault: true },
    { name: 'PM_ADDR', label: 'স্থায়ী ঠিকানা', category: 'INDIVIDUAL', isDefault: true },
    { name: 'SCHOOL', label: 'স্কুল', category: 'INDIVIDUAL', isDefault: true },
    { name: 'COLLEGE', label: 'কলেজ', category: 'INDIVIDUAL', isDefault: true },
    { name: 'UNIVERSITY', label: 'বিশ্ববিদ্যালয়', category: 'INDIVIDUAL', isDefault: true },
    { name: 'WORK_EXP', label: 'কাজের অভিজ্ঞতা', category: 'INDIVIDUAL', isDefault: true },
    { name: 'SKILL', label: 'দক্ষতা', category: 'INDIVIDUAL', isDefault: false },
    { name: 'NOMINEE', label: 'নমিনি ও জরুরি যোগাযোগ', category: 'INDIVIDUAL', isDefault: false },
    { name: 'ORG_DIV', label: 'ডিভিশন (Division)', category: 'CORPORATE', isDefault: true },
    { name: 'ORG_DEPT', label: 'ডিপার্টমেন্ট', category: 'CORPORATE', isDefault: true },
    { name: 'ORG_SEC', label: 'সেকশন (Section)', category: 'CORPORATE', isDefault: true },
    { name: 'ORG_UNIT', label: 'ইউনিট (Unit)', category: 'CORPORATE', isDefault: false },
    { name: 'ORG_LINE', label: 'প্রোডাকশন লাইন', category: 'CORPORATE', isDefault: false },
    { name: 'ORG_DESIG', label: 'পদবী (Designation)', category: 'CORPORATE', isDefault: true },
    { name: 'OFFICE_LOC', label: 'অফিসের অবস্থান', category: 'CORPORATE', isDefault: true },
  ];

  console.log('📝 Seeding NodeList...');
  for (const node of nodes) {
    await prisma.nodeList.create({
      data: { ...node, id: crypto.randomUUID() }
    });
  }

  // --- ৩. অর্গানাইজেশন স্ট্রাকচার (OrganizationStructure) ---
  const orgStructures = [
    { sector: "Banking", orgName: "Jamuna Bank PLC", department: "IT Division", branch: "Head Office", desk: "Database Administration (DBA)" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", department: "IT Division", branch: "Head Office", desk: "Software Development Team" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", department: "IT Division", branch: "Head Office", desk: "Business System Team" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", department: "IT Division", branch: "Head Office", desk: "Storage and System Administration" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", department: "IT Division", branch: "Head Office", desk: "IT Compliance and Audit" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", department: "IT Division", branch: "Head Office", desk: "Network & Security" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", department: "IT Division", branch: "Head Office", desk: "ADC & Digital Banking" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", department: "IT Division", branch: "Head Office", desk: "IT Operations & Support" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", department: "General Banking", branch: "Motijheel Branch", desk: "Cash Section" },
    { sector: "Banking", orgName: "Dutch-Bangla Bank PLC", department: "IT Division", branch: "Head Office", desk: "Mobile Banking (Rocket)" },
    { sector: "Banking", orgName: "City Bank PLC", department: "Digital Financial Services", branch: "Gulshan", desk: "CityTouch Support" },
    { sector: "Banking", orgName: "BRAC Bank PLC", department: "Technology Division", branch: "Anik Tower", desk: "Core Banking Support" },
    { sector: "IT", orgName: "Brain Station 23", department: "FinTech Unit", branch: "Dhaka", desk: "NodeJS/React Team" },
    { sector: "IT", orgName: "Enosis Solutions", department: "Software Engineering", branch: "Dhaka", desk: "QA Automation" },
    { sector: "Telecommunication", orgName: "Grameenphone Ltd.", department: "Technology Division", branch: "GPHouse", desk: "Network Ops" },
    { sector: "Manufacturing", orgName: "Walton Hi-Tech Industries", department: "R&D Department", branch: "Gazipur", desk: "IoT Section" },
    { sector: "Government", orgName: "ICT Division", department: "Aspire to Innovate (a2i)", branch: "Agargaon", desk: "Digital Service" },
    { sector: "Education", orgName: "CUET", department: "CSE Department", branch: "Chattogram", desk: "Lab Admin" },
  ];

  console.log('🏢 Seeding OrganizationStructure...');
  await prisma.organizationStructure.createMany({ data: orgStructures });

  // --- ৪. সেক্টর ও অর্গানাইজেশন অনুযায়ী পদবী (SectorOrgWiseDesignation) ---
  const designations = [
    { sector: "Banking", orgName: "Jamuna Bank PLC", designation: "Management Trainee Officer (MTO)" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", designation: "Probationary Officer" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", designation: "Junior Officer" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", designation: "Officer" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", designation: "Senior Officer" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", designation: "Executive Officer" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", designation: "Senior Executive Officer" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", designation: "Principal Officer" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", designation: "Senior Principal Officer" },
    { sector: "Banking", orgName: "Jamuna Bank PLC", designation: "Assistant Vice President (AVP)" },
    { sector: "Banking", orgName: "Dutch-Bangla Bank PLC", designation: "Assistant Officer" },
    { sector: "Banking", orgName: "Dutch-Bangla Bank PLC", designation: "Executive Officer" },
    { sector: "Banking", orgName: "Dutch-Bangla Bank PLC", designation: "Senior Officer" },
    { sector: "IT", orgName: "Global", designation: "Junior Software Engineer" },
    { sector: "IT", orgName: "Global", designation: "Software Engineer" },
    { sector: "IT", orgName: "Global", designation: "Senior Software Engineer" },
    { sector: "IT", orgName: "Global", designation: "Full Stack Developer" },
    { sector: "IT", orgName: "Global", designation: "Tech Lead" },
    { sector: "IT", orgName: "Global", designation: "Project Manager" },
    { sector: "IT", orgName: "Global", designation: "DevOps Engineer" },
    { sector: "IT", orgName: "Global", designation: "UI/UX Designer" },
    { sector: "IT", orgName: "Brain Station 23", designation: "Associate Software Engineer" },
    { sector: "IT", orgName: "Brain Station 23", designation: "Software Architect" },
    { sector: "Government", orgName: "Global", designation: "Assistant Programmer" },
    { sector: "Government", orgName: "Global", designation: "Programmer" },
    { sector: "Government", orgName: "Global", designation: "Senior System Analyst" }
  ];

  console.log('🎓 Seeding sectorOrgWiseDesignation...');
  // এখানেও camelCase ব্যবহার করা হয়েছে
  await prisma.sectorOrgWiseDesignation.createMany({ data: designations });

  // --- ৫. জেলা, উপজেলা এবং ইউনিয়ন ---
  console.log('📍 Seeding Address Data...');
  const districts = [
    { id: 'dist-lmr', name: 'Lalmonirhat' },
    { id: 'dist-dhk', name: 'Dhaka' },
    { id: 'dist-ctg', name: 'Chattogram' },
  ];
  for (const dist of districts) {
    await prisma.district.create({ data: dist });
  }

  const upazilas = [
    { id: 'upz-hb', name: 'Hatibandha', districtId: 'dist-lmr' },
    { id: 'upz-pg', name: 'Patgram', districtId: 'dist-lmr' },
    { id: 'upz-ut-w', name: 'Uttara West', districtId: 'dist-dhk' },
    { id: 'upz-savar', name: 'Savar', districtId: 'dist-dhk' },
  ];
  for (const upz of upazilas) {
    await prisma.upazila.create({ data: upz });
  }

  const unions = [
    { id: 'un-hb-1', name: 'Singimari', upazilaId: 'upz-hb' },
    { id: 'un-hb-2', name: 'Tongbhanga', upazilaId: 'upz-hb' },
    { id: 'un-hb-3', name: 'Barkhata', upazilaId: 'upz-hb' },
    { id: 'un-pg-1', name: 'Dahagram', upazilaId: 'upz-pg' },
    { id: 'un-ut-1', name: 'Sector 1', upazilaId: 'upz-ut-w' },
    { id: 'un-sv-1', name: 'Ashulia', upazilaId: 'upz-savar' },
  ];
  await prisma.union.createMany({ data: unions });

  console.log('✅ All Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });