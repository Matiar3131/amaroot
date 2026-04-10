'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // আইকনের জন্য

const Navbar = () => {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rootHref = status === "authenticated" ? "/root" : "/login?mode=signup";

  // @ts-ignore
  const dashboardHref = session?.user?.userType === "COMPANY" 
    ? "/corporate/dashboard" 
    : "/dashboard";

  const menuItems = [
    { name: 'হোম', href: '/' },
    { name: 'আমার সম্পর্কে', href: '/about' },
    { name: 'ডকুমেন্টেশন', href: '/docs' },
    { name: 'যোগাযোগ', href: '/contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* লোগো */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              Ama<span className="text-gray-900">root</span>
            </Link>
          </div>

          {/* ডেক্সটপ মেনু (ল্যাপটপ স্ক্রিনের জন্য) */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-6 mr-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition duration-150 font-medium text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <Link
              href={rootHref}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
              আমার রুট
            </Link>

            {status === "authenticated" ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="group flex items-center gap-2 bg-gray-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-sm border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <span>{session.user?.name?.split(' ')[0]}</span>
                  <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50">
                    <Link href={dashboardHref} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50">ড্যাশবোর্ড</Link>
                    <Link href="/settings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50">সেটিংস</Link>
                    <hr className="my-1 border-gray-50" />
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold">লগআউট</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-5 py-2.5 bg-gray-50 text-blue-600 font-bold text-sm rounded-xl border border-blue-100">লগইন</Link>
            )}
          </div>

          {/* মোবাইল মেনু বাটন (শুধুমাত্র মোবাইলে দেখা যাবে) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 transition-all"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* মোবাইল ড্রপডাউন মেনু কন্টেন্ট */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-600 font-bold text-lg border-b border-gray-50 pb-2"
            >
              {item.name}
            </Link>
          ))}
          
          <Link
            href={rootHref}
            onClick={() => setIsMobileMenuOpen(false)}
            className="block bg-blue-600 text-white px-5 py-4 rounded-2xl font-bold text-center shadow-lg"
          >
            আমার রুট
          </Link>

          {status === "authenticated" ? (
            <div className="space-y-4 pt-2">
              <Link href={dashboardHref} onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 font-bold">ড্যাশবোর্ড</Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="w-full text-left text-red-600 font-black py-2"
              >
                লগআউট করুন
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center px-5 py-4 bg-gray-100 text-blue-600 font-bold rounded-2xl"
            >
              লগইন করুন
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;