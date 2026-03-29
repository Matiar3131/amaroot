'use client';

import React from 'react';
import { 
  Code2, 
  Globe, 
  Lock, 
  Zap, 
  Copy, 
  CheckCircle2, 
  Terminal,
  Server
} from 'lucide-react';

const endpoints = [
  {
    method: "GET",
    path: "/v1/user/verify/:nid",
    desc: "ইউজারের এনআইডি ভেরিফিকেশন স্ট্যাটাস চেক করার জন্য।",
    color: "text-green-600 bg-green-50"
  },
  {
    method: "POST",
    path: "/v1/network/connect",
    desc: "দুইটি রুটের মধ্যে স্বয়ংক্রিয় কানেকশন তৈরি করতে।",
    color: "text-blue-600 bg-blue-50"
  },
  {
    method: "GET",
    path: "/v1/roots/discover",
    desc: "ইউজারের লোকেশন অনুযায়ী নিকটস্থ রুট বা শেকড় খুঁজে পেতে।",
    color: "text-purple-600 bg-purple-50"
  }
];

const ApiInfo = () => {
  return (
    <div className="bg-[#fcfcfd] min-h-screen pb-20 font-sans">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-6">
            <Zap size={14} /> DEVELOPER API V1.0
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            আপনার অ্যাপে যুক্ত করুন <br />
            <span className="text-blue-600 font-bold">আমার রুট এপিআই</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Identity-based নেটওয়ার্কিংয়ের ক্ষমতা এখন আপনার হাতে। আমাদের সিকিউর এপিআই ব্যবহার করে ভেরিফাইড ইউজার ডেটা এবং অটো-কানেকশন ফিচার ইন্টিগ্রেট করুন।
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Docs & Info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Auth Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="text-blue-600" size={24} /> Authentication
              </h2>
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <p className="text-gray-600 mb-6 text-sm">
                  সব এপিআই রিকোয়েস্টে একটি <code className="bg-gray-100 px-2 py-1 rounded text-red-500">Bearer Token</code> প্রয়োজন হয়। এটি আপনার ড্যাশবোর্ড থেকে সংগ্রহ করতে পারবেন।
                </p>
                <div className="bg-slate-900 rounded-2xl p-5 flex items-center justify-between group">
                  <code className="text-blue-300 text-xs font-mono">Authorization: Bearer YOUR_SECRET_KEY</code>
                  <Copy size={16} className="text-slate-500 group-hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
            </div>

            {/* Endpoints Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="text-blue-600" size={24} /> Core Endpoints
              </h2>
              <div className="space-y-4">
                {endpoints.map((ep, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center gap-4">
                    <span className={`px-3 py-1 rounded-lg font-bold text-xs ${ep.color}`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-sm text-gray-700 flex-1">{ep.path}</span>
                    <p className="text-gray-400 text-xs">{ep.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Code Preview & Status */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Server size={16} className="text-green-500" /> API Status
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Uptime</span>
                  <span className="text-green-600 font-bold">99.9%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Avg. Latency</span>
                  <span className="text-gray-900 font-medium">142ms</span>
                </div>
                <div className="pt-4 border-t border-gray-50">
                   <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                     <CheckCircle2 size={12} className="text-green-500" /> All Systems Operational
                   </div>
                </div>
              </div>
            </div>

            {/* Integration Card */}
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
              <Terminal size={32} className="mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2 text-white">SDK Coming Soon</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                React, Node.js এবং Python-এর জন্য আমরা খুব দ্রুত SDK রিলিজ করতে যাচ্ছি।
              </p>
              <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                Waitlist এ যোগ দিন
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ApiInfo;