'use client';

import React from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Coffee, 
  Globe, 
  Zap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const jobs = [
  {
    title: "Full Stack Developer (Next.js & Node.js)",
    type: "Full-time",
    location: "Remote / Dhaka",
    dept: "Engineering"
  },
  {
    title: "Product Designer (UI/UX)",
    type: "Full-time",
    location: "Remote",
    dept: "Design"
  },
  {
    title: "Growth Marketing Manager",
    type: "Part-time",
    location: "Remote",
    dept: "Marketing"
  }
];

const perks = [
  {
    title: "রিমোট কালচার",
    desc: "আপনার সুবিধা মতো যেকোনো জায়গা থেকে কাজ করার স্বাধীনতা।",
    icon: <Globe className="text-blue-600" size={24} />
  },
  {
    title: "আধুনিক টেক স্ট্যাক",
    desc: "আমরা Next.js, Prisma এবং AI নিয়ে কাজ করি—সবসময় লেটেস্ট টেকনোলজি।",
    icon: <Zap className="text-purple-600" size={24} />
  },
  {
    title: "লার্নিং বাজেট",
    desc: "আপনার স্কিল বাড়ানোর জন্য আমরা বই এবং অনলাইন কোর্সের খরচ বহন করি।",
    icon: <Coffee className="text-orange-500" size={24} />
  }
];

const CareersPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-[#0a0a0b] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            ভবিষ্যৎ গড়ুন <span className="text-blue-500 underline decoration-blue-500/30">আমাদের সাথে</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            আমরা কেবল একটি অ্যাপ বানাচ্ছি না, আমরা মানুষের শেকড় খুঁজে পাওয়ার মাধ্যম তৈরি করছি। 
            আপনি কি এই মিশনে আমাদের সঙ্গী হতে চান?
          </p>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">কেন আমার রুট-এ কাজ করবেন?</h2>
          <p className="text-gray-500">আমরা আমাদের টিম মেম্বারদের সৃজনশীলতা এবং প্রশান্তিকে গুরুত্ব দেই।</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {perks.map((perk, i) => (
            <div key={i} className="p-8 border border-gray-100 rounded-[2.5rem] bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-50 transition-all">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                {perk.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{perk.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">বর্তমান সুযোগসমূহ</h2>
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {jobs.length} Open Roles
            </span>
          </div>

          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i} className="bg-white border border-gray-100 p-6 md:p-8 rounded-[2rem] hover:border-blue-500 transition-all group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 block">{job.dept}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Clock size={16} /> {job.type}</span>
                  </div>
                </div>
                <button className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all">
                  আবেদন করুন <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spontaneous Application CTA */}
      <section className="py-24 text-center">
        <div className="max-w-xl mx-auto px-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-200">
          <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl font-bold mb-4">আপনার পছন্দের রোলটি খুঁজে পাচ্ছেন না?</h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            সমস্যা নেই! আমাদের আপনার সিভি পাঠিয়ে রাখুন। আপনার জন্য সঠিক সুযোগ এলে আমরাই যোগাযোগ করব।
          </p>
          <Link 
            href="mailto:careers@amarroot.com" 
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-lg"
          >
            সিভি পাঠান
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;