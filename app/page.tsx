"use client";

import { useState, useEffect } from "react";
import { Calendar, MessageCircle, Share2, Rocket } from "lucide-react";

export default function Home() {
  const [dates, setDates] = useState({ a: "", b: "", c: "" });

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const daysUntilNextSunday = (7 - dayOfWeek) % 7;
    const nextSun = new Date(today);
    nextSun.setDate(today.getDate() + daysUntilNextSunday);

    const format = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}(日)`;

    // 2週後, 3週後, 4週後を計算
    const sun2w = new Date(nextSun); sun2w.setDate(nextSun.getDate() + 14);
    const sun3w = new Date(nextSun); sun3w.setDate(nextSun.getDate() + 21);
    const sun4w = new Date(nextSun); sun4w.setDate(nextSun.getDate() + 28);

    setDates({ a: format(sun2w), b: format(sun3w), c: format(sun4w) });
  }, []);

  const handleLineShare = () => {
    const message = 
      `📅 【Fumifumi 予定調整】\n\n` +
      `次回の候補日です。どれが良いか教えてください！\n\n` +
      `案A: ${dates.a}\n` +
      `案B: ${dates.b}\n` +
      `案C: ${dates.c}\n\n` +
      `※リプライかスタンプで教えてね！`;

    const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(message)}`;
    window.open(lineUrl, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 flex items-center justify-center font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 space-y-8 border border-slate-100">
        
        <div className="text-center space-y-3">
          <div className="inline-block p-3 bg-green-50 rounded-2xl mb-2">
            <Rocket className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Fumifumi</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Deployment Edition</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 shadow-inner">
            <h2 className="flex items-center gap-2 text-slate-400 font-bold text-[10px] mb-4 uppercase tracking-widest">
              <Calendar className="w-3 h-3" /> Upcoming Sundays
            </h2>
            <div className="space-y-2">
              {[
                { label: "案A (2週後)", date: dates.a, color: "text-indigo-500" },
                { label: "案B (3週後)", date: dates.b, color: "text-purple-500" },
                { label: "案C (4週後)", date: dates.c, color: "text-pink-500" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                  <span className="text-slate-400 font-bold text-[10px]">{item.label}</span>
                  <span className={`text-xl font-black ${item.color}`}>{item.date}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleLineShare}
            className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white py-6 rounded-3xl font-black text-xl transition-all shadow-[0_12px_24px_rgba(6,199,85,0.25)] active:scale-95 flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-7 h-7 fill-current" />
            LINEで送る
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          Build & Ready for Netlify
        </p>
      </div>
    </main>
  );
}