import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const allSkills = [
  // --- IT, AI & Software Development ---
  { name: 'Full Stack Development', slug: 'full-stack-development', category: 'IT' },
  { name: 'Frontend Development', slug: 'frontend-development', category: 'IT' },
  { name: 'Backend Development', slug: 'backend-development', category: 'IT' },
  { name: 'React', slug: 'react', category: 'IT' },
  { name: 'Next.js', slug: 'next-js', category: 'IT' },
  { name: 'Node.js', slug: 'node-js', category: 'IT' },
  { name: 'Python', slug: 'python', category: 'IT' },
  { name: 'JavaScript', slug: 'javascript', category: 'IT' },
  { name: 'TypeScript', slug: 'typescript', category: 'IT' },
  { name: 'PHP', slug: 'php', category: 'IT' },
  { name: 'oracle', slug: 'oracle', category: 'IT' },
   { name: 'mmysql', slug: 'mysql', category: 'IT' },
    { name: 'postgresql', slug: 'postgres', category: 'IT' },
     { name: 'mongodb', slug: 'mongo', category: 'IT' },
  { name: 'Laravel', slug: 'laravel', category: 'IT' },
  { name: 'DevOps', slug: 'devops', category: 'IT' },
  { name: 'Docker', slug: 'docker', category: 'IT' },
  { name: 'Kubernetes', slug: 'kubernetes', category: 'IT' },
  { name: 'Cyber Security', slug: 'cyber-security', category: 'IT' },
  { name: 'Artificial Intelligence', slug: 'artificial-intelligence', category: 'AI' },
  { name: 'Generative AI (GenAI)', slug: 'generative-ai', category: 'AI' },
  { name: 'Machine Learning', slug: 'machine-learning', category: 'AI' },
  { name: 'Data Science', slug: 'data-science', category: 'Data Science' },
  { name: 'Prompt Engineering', slug: 'prompt-engineering', category: 'AI' },
  { name: 'LLM (Large Language Models)', slug: 'llm', category: 'AI' },
  { name: 'Vector Databases', slug: 'vector-databases', category: 'AI' },
  { name: 'Mobile App Development', slug: 'mobile-app-development', category: 'IT' },
  { name: 'Flutter', slug: 'flutter', category: 'IT' },
  { name: 'React Native', slug: 'react-native', category: 'IT' },
  { name: 'Database Management', slug: 'database-management', category: 'IT' },
  { name: 'Game Development', slug: 'game-development', category: 'IT' },
  { name: 'IoT (Internet of Things)', slug: 'iot', category: 'IT' },
  { name: 'Cloud Computing (AWS/Azure)', slug: 'cloud-computing', category: 'IT' },

  // --- Engineering & Construction ---
  { name: 'Civil Engineering', slug: 'civil-engineering', category: 'Engineering' },
  { name: 'Mechanical Engineering', slug: 'mechanical-engineering', category: 'Engineering' },
  { name: 'Electrical Engineering (EE)', slug: 'electrical-engineering', category: 'Engineering' },
  { name: 'Chemical Engineering', slug: 'chemical-engineering', category: 'Engineering' },
  { name: 'Genetic Engineering', slug: 'genetic-engineering', category: 'Engineering' },
  { name: 'Textile Engineering', slug: 'textile-engineering', category: 'Engineering' },
  { name: 'Structural Analysis', slug: 'structural-analysis', category: 'Engineering' },
  { name: 'Engineering Drawing', slug: 'engineering-drawing', category: 'Design' },
  { name: 'AutoCAD', slug: 'autocad', category: 'Design' },
  { name: 'SolidWorks', slug: 'solidworks', category: 'Design' },
  { name: 'BIM (Building Information Modeling)', slug: 'bim', category: 'Design' },
  { name: 'Solar Energy Installation', slug: 'solar-installation', category: 'Engineering' },

  // --- Banking, Finance & Insurance ---
  { name: 'Retail Banking', slug: 'retail-banking', category: 'Banking' },
  { name: 'Corporate Banking', slug: 'corporate-banking', category: 'Banking' },
  { name: 'Investment Banking', slug: 'investment-banking', category: 'Banking' },
  { name: 'Islamic Banking', slug: 'islamic-banking', category: 'Banking' },
  { name: 'Credit Analysis', slug: 'credit-analysis', category: 'Banking' },
  { name: 'Trade Finance', slug: 'trade-finance', category: 'Banking' },
  { name: 'Fintech', slug: 'fintech', category: 'Banking' },
  { name: 'Mobile Financial Services (MFS)', slug: 'mfs', category: 'Banking' },
  { name: 'Insurance Underwriting', slug: 'insurance-underwriting', category: 'Insurance' },
  { name: 'Life Insurance', slug: 'life-insurance', category: 'Insurance' },
  { name: 'Share Market Analysis', slug: 'share-market', category: 'Finance' },
  { name: 'Foreign Exchange (Forex)', slug: 'forex', category: 'Finance' },
  { name: 'Taxation (VAT/TAX)', slug: 'taxation', category: 'Finance' },
  { name: 'Audit', slug: 'audit', category: 'Finance' },

  // --- Government, Legal & Politics ---
  { name: 'BCS Cadre', slug: 'bcs-cadre', category: 'Government' },
  { name: 'Public Administration', slug: 'public-administration', category: 'Government' },
  { name: 'Criminal Law', slug: 'criminal-law', category: 'Legal' },
  { name: 'Corporate Law', slug: 'corporate-law', category: 'Legal' },
  { name: 'Advocacy', slug: 'advocacy', category: 'Legal' },
  { name: 'Political Campaign Management', slug: 'political-campaign-management', category: 'Politics' },
  { name: 'Public Policy', slug: 'public-policy', category: 'Social Science' },
  { name: 'Diplomacy', slug: 'diplomacy', category: 'Government' },

  // --- Healthcare & Medical ---
  { name: 'General Physician', slug: 'general-physician', category: 'Healthcare' },
  { name: 'Pharmacy', slug: 'pharmacy', category: 'Healthcare' },
  { name: 'Surgery', slug: 'surgery', category: 'Healthcare' },
  { name: 'Nutritionist', slug: 'nutritionist', category: 'Healthcare' },
  { name: 'Psychology', slug: 'psychology', category: 'Humanities' },
  { name: 'Mental Health Counseling', slug: 'mental-health', category: 'Healthcare' },
  { name: 'Physiotherapist', slug: 'physiotherapist', category: 'Healthcare' },
  { name: 'Veterinary Medicine', slug: 'veterinary', category: 'Healthcare' },

  // --- Education & Arts ---
  { name: 'School Teacher', slug: 'school-teacher', category: 'Education' },
  { name: 'University Professor', slug: 'professor', category: 'Education' },
  { name: 'Private Tutor', slug: 'private-tutor', category: 'Education' },
  { name: 'Bengali Literature', slug: 'bengali-literature', category: 'Arts' },
  { name: 'English Literature', slug: 'english-literature', category: 'Arts' },
  { name: 'Creative Writing', slug: 'creative-writing', category: 'Arts' },
  { name: 'Singing', slug: 'singing', category: 'Arts' },
  { name: 'Acting', slug: 'acting', category: 'Entertainment' },
  { name: 'Dance', slug: 'dance', category: 'Entertainment' },

  // --- Service Providers & Local Trade ---
  { name: 'Electrician', slug: 'electrician', category: 'Services' },
  { name: 'Plumber', slug: 'plumber', category: 'Services' },
  { name: 'AC Technician', slug: 'ac-technician', category: 'Services' },
  { name: 'C&F Agent', slug: 'cnf-agent', category: 'Trade' },
  { name: 'Flexiload Business', slug: 'flexiload-business', category: 'Trade' },
  { name: 'E-commerce Management', slug: 'e-commerce', category: 'Business' },
  { name: 'SME Management', slug: 'sme-management', category: 'Business' },
  { name: 'Real Estate Business', slug: 'real-estate', category: 'Business' },
  { name: 'Entrepreneurship', slug: 'entrepreneurship', category: 'Business' },
  { name: 'Freelancing', slug: 'freelancing', category: 'Employment' },

  // --- Agriculture & Social Work ---
  { name: 'Farmer', slug: 'farmer', category: 'Agriculture' },
  { name: 'Livestock Expert', slug: 'livestock-expert', category: 'Agriculture' },
  { name: 'Fisheries Specialist', slug: 'fisheries', category: 'Agriculture' },
  { name: 'NGO Management', slug: 'ngo-management', category: 'Social Work' },
  { name: 'Volunteerism', slug: 'volunteerism', category: 'Social Work' },
  { name: 'Blood Donation Coordination', slug: 'blood-donation', category: 'Social Work' },

  // --- Sports & Media ---
  { name: 'Cricket', slug: 'cricket', category: 'Sports' },
  { name: 'Football', slug: 'football', category: 'Sports' },
  { name: 'Photography', slug: 'photography', category: 'Media' },
  { name: 'Video Editing', slug: 'video-editing', category: 'Media' },
  { name: 'Social Media Marketing', slug: 'social-media-marketing', category: 'Marketing' },
  { name: 'Celebrity Management', slug: 'celebrity-management', category: 'Media' }
];

// --- Duplicate Removal Logic (Slug based) ---
const uniqueSkills = Array.from(new Map(allSkills.map(item => [item.slug, item])).values());

async function main() {
  console.log(`Start seeding ${uniqueSkills.length} unique skills...`);
  
  for (const skill of uniqueSkills) {
    await prisma.skillMaster.upsert({
      where: { slug: skill.slug },
      update: {},
      create: {
        name: skill.name,
        slug: skill.slug,
        category: skill.category,
        count: 1
      },
    })
  }
  
  console.log("Seeding finished successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })