'use client'
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const SocialIcons = {
    Facebook: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    ),
    Twitter: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
    ),
    Linkedin: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
    ),
    Github: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
    )
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          <div className="md:col-span-4">
            <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              আমার <span className="text-gray-900">রুট</span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed max-w-xs">
              বাংলাদেশের প্রথম আইডেন্টিটি-বেজড অটো নেটওয়ার্কিং প্ল্যাটফর্ম। আপনার শেকড়কে খুঁজুন এবং নিরাপদ ডিজিটাল নেটওয়ার্ক গড়ে তুলুন।
            </p>
            <div className="mt-6 flex space-x-4 text-gray-400">
              <Link href="https://facebook.com/amaroot" target="_blank" className="hover:text-blue-600 transition-colors"><SocialIcons.Facebook /></Link>
              <Link href="https://twitter.com/amaroot" target="_blank" className="hover:text-blue-400 transition-colors"><SocialIcons.Twitter /></Link>
              <Link href="https://linkedin.com/company/amaroot" target="_blank" className="hover:text-blue-700 transition-colors"><SocialIcons.Linkedin /></Link>
              <Link href="https://github.com/matiar/amaroot" target="_blank" className="hover:text-gray-900 transition-colors"><SocialIcons.Github /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/how-it-works" className="text-gray-500 hover:text-blue-600 transition-colors">How it works</Link></li>
              <li><Link href="/verification" className="text-gray-500 hover:text-blue-600 transition-colors">Verification</Link></li>
              <li><Link href="/docs" className="text-gray-500 hover:text-blue-600 transition-colors">Documentation</Link></li>
              <li><Link href="/api" className="text-gray-500 hover:text-blue-600 transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="text-gray-500 hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-500 hover:text-blue-600 transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Stay Connected</h4>
            <p className="text-sm text-gray-500 mb-4">আমাদের নতুন ফিচার এবং আপডেট পেতে ইমেইল দিন।</p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="আপনার ইমেইল" 
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
              />
              <button className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Amaroot Inc. All rights reserved. 
          </p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-sm text-gray-400 italic">
              Made with ❤️ in Bangladesh
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;