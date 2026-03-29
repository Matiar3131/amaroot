'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Code, Shield, Users, ArrowRight, Terminal } from 'lucide-react';

const docCategories = [
  {
    title: "শুরু করা (Getting Started)",
    desc: "কীভাবে অ্যাকাউন্ট খুলবেন এবং আপনার রুট সেটআপ করবেন।",
    icon: <BookOpen className="w-6 h-6 text-blue-600" />,
    links: ["অ্যাকাউন্ট তৈরি", "প্রোফাইল ভেরিফিকেশন", "নেটওয়ার্ক গাইড"]
  },
  {
    title: "নিরাপত্তা ও প্রাইভেসি",
    desc: "আপনার ডেটা কীভাবে সুরক্ষিত থাকে এবং এনক্রিপশন প্রসেস।",
    icon: <Shield className="w-6 h-6 text-green-600" />,
    links: ["ডেটা পলিসি", "এনআইডি সুরক্ষা", "অ্যাকাউন্ট সিকিউরিটি"]
  },
  {
    title: "ডেভেলপার অপশন (API)",
    desc: "আমার রুট এপিআই এবং থার্ড পার্টি ইন্টিগ্রেশন গাইড।",
    icon: <Code className="w-6 h-6 text-purple-600" />,
    links: ["API রেফারেন্স", "Webhooks", "Authentication"]
  },
  {
    title: "কমিউনিটি গাইডলাইন",
    desc: "সুস্থ এবং নিরাপদ নেটওয়ার্কিং নিশ্চিত করার নিয়মাবলী।",
    icon: <Users className="w-6 h-6 text-orange-600" />,
    links: ["ব্যবহারের শর্তাবলী", "রিপোর্টিং সিস্টেম", "কমিউনিটি স্ট্যান্ডার্ড"]
  }
];

// Ensure this is a proper React Component
const DocsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Search/Hero Section */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">ডকুমেন্টেশন সেন্টারে <span className="text-blue-400">স্বাগতম</span></h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            আমার রুট (Amar Root) প্ল্যাটফর্মের সব ফিচার এবং টেকনিক্যাল গাইড এখানে পাবেন।
          </p>
          <div className="max-w-xl mx-auto relative">
            <input 
              type="text" 
              placeholder="কী খুঁজছেন? (যেমন: ভেরিফিকেশন, এপিআই...)" 
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {docCategories.map((cat, index) => (
            <div key={index} className="group p-8 border border-gray-100 rounded-[2rem] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all bg-white">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">{cat.desc}</p>
                  <ul className="space-y-3">
                    {cat.links.map((link, i) => (
                      <li key={i}>
                        <Link href="#" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group/link">
                          {link} <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start Code Snippet */}
        <div className="mt-20 bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-6 py-4 bg-slate-800 border-b border-slate-700">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono text-slate-400">Quick Start API Example</span>
          </div>
          <div className="p-8 font-mono text-sm overflow-x-auto text-blue-300">
            <pre>
{`// API Integration for Amar Root Identity
const user = await amaroot.verify({
  token: 'YOUR_ACCESS_TOKEN',
  nid: '1990XXXXXXXXX'
});

console.log('Connected to Root:', user.village_id);`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocsPage;