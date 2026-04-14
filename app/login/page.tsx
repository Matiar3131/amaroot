'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUpAction } from '@/lib/actions-auth';
import { signIn } from 'next-auth/react';

// মেইন কম্পোনেন্টকে Suspense দিয়ে র‍্যাপ করতে হয় যখন useSearchParams ব্যবহার করা হয়
export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>}>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'company'>('individual');

  // URL-এ success=true থাকলে সাকসেস মেসেজ দেখানো
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setActiveTab('login');
      setSuccessMessage("আপনার নিবন্ধন সফল হয়েছে! এখন পাসওয়ার্ড দিয়ে লগইন করুন।");
      
      const timer = setTimeout(() => setSuccessMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // --- সাইনআপ হ্যান্ডলার ---
  const handleSignup = async (formData: FormData) => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    formData.append('userType', userType);
    
    const result = await signUpAction(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    }
    // সফল হলে রিডাইরেক্ট সার্ভার অ্যাকশন থেকেই হবে (redirect("/login?success=true"))
  };

  // --- লগইন হ্যান্ডলার ---
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;

    try {
      const res = await signIn('credentials', {
        phone,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়।");
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError("সিস্টেমে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 px-4 py-8 relative">
      
      {/* --- Floating Success Popup --- */}
      {successMessage && (
        <div className="fixed top-10 right-5 z-[100] animate-in fade-in slide-in-from-right-10 duration-500">
          <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-b-4 border-green-800">
            <span className="text-xl">✅</span>
            <div className="flex flex-col">
              <span className="font-bold">সফল হয়েছে!</span>
              <span className="text-xs opacity-90">{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="ml-4 hover:scale-110">✕</button>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
        
        {/* --- LEFT SIDE: BRANDING --- */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-blue-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-700 rounded-full opacity-50 blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-6 leading-tight">
              আপনার শেকড়কে খুঁজুন, <br /> নেটওয়ার্ক বড় করুন।
            </h1>
            <div className="space-y-6">
              {[
                { title: "অটো-নেটওয়ার্কিং", desc: "পরিবার ও আত্মীয়দের সাথে স্বয়ংক্রিয় সংযোগ।", icon: "🤝" },
                { title: "নিরাপদ পরিচয়", desc: "এনআইডি ও কর্পোরেট ভেরিফাইড প্রোফাইল।", icon: "🆔" },
                { title: "লোকাল সার্ভিস", desc: "আপনার এলাকার প্রয়োজনীয় সব সেবা এক জায়গায়।", icon: "📍" }
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

        {/* --- RIGHT SIDE: FORMS --- */}
        <div className="flex flex-col h-full bg-white">
          <div className="text-center pt-10 pb-4">
            <Link href="/" className="text-3xl font-bold text-blue-600 tracking-tight">
              Ama<span className="text-gray-900">root</span>
            </Link>
            <p className="mt-1 text-gray-400 text-xs font-medium uppercase tracking-widest">আমার শেকড়,আমার পরিচয়</p>
          </div>

          <div className="flex px-8 mt-4">
            <div className="flex w-full bg-gray-100 p-1 rounded-2xl">
              <button
                onClick={() => { setActiveTab('login'); setError(null); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                লগইন
              </button>
              <button
                onClick={() => { setActiveTab('signup'); setError(null); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                নিবন্ধন
              </button>
            </div>
          </div>

          <div className="p-8 lg:px-12 py-6 flex-grow overflow-y-auto max-h-[600px]">
            {/* ইন-লাইন এরর মেসেজ */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">ফোন নম্বর</label>
                  <input name="phone" type="tel" placeholder="01XXXXXXXXX" className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all" required />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">পাসওয়ার্ড</label>
                    <Link href="#" className="text-xs text-blue-600 font-bold hover:underline">ভুলে গেছেন?</Link>
                  </div>
                  <input name="password" type="password" placeholder="••••••••" className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all" required />
                </div>
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 transition duration-150 font-bold shadow-xl shadow-blue-100 mt-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {loading ? "প্রবেশ করা হচ্ছে..." : "প্রবেশ করুন"}
                </button>
              </form>
            ) : (
              <form action={handleSignup} className="space-y-4">
                <div className="flex gap-2 mb-2">
                  <button type="button" onClick={() => setUserType('individual')} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${userType === 'individual' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    ইন্ডিভিজুয়াল
                  </button>
                  <button type="button" onClick={() => setUserType('company')} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${userType === 'company' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    কর্পোরেট
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{userType === 'individual' ? 'আপনার পুরো নাম' : 'কোম্পানির নাম'}</label>
                  <input name="name" type="text" placeholder={userType === 'individual' ? 'রহিম উদ্দিন' : 'কোম্পানির নাম লিখুন'} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-600" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">ফোন নম্বর</label>
                    <input name="phone" type="tel" placeholder="017XXXXXXXX" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-600" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">ইমেইল</label>
                    <input name="email" type="email" placeholder="email@example.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-600" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">পাসওয়ার্ড</label>
                  <input name="password" type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-600" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{userType === 'individual' ? 'NID নম্বর' : 'BIN/TIN নম্বর'}</label>
                  <input name="nid_bin" type="text" placeholder="..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-600" />
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 transition duration-150 font-bold shadow-lg mt-2 disabled:bg-green-300"
                >
                  {loading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন সম্পন্ন করুন"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div> 
    </div>
  );
}