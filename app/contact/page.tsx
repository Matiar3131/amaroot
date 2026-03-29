'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // এখানে আপনার API Call বা ইমেইল সেন্ডিং লজিক বসবে
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">যোগাযোগ করুন</h1>
          <p className="text-blue-100 text-lg max-w-xl">
            আপনার যেকোনো প্রশ্ন, মতামত বা কারিগরি সহায়তার জন্য আমরা প্রস্তুত। আমাদের সাথে যোগাযোগ করতে নিচের ফর্মটি ব্যবহার করুন।
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 -mt-12 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-xl shadow-blue-50/50">
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <MessageSquare className="text-blue-600" /> কন্টাক্ট ডিটেইলস
              </h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ইমেইল করুন</p>
                    <p className="text-gray-900 font-medium">support@amarroot.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ফোন করুন</p>
                    <p className="text-gray-900 font-medium">+৮৮০ ১৭০০-০০০০০০</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">অফিস ঠিকানা</p>
                    <p className="text-gray-900 font-medium">বনানী, ঢাকা - ১২১৩, বাংলাদেশ</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-50">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">সাপোর্ট সময়</p>
                    <p className="text-gray-900 font-medium text-sm">শনিবার - বৃহস্পতিবার (১০টা - ৬টা)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-blue-50/50">
              {isSubmitted ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">ধন্যবাদ!</h2>
                  <p className="text-gray-500">আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমাদের টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।</p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-blue-600 font-bold hover:underline"
                  >
                    আরেকটি বার্তা পাঠান
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">আপনার নাম</label>
                      <input 
                        required
                        type="text" 
                        placeholder="নাম লিখুন"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">ইমেইল ঠিকানা</label>
                      <input 
                        required
                        type="email" 
                        placeholder="ইমেইল লিখুন"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">বিষয় (Subject)</label>
                    <input 
                      required
                      type="text" 
                      placeholder="কি বিষয়ে জানতে চান?"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">আপনার বার্তা</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="আপনার প্রশ্ন বা মতামত এখানে লিখুন..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                    ></textarea>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2">
                    বার্তা পাঠান <Send size={20} />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ContactPage;