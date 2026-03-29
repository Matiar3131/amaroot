import Link from 'next/link';

const features = [
  { 
    title: "আইডেন্টিটি হাব", 
    desc: "আপনার এনআইডি (NID) এবং ফোন নম্বর দ্বারা ভেরিফাইড একটি ইউনিক প্রোফাইল।", 
    icon: "🆔" 
  },
  { 
    title: "অটো-নেটওয়ার্কিং", 
    desc: "পরিবার, আত্মীয় এবং বন্ধুদের সাথে স্বয়ংক্রিয়ভাবে সংযুক্ত হওয়ার সুবিধা।", 
    icon: "🤝" 
  },
  { 
    title: "লোকাল ডিসকভারি", 
    desc: "আপনার এলাকার প্রয়োজনীয় দক্ষতা এবং সেবাগুলো খুব সহজেই খুঁজে নিন।", 
    icon: "📍" 
  },
  { 
    title: "রুট লেভেল ডেটা", 
    desc: "আপনার কমিউনিটি থেকে পাওয়া একদম সঠিক এবং নির্ভরযোগ্য তথ্য।", 
    icon: "🌱" 
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-slate-50 py-24 sm:py-32 relative overflow-hidden">
        {/* ব্যাকগ্রাউন্ড ডেকোরেশন */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-100/30 blur-[100px] rounded-full -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            খুঁজে নিন আপনার <span className="text-blue-600">শেকড়</span>, <br />
            গড়ে তুলুন নিজস্ব নেটওয়ার্ক।
          </h1>
          <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            আমার রুট (Amaroot) বাংলাদেশের প্রথম পরিচয়-ভিত্তিক অটো-নেটওয়ার্কিং ইকোসিস্টেম। 
            আপনার প্রকৃত কমিউনিটির সাথে পুনরায় যুক্ত হন এবং এগিয়ে যান আগামীর পথে।
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              href="/login?mode=signup"
              className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-xl shadow-blue-100 text-lg active:scale-95"
            >
              যাত্রা শুরু করুন
            </Link>
            <Link 
              href="/about" 
              className="text-lg font-bold text-gray-900 flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              আরও জানুন <span aria-hidden="true" className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">কেন আমার রুট ব্যবহার করবেন?</h2>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300"
            >
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer বা নিচের কোনো সেকশন চাইলে এখানে যোগ করতে পারেন */}
    </div>
  );
}