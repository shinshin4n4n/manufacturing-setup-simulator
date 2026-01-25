'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/Layout';
import { Button, Card } from '@/components/ui';

export default function HomePage() {
  const router = useRouter();

  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              製造業向け<br />
              段取りシミュレーションゲーム
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              段取り替えを最適化して、生産効率を高めよう！
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/game')}
                className="text-lg px-8 py-4"
              >
                🎮 ゲームを始める
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/ranking')}
                className="text-lg px-8 py-4"
              >
                🏆 ランキングを見る
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Game Rules Section */}
        <section className="py-12 sm:py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              ゲームルール
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                title="🎯 目的"
                description="5つの設備を最適な順序で配置し、段取り時間を最小化します"
              />
              <Card
                title="🖱️ 遊び方"
                description="ドラッグ&ドロップで設備を配置エリアに配置していきます"
              />
              <Card
                title="⏱️ スコアリング"
                description="段取り時間が短いほど高スコア。最適解に近いほど高評価！"
              />
              <Card
                title="🏅 ランク"
                description="S（100%）、A（95-99%）、B（85-94%）、C（75-84%）、D（74%以下）の5段階評価"
              />
            </div>
          </div>
        </section>

        {/* What is Setup Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-100 to-indigo-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              段取りとは？
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  製造現場での段取り替え
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  段取り替えとは、製造ラインで異なる製品を生産する際に、設備や金型を変更する作業のことです。
                  この時間を短縮することで、生産効率が大幅に向上します。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  トヨタ生産方式では「段取り替え時間の短縮」が重要な改善テーマの一つとされています。
                </p>
              </Card>
              <Card className="bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  段取り時間短縮のメリット
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>
                      <strong>生産性向上：</strong>より多くの製品を生産できます
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>
                      <strong>コスト削減：</strong>無駄な時間とコストを削減
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>
                      <strong>納期短縮：</strong>顧客への納品が早くなります
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>
                      <strong>柔軟性向上：</strong>多品種少量生産に対応可能
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* How to Play Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              プレイ方法
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    設備を確認
                  </h3>
                  <p className="text-gray-700">
                    左側に表示される5つの設備（A：プレス機、B：旋盤、C：フライス盤、D：研削盤、E：検査装置）を確認します。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    ドラッグ&ドロップ
                  </h3>
                  <p className="text-gray-700">
                    設備カードをドラッグして、右側の配置エリアにドロップします。順序を考えて配置しましょう。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    時間を確認
                  </h3>
                  <p className="text-gray-700">
                    配置するたびに段取り時間が計算されます。画面下部で総段取り時間を確認できます。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    完了してスコア確認
                  </h3>
                  <p className="text-gray-700">
                    5つすべて配置したら「完了」ボタンを押します。スコアとランクが表示されます！
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              さあ、最適な段取りを見つけよう！
            </h2>
            <p className="text-xl mb-8">
              あなたは最短時間で段取り替えを完了できますか？
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/game')}
              className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-4"
            >
              今すぐプレイ
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">製造業向け段取りシミュレーター</h3>
                <p className="text-gray-400">
                  段取り時間の最適化を学べる教育的シミュレーションゲーム
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">使用技術</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Next.js 14 App Router</li>
                  <li>TypeScript</li>
                  <li>Supabase (PostgreSQL)</li>
                  <li>Prisma ORM</li>
                  <li>TailwindCSS</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">リンク</h4>
                <ul className="space-y-2">
                  <a
                    href="https://github.com/shinshin4n4n/manufacturing-setup-simulator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors block"
                  >
                    GitHub Repository
                  </a>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2024 Manufacturing Setup Simulator. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
