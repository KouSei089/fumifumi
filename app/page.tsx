"use client";

import { useState, useEffect } from "react";
import { Calendar, MessageCircle, Rocket, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase"; // 先ほど作ったlibを参照

export default function Home() {
  const [dates, setDates] = useState({ a: "", b: "", c: "" });
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const daysUntilNextSunday = (7 - dayOfWeek) % 7;
    const nextSun = new Date(today);
    nextSun.setDate(today.getDate() + daysUntilNextSunday);

    const format = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}(日)`;
    const sun2w = new Date(nextSun); sun2w.setDate(nextSun.getDate() + 14);
    const sun3w = new Date(nextSun); sun3w.setDate(nextSun.getDate() + 21);
    const sun4w = new Date(nextSun); sun4w.setDate(nextSun.getDate() + 28);

    setDates({ a: format(sun2w), b: format(sun3w), c: format(sun4w) });
  }, []);

  // --- イベント作成 & LINE共有 ---
  const handleCreateEvent = async () => {
    setStatus("uploading");
    try {
      // 1. Supabaseにイベントを保存
      const { data, error } = await supabase
        .from('events')
        .insert([
          { 
            title: "Fumifumi 次回調整", 
            date_a: dates.a, 
            date_b: dates.b, 
            date_c: dates.c 
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // 2. 回答用URLを生成 (Netlifyデプロイ後のURLに対応)
      const responseUrl = `${window.location.origin}/respond/${data.id}`;
      
      // 3. LINE共有メッセージの作成
      const message = 
        `📅 【Fumifumi 予定調整】\n` +
        `お疲れ様でした！次回の日程を以下のリンクから教えてください！\n\n` +
        `案A: ${dates.a}\n` +
        `案B: ${dates.b}\n` +
        `案C: ${dates.c}\n\n` +
        `回答URL:\n${responseUrl}`;

      const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(message)}`;
      window.open(lineUrl, "_blank");
      
      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました。Supabaseの設定を確認してください。");
      setStatus("idle");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 flex items-center justify-center font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-[48px] shadow-2xl p-10 space-y-8 border border-slate-100 relative overflow-hidden">
        <div className="text-center space-y-3">
          <div className="inline-block p-3 bg-green-50 rounded-2xl mb-2">
            <Rocket className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-900">Fumifumi</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Admin Panel</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100">
            <h2 className="text-slate-400 font-bold text-[10px] mb-4 uppercase tracking-widest">Calculated Dates</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                <span className="text-slate-400 text-[10px]">案A</span><span className="font-black">{dates.a}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                <span className="text-slate-400 text-[10px]">案B</span><span className="font-black">{dates.b}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                <span className="text-slate-400 text-[10px]">案C</span><span className="font-black">{dates.c}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateEvent}
            disabled={status === "uploading"}
            className="w-full bg-[#06C755] text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-50"
          >
            {status === "uploading" ? <Loader2 className="animate-spin" /> : <MessageCircle className="w-7 h-7 fill-current" />}
            調整を開始してLINEへ
          </button>
        </div>
      </div>
    </main>
  );
}