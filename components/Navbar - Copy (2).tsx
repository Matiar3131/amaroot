'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  // সেশন চেক করে ডাইনামিক লিঙ্ক সেট করা
  const rootHref = status === "authenticated" ? "/root" : "/login?mode=signup";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* ১. লোগো */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              Ama<span className="text-gray-900">root</span>
            </Link>
          </div>

          {/* ২. ডান পাশের সব কন্টেন্ট */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* মেনু লিঙ্কসমূহ */}
            <div className="flex items-center space-x-6 mr-2">
              {[
                { name: 'হোম', href: '/' },
                { name: 'আমার সম্পর্কে', href: '/about' },
                { name: 'ডকুমেন্টেশন', href: '/docs' },
                { name: 'যোগাযোগ', href: '/contact' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition duration-150 font-medium text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* আমার রুট বাটন (লগইন থাকলে /root এ যাবে, না থাকলে সাইনআপে) */}
            <Link
              href={rootHref}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
              আমার রুট
            </Link>

            {/* ইউজার কন্ডিশনাল রেন্ডারিং */}
            {status === "authenticated" ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="group flex items-center gap-2 bg-gray-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-sm border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <span className="text-xs uppercase tracking-tighter opacity-70">স্বাগতম,</span>
                  <span>{session.user?.name?.split(' ')[0]}</span>
                  <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* ড্রপডাউন মেনু */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50">ড্যাশবোর্ড</Link>
                    <Link href="/settings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50">সেটিংস</Link>
                    <hr className="my-1 border-gray-50" />
                    <button 
                      onClick={() => signOut({ callbackUrl: '/' })} 
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold"
                    >
                      লগআউট করুন
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* লগইন করা না থাকলে লগইন বাটন দেখাবে */
              <Link 
                href="/login" 
                className="group relative px-5 py-2.5 bg-gray-50 text-blue-600 font-bold text-sm rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span>লগইন করুন</span>
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;