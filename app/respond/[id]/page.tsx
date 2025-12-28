"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Check, HelpCircle, X, Send, Loader2 } from "lucide-react";

export default function RespondPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({ a: "ok", b: "ok", c: "ok" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. イベント情報の取得
  useEffect(() => {
    async function fetchEvent() {
      const { data } = await supabase.from("events").select("*").eq("id", id).single();
      setEvent(data);
      setLoading(false);
    }
    if (id) fetchEvent();
  }, [id]);

  // 2. 回答の送信
  const handleSubmit = async () => {
    if (!name) return alert("名前を入力してください");
    setSubmitting(true);

    try {
      const { error } = await supabase.from("responses").insert([
        {
          event_id: id,
          user_name: name,
          choice_a: answers.a,
          choice_b: answers.b,
          choice_c: answers.c,
        },
      ]);

      if (error) throw error;
      
      alert("回答を送信しました！LINEグループへの通知は次のステップで実装します。");
    } catch (err) {
      console.error(err);
      alert("送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
  if (!event) return <div className="text-center p-20">イベントが見つかりません</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex justify-center items-start">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-xl p-8 space-y-8">
        <h1 className="text-2xl font-black text-center">{event.title}</h1>
        
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Your Name</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前を入力"
            className="w-full mt-1 p-4 bg-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="space-y-4">
          {[
            { key: "a", label: "案A", date: event.date_a },
            { key: "b", label: "案B", date: event.date_b },
            { key: "c", label: "案C", date: event.date_c },
          ].map((item) => (
            <div key={item.key} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex justify-between items-center">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</div>
                <div className="font-black text-lg">{item.date}</div>
              </div>
              <div className="flex gap-2">
                {[
                  { val: "ok", icon: Check, color: "bg-green-500" },
                  { val: "maybe", icon: HelpCircle, color: "bg-orange-400" },
                  { val: "ng", icon: X, color: "bg-red-500" },
                ].map((btn) => (
                  <button
                    key={btn.val}
                    onClick={() => setAnswers({ ...answers, [item.key]: btn.val })}
                    className={`p-3 rounded-xl transition-all ${answers[item.key] === btn.val ? btn.color + " text-white scale-110 shadow-md" : "bg-white text-slate-300"}`}
                  >
                    <btn.icon size={20} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="animate-spin" /> : <Send size={24} />}
          回答を送信する
        </button>
      </div>
    </main>
  );
}