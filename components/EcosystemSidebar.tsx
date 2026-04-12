import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Ecosystem() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-3xl text-white shadow-xl">
        <h3 className="text-lg font-bold mb-4">আমাদের ইকোসিস্টেম</h3>
        <div className="space-y-4">
          
          {/* ১. Pouchhai Link */}
          <Link 
            href="https://pouchhai.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-lg">📦</div>
              <div>
                <p className="text-sm font-bold">Pouchhai</p>
                <p className="text-[10px] opacity-60">
                  লজিস্টিক ও মুভিং সার্ভিস
                </p>
              </div>
            </div>
            <ArrowRight size={14} />
          </Link>

          {/* ২. eUkil Link */}
          <Link 
            href="https://eukil.vercel.app/" // আপনার ই-উখিল এর সঠিক লিঙ্কটি এখানে দিন
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-2 rounded-lg">⚖️</div>
              <div>
                <p className="text-sm font-bold">eUkil</p>
                <p className="text-[10px] opacity-60">
                  লিগ্যাল সাপোর্ট ও রিসার্চ
                </p>
              </div>
            </div>
            <ArrowRight size={14} />
          </Link>

        </div>
      </div>
    </div>
  );
}