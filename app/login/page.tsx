'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 px-4 py-8">
      {/* Main Container: Grid layout for Left and Right side */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
        
        {/* --- LEFT SIDE: FEATURES & SLOGAN --- */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-blue-600 text-white relative overflow-hidden">
          {/* Background pattern decoration */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-700 rounded-full opacity-50 blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-6 leading-tight">
              আপনার শেকড়কে খুঁজুন, <br />
              নেটওয়ার্ক বড় করুন।
            </h1>
            <p className="text-blue-100 text-lg mb-10 max-w-md">
              অমরুট (Amaroot) বাংলাদেশের প্রথম আইডেন্টিটি-বেসড অটো নেটওয়ার্কিং প্ল্যাটফর্ম।
            </p>

            {/* Feature Cards */}
            <div className="space-y-6">
              {[
                { title: "অটো-নেটওয়ার্কিং", desc: "পরিবার ও আত্মীয়দের সাথে স্বয়ংক্রিয় সংযোগ।", icon: "🤝" },
                { title: "নিরাপদ পরিচয়", desc: "এনআইডি ভেরিফাইড প্রোফাইল ও নিরাপত্তা।", icon: "🆔" },
                { title: "লোকাল সার্ভিস", desc: "আপনার এলাকার প্রয়োজনীয় সব সেবা এক জায়গায়।", icon: "📍" }
              ].map((f, i) => (
                <div key={i} className="flex items-start p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                  <span className="text-2xl mr-4">{f.icon}</span>
                  <div>
                    <h4 className="font-bold text-white">{f.title}</h4>
                    <p className="text-sm text-blue-100">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: AUTH FORM --- */}
        <div className="flex flex-col h-full">
          {/* Header / Logo */}
          <div className="text-center pt-10 pb-4">
            <Link href="/" className="text-3xl font-bold text-blue-600 tracking-tight">
              Ama<span className="text-gray-900">root</span>
            </Link>
            <p className="mt-2 text-gray-500 text-sm font-medium italic">আমার শেকড় আমার পরিচয়</p>
          </div>

          {/* Tabs */}
          <div className="flex px-8 mt-4">
            <div className="flex w-full bg-gray-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all ${
                  activeTab === 'login' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                লগইন
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all ${
                  activeTab === 'signup' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                নিবন্ধন
              </button>
            </div>
          </div>

          <div className="p-8 lg:p-12 flex-grow">
            {activeTab === 'login' ? (
              /* --- LOGIN FORM --- */
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">ফোন নম্বর</label>
                  <input 
                    type="tel" 
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700 text-left">পাসওয়ার্ড</label>
                    <Link href="#" className="text-xs text-blue-600 font-bold hover:underline">ভুলে গেছেন?</Link>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 transition duration-150 font-bold shadow-xl shadow-blue-100 mt-2"
                >
                  প্রবেশ করুন
                </button>
              </form>
            ) : (
              /* --- SIGNUP FORM --- */
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">আপনার নাম</label>
                    <input 
                      type="text" 
                      placeholder="পুরো নাম"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">ফোন নম্বর</label>
                    <input 
                      type="tel" 
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">NID নম্বর (ঐচ্ছিক)</label>
                    <input 
                      type="text" 
                      placeholder="জাতীয় পরিচয়পত্র নম্বর"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 leading-relaxed text-center">
                  নিবন্ধন করার মাধ্যমে আপনি অমরুট-এর <span className="underline">ব্যবহারকারীর শর্তাবলী</span> এবং <span className="underline">গোপনীয়তা নীতি</span> মেনে নিচ্ছেন।
                </p>
                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 transition duration-150 font-bold shadow-xl shadow-green-50 mt-4"
                >
                  নিবন্ধন সম্পন্ন করুন
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}