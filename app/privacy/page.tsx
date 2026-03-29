'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, Database, Bell, FileText } from 'lucide-react';

const sections = [
  {
    title: "আমরা কোন ধরনের তথ্য সংগ্রহ করি?",
    content: "আমরা আপনার নাম, ফোন নম্বর, ইমেইল এবং আইডেন্টিটি ভেরিফিকেশনের জন্য এনআইডি (NID) তথ্য সংগ্রহ করি। এছাড়া আপনার লোকেশন ডেটা ব্যবহার করা হয় যাতে আপনি আপনার নির্দিষ্ট এলাকার নেটওয়ার্কের সাথে যুক্ত হতে পারেন।",
    icon: <Database className="text-blue-600" size={24} />
  },
  {
    title: "তথ্য সুরক্ষায় আমাদের প্রযুক্তি",
    content: "আপনার সমস্ত সংবেদনশীল তথ্য (যেমন NID) ব্যাংক-গ্রেড AES-256 এনক্রিপশনের মাধ্যমে সংরক্ষণ করা হয়। আমাদের সিস্টেমে আপনার ডেটা এন্ড-টু-এন্ড এনক্রিপ্টেড থাকে, যা কোনো অননুমোদিত ব্যক্তি অ্যাক্সেস করতে পারে না।",
    icon: <Lock className="text-green-600" size={24} />
  },
  {
    title: "তৃতীয় পক্ষের সাথে ডেটা শেয়ারিং",
    content: "আমরা আপনার ব্যক্তিগত তথ্য কোনো থার্ড-পার্টি মার্কেটিং এজেন্সির কাছে বিক্রি করি না। শুধুমাত্র আইনি প্রয়োজনে বা আপনার অনুমতি সাপেক্ষে ভেরিফিকেশন পার্টনারদের সাথে প্রয়োজনীয় তথ্য শেয়ার করা হতে পারে।",
    icon: <EyeOff className="text-purple-600" size={24} />
  }
];

const PrivacyPolicy = () => {
  const lastUpdated = "২৯ মার্চ, ২০২৬";

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-slate-50 border-b border-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            প্রাইভেসি <span className="text-blue-600">পলিসি</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            আমার রুট (Amar Root) আপনার ব্যক্তিগত তথ্যের সুরক্ষা এবং গোপনীয়তা বজায় রাখতে প্রতিশ্রুতিবদ্ধ। 
          </p>
          <div className="mt-6 text-sm text-gray-400 font-medium">
            সর্বশেষ আপডেট: {lastUpdated}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6 p-8 border border-gray-100 rounded-[2.5rem] bg-white hover:shadow-xl hover:shadow-blue-50/50 transition-all">
              <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                {section.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {section.content}
                </p>
              </div>
            </div>
          ))}

          {/* Detailed Policy Text */}
          <div className="prose prose-blue max-w-none bg-gray-50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText size={22} className="text-blue-600" /> বিস্তারিত শর্তাবলী
            </h3>
            <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
              <p>
                ১. <strong>কুকিজ (Cookies):</strong> আমাদের ওয়েবসাইট আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে কুকিজ ব্যবহার করে। আপনি চাইলে ব্রাউজার সেটিংস থেকে এটি বন্ধ করতে পারেন।
              </p>
              <p>
                ২. <strong>নিরাপত্তা সতর্কতা:</strong> আপনার অ্যাকাউন্টের পাসওয়ার্ড গোপন রাখা আপনার দায়িত্ব। কোনো সন্দেহজনক অ্যাক্টিভিটি দেখলে দ্রুত আমাদের জানান।
              </p>
              <p>
                ৩. <strong>পলিসি পরিবর্তন:</strong> আমরা যেকোনো সময় এই পলিসি পরিবর্তন করার অধিকার রাখি। বড় কোনো পরিবর্তন হলে আপনাকে ইমেইল বা নোটিফিকেশনের মাধ্যমে জানানো হবে।
              </p>
            </div>
          </div>
        </div>

        {/* Contact/Support Box */}
        <div className="mt-16 bg-blue-600 rounded-[2.5rem] p-10 text-white text-center shadow-2xl shadow-blue-100">
          <Bell className="w-10 h-10 mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-bold mb-4">আপনার কি কোনো প্রশ্ন আছে?</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            আমাদের প্রাইভেসি পলিসি নিয়ে কোনো প্রশ্ন বা উদ্বেগ থাকলে আমাদের লিগ্যাল টিমের সাথে যোগাযোগ করুন।
          </p>
          <a 
            href="mailto:privacy@amarroot.com" 
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all"
          >
            privacy@amarroot.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;