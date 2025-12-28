import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Googleフォント「Inter」をインポート
import "./globals.css";

// フォントの設定
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fumifumi",
  description: "会話を記録して、次の日曜を踏み固める。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* bodyタグにフォントのクラス名を適用 */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}