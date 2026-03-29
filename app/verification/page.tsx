'use client';

import { ShieldCheck, FileText, Camera, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const verificationMethods = [
  {
    title: "NID ভেরিফিকেশন",
    description: "আপনার জাতীয় পরিচয়পত্রের মাধ্যমে দ্রুত এবং স্বয়ংক্রিয়ভাবে পরিচয় নিশ্চিত করুন।",
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    status: "Recommended",
    action: "শুরু করুন"
  },
  {
    title: "ফেস রিকগনিশন",
    description: "আপনার একটি লাইভ ছবি দিন যা আপনার NID-এর সাথে ম্যাচ করানো হবে।",
    icon: <Camera className="w-8 h-8 text-purple-600" />,
    status: "Instant",
    action: "ক্যামেরা ওপেন করুন"
  }
];

export default function VerificationPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Section */}
      <section className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            আপনার প্রোফাইল <span className="text-blue-600">ভেরিফাই করুন</span>
          </h1>
          <p className="text-gray-600 text-lg">
            নিরাপদ কমিউনিটি গড়ে তুলতে আপনার পরিচয় নিশ্চিত করা জরুরি। ভেরিফাইড ইউজাররা বিশেষ ব্যাজ এবং বাড়তি সুবিধা পাবেন।
          </p>
        </div>
      </section>

      {/* Verification Steps */}
      <section className="max-w-4xl mx-auto px-4 mt-12">
        <div className="grid gap-6">
          {verificationMethods.map((method, index) => (
            <div 
              key={index} 
              className="group border border-gray-200 rounded-3xl p-6 md:p-8 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  {method.icon}
                </div>
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{method.title}</h3>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {method.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm max-w-sm">{method.description}</p>
                </div>
              </div>
              <button className="w-full md:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-gray-200">
                {method.action}
              </button>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-12 bg-blue-50 rounded-3xl p-8 border border-blue-100">
          <h4 className="text-blue-900 font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> ভেরিফিকেশনের সুবিধা:
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "প্রোফাইলে 'Verified' ব্লু ব্যাজ",
              "বিশ্বস্ত নেটওয়ার্কে অগ্রাধিকার",
              "উন্নত সিকিউরিটি ফিচার",
              "কমিউনিটি ইভেন্টে সরাসরি এক্সেস"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-blue-800/80">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Link */}
        <div className="mt-12 text-center text-sm text-gray-400">
          কোনো সমস্যা হচ্ছে? <Link href="/support" className="text-blue-600 hover:underline font-medium">সাপোর্ট টিমের সাথে কথা বলুন</Link>
        </div>
      </section>
    </div>
  );
}