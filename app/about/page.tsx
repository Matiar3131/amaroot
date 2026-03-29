'use client';

import React from 'react';
import { Heart, Target, ShieldCheck, Users2, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

const values = [
  {
    title: "শেকড়ের টান",
    desc: "আমরা বিশ্বাস করি ডিজিটাল যুগেও মানুষ তার গ্রাম, এলাকা এবং আত্মীয়তার সম্পর্কগুলোকে সহজভাবে খুঁজে পাওয়ার অধিকার রাখে।",
    icon: <Heart className="w-6 h-6 text-red-500" />
  },
  {
    title: "নিরাপদ পরিচয়",
    desc: "আপনার আইডেন্টিটি আমাদের কাছে আমানত। এনআইডি ভেরিফিকেশনের মাধ্যমে আমরা একটি নিরাপদ নেটওয়ার্ক নিশ্চিত করি।",
    icon: <ShieldCheck className="w-6 h-6 text-blue-600" />
  },
  {
    title: "কমিউনিটি শক্তি",
    desc: "একা চলা কঠিন, কিন্তু এলাকার পরিচিত মানুষের সাথে মিলে বড় কিছু করা সহজ। আমরা সেই সেতুবন্ধন তৈরি করি।",
    icon: <Users2 className="w-6 h-6 text-orange-500" />
  }
];

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gray-50 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            আমাদের গল্প
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight">
            আমরা মানুষকে যুক্ত করি <br />
            <span className="text-blue-600">তাদের শেকড়ের সাথে।</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            আমার রুট (Amar Root) কেবল একটি সোশ্যাল মিডিয়া নয়; এটি একটি ডিজিটাল ইকোসিস্টেম যেখানে বাংলাদেশের প্রতিটি মানুষ 
            তার এলাকা, গ্রাম এবং হারানো সম্পর্কগুলোকে প্রযুক্তির মাধ্যমে নতুন করে খুঁজে পায়।
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Target className="text-blue-600" /> আমাদের লক্ষ্য
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                বাংলাদেশের প্রতিটি নাগরিকের জন্য একটি ভেরিফাইড এবং বিশ্বস্ত আইডেন্টিটি নেটওয়ার্ক তৈরি করা। আমরা চাই 
                মানুষ যেন তার পেশা, দক্ষতা এবং পরিচয় ব্যবহার করে নিজ এলাকার মানুষের কল্যাণে কাজ করতে পারে।
              </p>
              <div className="flex items-center gap-4 text-sm font-bold text-blue-600">
                <MapPin size={18} /> ঢাকা, বাংলাদেশ থেকে শুরু
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">কেন আমরা <span className="italic">আলাদা</span>?</h2>
            <div className="space-y-6">
              {values.map((val, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                    {val.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{val.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 rounded-[3rem] mx-4 md:mx-12 mb-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-6 h-full w-full">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="border border-white/20"></div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-white text-3xl font-bold mb-12">আমরা যে স্বপ্ন দেখি</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "গ্রাম ও এলাকা", val: "৬৮,০০০+" },
              { label: "নিরাপদ সংযোগ", val: "১০০%" },
              { label: "ইউজার সন্তুষ্টি", val: "২৪/৭" },
              { label: "প্রযুক্তি", val: "AI-Powered" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-black text-blue-400 mb-2">{stat.val}</div>
                <div className="text-gray-400 text-sm uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* CTA Section - About Page */}
<section className="pb-24 text-center">
  <div className="max-w-xl mx-auto px-4">
    <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-6" />
    <h2 className="text-3xl font-bold text-gray-900 mb-4">শেকড়ের সাথে যুক্ত হতে প্রস্তুত?</h2>
    <p className="text-gray-500 mb-10 text-lg">
      আজই আপনার প্রোফাইল তৈরি করুন এবং আপনার এলাকার হারানো বন্ধুদের সাথে নতুন করে পরিচিত হোন।
    </p>
    <Link 
      href="/login?mode=signup" // এখানে ?mode=signup যোগ করা হয়েছে
      className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
    >
      শুরু করুন
    </Link>
  </div>
</section>
    </div>
  );
};

export default AboutPage;