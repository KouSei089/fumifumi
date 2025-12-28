"use client";

import { useState } from "react";
import { Upload, Calendar, CheckCircle, FileAudio, Loader2 } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");

  // --- ドラッグ＆ドロップの処理 ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // --- 送信ボタンの処理（Pythonバックエンドと通信） ---
  const handleProcess = async () => {
    if (!file) return;
    
    setStatus("uploading");

    try {
      // 1. 送信データの準備（FormDataを作成）
      const formData = new FormData();
      formData.append("file", file); // keyは "file" にする（Python側と合わせる）

      // 2. Pythonへ送信
      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
        // ※ headerに 'Content-Type': 'multipart/form-data' は書かないでください
        // ブラウザが自動でboundary設定を行うため、書くと逆にエラーになります
      });
      
      const data = await res.json();
      console.log("Pythonからの返事:", data);

      if (res.ok) {
        setStatus("done");
      } else {
        alert("アップロードに失敗しました");
        setStatus("idle");
      }
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました。Pythonサーバーを確認してください。");
      setStatus("idle");
    }
  };

  return (
    // 背景: リッチなグラデーション
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 text-slate-800 p-8 flex items-center justify-center font-sans">
      <div className="max-w-2xl w-full space-y-8">
        
        {/* ヘッダー */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight drop-shadow-sm">
            Fumifumi
          </h1>
          <p className="text-slate-500 font-medium">
            会話を記録して、次の日曜を踏み固める。
          </p>
        </div>

        {/* メインカード（3D感を強化） */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] p-8 space-y-8 border border-white/40 ring-1 ring-slate-900/5 relative overflow-hidden">
          
          {/* 背景の装飾（光の反射） */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-50"></div>

          {/* 1. 次回予定エリア */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 border border-indigo-100/50 shadow-inner">
            <h2 className="flex items-center gap-2 text-indigo-900 font-bold mb-4">
              <Calendar className="w-5 h-5 text-indigo-500" />
              次回の候補日（自動計算）
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* 日付カード */}
              <div className="bg-white p-4 rounded-xl text-center shadow-md border border-indigo-50 transition-transform hover:-translate-y-1">
                <span className="block text-xs font-bold text-indigo-400 mb-1">2週間後</span>
                <span className="text-2xl font-extrabold text-slate-700">11/05<span className="text-sm ml-1">(日)</span></span>
              </div>
              <div className="bg-white p-4 rounded-xl text-center shadow-md border border-indigo-50 transition-transform hover:-translate-y-1">
                <span className="block text-xs font-bold text-purple-400 mb-1">3週間後</span>
                <span className="text-2xl font-extrabold text-slate-700">11/12<span className="text-sm ml-1">(日)</span></span>
              </div>
            </div>
          </div>

          {/* 2. ファイルアップロードエリア */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-3 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group
              ${isDragging 
                ? "border-indigo-500 bg-indigo-50/50 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)] scale-[1.02]" 
                : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 hover:shadow-lg hover:-translate-y-0.5"
              }
              ${file ? "bg-indigo-50/30 border-solid border-indigo-300 shadow-md" : ""}
            `}
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileSelect}
              accept="audio/*"
            />
            
            {file ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="p-4 bg-indigo-100 rounded-full mb-3 shadow-sm">
                  <FileAudio className="w-10 h-10 text-indigo-600" />
                </div>
                <p className="font-bold text-lg text-slate-700 mb-1">{file.name}</p>
                <p className="text-sm font-medium text-indigo-400">{(file.size / 1024 / 1024).toFixed(2)} MB Ready</p>
              </div>
            ) : (
              <div className="flex flex-col items-center pointer-events-none transition-transform group-hover:scale-105">
                <div className="p-4 bg-slate-100 rounded-full mb-3 group-hover:bg-indigo-100 transition-colors shadow-sm">
                  <Upload className="w-10 h-10 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <p className="text-slate-700 font-bold text-lg mb-1">
                  ここに音声をドロップ
                </p>
                <p className="text-sm text-slate-400 font-medium">またはクリックして選択</p>
              </div>
            )}
          </div>

          {/* 3. アクションボタン */}
          <button
            onClick={handleProcess}
            disabled={!file || status === "uploading"}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2
              border-b-4 active:border-b-0 active:translate-y-[4px] relative
              ${!file 
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
                : status === "done"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-700 shadow-lg shadow-green-200/50"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-700 shadow-xl shadow-indigo-200/50 hover:-translate-y-0.5 hover:shadow-2xl"
              }
            `}
          >
            {status === "uploading" ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                処理中...
              </>
            ) : status === "done" ? (
              <>
                <CheckCircle className="w-6 h-6" />
                Discordに送信完了！
              </>
            ) : (
              "処理を開始する"
            )}
          </button>

        </div>
      </div>
    </main>
  );
}