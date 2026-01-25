import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "製造業向け段取りシミュレーションゲーム",
  description: "段取り時間最適化を学ぶシミュレーションゲーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
