import Link from 'next/link';

const features = [
  { title: "Identity Hub", desc: "Your unique profile verified by NID and phone.", icon: "🆔" },
  { title: "Auto-Networking", desc: "Automatically connect with family and friends.", icon: "🤝" },
  { title: "Local Discovery", desc: "Find skills and services near you.", icon: "📍" },
  { title: "Root Level Data", desc: "Accurate information from your community.", icon: "🌱" },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
            Discover Your <span className="text-blue-600">Root</span>, Build Your Network.
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Amaroot is Bangladesh&apos;s first identity-based auto-networking ecosystem. Reconnect, discover, and thrive within your true community.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-150 font-semibold shadow-lg text-lg"
            >
              Get Started
            </Link>
            <Link href="#" className="text-lg font-semibold text-gray-900 flex items-center gap-1">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">Why Amaroot?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}