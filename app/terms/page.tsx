'use client';

import React from 'react';
import { Scale, CheckCircle2, AlertCircle, ShieldAlert, UserCheck, HelpCircle } from 'lucide-react';

const termSections = [
  {
    title: "১. অ্যাকাউন্ট তৈরি ও নিরাপত্তা",
    content: "প্ল্যাটফর্মটি ব্যবহারের জন্য আপনাকে সঠিক তথ্য দিয়ে নিবন্ধন করতে হবে। আপনার পাসওয়ার্ড এবং অ্যাকাউন্টের গোপনীয়তা রক্ষার দায়িত্ব সম্পূর্ণ আপনার। কোনো সন্দেহজনক কার্যকলাপ দেখলে দ্রুত আমাদের জানান।",
    icon: <UserCheck className="text-blue-600" size={24} />
  },
  {
    title: "২. তথ্যের সঠিকতা ও ভেরিফিকেশন",
    content: "আপনি যে NID বা পরিচয়পত্র প্রদান করবেন তা অবশ্যই বৈধ এবং আপনার নিজস্ব হতে হবে। ভুয়া তথ্য বা অন্যের পরিচয় ব্যবহার করলে আপনার অ্যাকাউন্ট স্থায়ীভাবে নিষিদ্ধ করা হবে।",
    icon: <CheckCircle2 className="text-green-600" size={24} />
  },
  {
    title: "৩. ব্যবহারকারীর আচরণ",
    content: "আমাদের প্ল্যাটফর্মে কোনো প্রকার অশালীন, মানহানিকর বা উস্কানিমূলক বক্তব্য প্রচার করা নিষিদ্ধ। একে অপরের প্রতি সম্মান বজায় রাখা এবং নিরাপদ কমিউনিটি নিশ্চিত করা আমাদের মূল লক্ষ্য।",
    icon: <ShieldAlert className="text-red-500" size={24} />
  },
  {
    title: "৪. মেধা সম্পদ (Intellectual Property)",
    content: "আমার রুট (Amar Root) এর লোগো, ডিজাইন, কোড এবং কন্টেন্ট আমাদের নিজস্ব সম্পদ। আমাদের অনুমতি ছাড়া এগুলো বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা আইনত দণ্ডনীয়।",
    icon: <Scale className="text-purple-600" size={24} />
  }
];

const TermsOfService = () => {
  const lastUpdated = "২৯ মার্চ, ২০২৬";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
            ব্যবহারের <span className="text-blue-400">শর্তাবলী</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            আমার রুট (Amar Root) ব্যবহারের মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন। দয়া করে মনোযোগ সহকারে পড়ুন।
          </p>
          <div className="mt-8 inline-block px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-xs font-mono text-slate-300">
            Last Updated: {lastUpdated}
          </div>
        </div>
      </section>

      {/* Terms Body */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="grid gap-8">
          {termSections.map((section, index) => (
            <div key={index} className="flex gap-6 p-8 border border-gray-100 rounded-[2.5rem] bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all">
              <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                {section.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-16 p-8 md:p-12 bg-red-50 rounded-[2.5rem] border border-red-100 border-dashed">
          <div className="flex items-center gap-3 mb-6 text-red-600 font-bold">
            <AlertCircle size={24} /> সতর্কবার্তা
          </div>
          <p className="text-red-900/80 text-sm leading-relaxed mb-6 italic">
            "আমার রুট" একটি নেটওয়ার্কিং প্ল্যাটফর্ম। কোনো ব্যবহারকারীর দ্বারা সংঘটিত কোনো অফলাইন লেনদেন বা ব্যক্তিগত বিরোধের জন্য কর্তৃপক্ষ দায়ী থাকবে না। আমরা শুধুমাত্র ভেরিফাইড পরিচয় এবং ডিজিটাল সংযোগ নিশ্চিত করি।
          </p>
          <div className="h-px bg-red-200/50 w-full mb-6"></div>
          <p className="text-gray-600 text-xs">
            এই শর্তাবলী বাংলাদেশের আইন অনুযায়ী পরিচালিত হবে। কোনো বিরোধ দেখা দিলে তা ঢাকার আদালতের মাধ্যমে নিষ্পত্তি করা হবে।
          </p>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="text-blue-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">আপনার কি কোনো প্রশ্ন আছে?</h2>
          <p className="text-gray-500 mb-6">শর্তাবলী নিয়ে কোনো অস্পষ্টতা থাকলে আমাদের লিগ্যাল টিমের সাথে যোগাযোগ করুন।</p>
          <a 
            href="mailto:legal@amarroot.com" 
            className="text-blue-600 font-bold hover:underline"
          >
            legal@amaroot.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;