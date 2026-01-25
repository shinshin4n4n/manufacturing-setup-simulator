export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="text-center space-y-8 p-8">
        <h1 className="text-5xl font-bold text-gray-800">
          製造業向け段取りシミュレーションゲーム
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          段取り時間の最適化を学ぶシミュレーションゲーム
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <a
            href="/game"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ゲームを始める
          </a>
          <a
            href="/ranking"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ランキング
          </a>
        </div>
      </main>
      <footer className="mt-16 text-gray-500 text-sm">
        <p>Next.js 14 + TypeScript + TailwindCSS</p>
      </footer>
    </div>
  );
}
