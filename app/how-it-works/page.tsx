'use client';

import Link from 'next/link';

const steps = [
  {
    id: "০১",
    title: "নিবন্ধন ও পরিচয় যাচাই",
    desc: "আপনার ফোন নম্বর এবং এনআইডি (ঐচ্ছিক) দিয়ে অ্যাকাউন্ট তৈরি করুন। আমরা আপনার তথ্যের নিরাপত্তা নিশ্চিত করি।",
    icon: "🔐",
    color: "bg-blue-50 text-blue-600"
  },
  {
    id: "০২",
    title: "শেকড় বা রুট সেটআপ",
    desc: "আপনার গ্রাম, জেলা এবং পেশাগত তথ্য যুক্ত করুন। এটি আপনাকে আপনার সঠিক কমিউনিটির সাথে যুক্ত হতে সাহায্য করবে।",
    icon: "🌱",
    color: "bg-green-50 text-green-600"
  },
  {
    id: "০৩",
    title: "অটো-কানেক্ট",
    desc: "আমার রুট-এর এআই সিস্টেম স্বয়ংক্রিয়ভাবে আপনার আত্মীয়, বন্ধু এবং এলাকার পরিচিতদের খুঁজে বের করবে।",
    icon: "🤝",
    color: "bg-purple-50 text-purple-600"
  },
  {
    id: "০৪",
    title: "কমিউনিটি সুবিধা উপভোগ",
    desc: "আপনার এলাকার বিশ্বস্ত সেবা গ্রহণ করুন এবং নিজের দক্ষতা শেয়ার করে নেটওয়ার্ক বড় করুন।",
    icon: "🚀",
    color: "bg-orange-50 text-orange-600"
  }
];

export default function HowItWorks() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            আমার রুট (Amaroot) <span className="text-blue-600">কীভাবে কাজ করে?</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            খুবই সহজ ৪টি ধাপের মাধ্যমে আপনি আপনার হারানো শেকড় খুঁজে পেতে পারেন এবং একটি শক্তিশালী কমিউনিটি গড়ে তুলতে পারেন।
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step Number Background */}
                <div className="absolute -top-6 -left-4 text-7xl font-black text-gray-100 group-hover:text-blue-50 transition-colors z-0">
                  {step.id}
                </div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 bg-blue-600 rounded-[3rem] p-12 text-center shadow-2xl shadow-blue-200">
          <h2 className="text-3xl font-bold text-white mb-6">আপনি কি শুরু করতে প্রস্তুত?</h2>
          <p className="text-blue-100 mb-10 text-lg">আজই যুক্ত হোন আপনার ডিজিটাল রুটে।</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/login" 
              className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all text-lg"
            >
              নিবন্ধন করুন
            </Link>
            <Link 
              href="/" 
              className="border border-blue-400 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all text-lg"
            >
              আরও জানুন
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Short */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-12">প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ)</h2>
          <div className="space-y-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2 italic">আমার তথ্য কি নিরাপদ?</h4>
              <p className="text-gray-600 text-sm">জি, আমার রুট আপনার সব তথ্য এনক্রিপ্ট করে রাখে এবং শুধুমাত্র আপনার অনুমোদিত ব্যক্তিদের সাথে শেয়ার করে।</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2 italic">এনআইডি কেন প্রয়োজন?</h4>
              <p className="text-gray-600 text-sm">নেটওয়ার্কের বিশ্বস্ততা নিশ্চিত করার জন্য আমরা এনআইডি ভেরিফিকেশন সাজেস্ট করি, তবে এটি বাধ্যতামূলক নয়।</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}