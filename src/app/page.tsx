'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimationControls, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/Layout';

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const timer = setInterval(() => {
      start += Math.ceil(end / (duration * 60));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="font-mono-display font-bold text-cyan-400">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Grid background animation component
const GridBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-dots opacity-40" />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <Layout>
      <div className="bg-slate-950 text-slate-100 grain">
        {/* Hero Section with dramatic entrance */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
          <GridBackground />

          {/* Floating geometric elements */}
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 border-2 border-cyan-500/20 rotate-45"
            animate={{
              y: [0, -20, 0],
              rotate: [45, 55, 45],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-24 h-24 border-2 border-orange-500/20"
            animate={{
              y: [0, 20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />

          <motion.div
            className="max-w-6xl mx-auto text-center relative z-10"
            style={{ y: y1, opacity }}
          >
            {/* Technical label */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-2 h-2 bg-cyan-400 animate-pulse-glow" />
              <span className="text-cyan-400 text-sm font-mono-display uppercase tracking-wider">
                Manufacturing Optimization System
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-mono-display font-extrabold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block text-slate-200">OPTIMIZE</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                SETUP TIME
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-xl sm:text-2xl md:text-3xl text-slate-400 mb-12 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              段取り替え最適化シミュレーター
              <br />
              <span className="text-orange-400 font-mono-display text-lg">
                生産効率を極限まで高めろ。
              </span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                onClick={() => router.push('/game')}
                className="group relative px-8 py-4 bg-cyan-500 text-slate-950 font-bold text-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative z-10 font-mono-display flex items-center gap-2">
                  <span className="text-2xl">▶</span>
                  START SIMULATION
                </span>
              </motion.button>

              <motion.button
                onClick={() => router.push('/ranking')}
                className="px-8 py-4 border-2 border-slate-600 text-slate-300 font-bold text-lg hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-mono-display flex items-center gap-2">
                  RANKINGS
                  <span className="text-orange-400">→</span>
                </span>
              </motion.button>
            </motion.div>

            {/* Live metrics */}
            <motion.div
              className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {[
                { label: 'SIMULATIONS', value: 1247, suffix: '+' },
                { label: 'AVG EFFICIENCY', value: 87, suffix: '%' },
                { label: 'OPTIMAL ROUTES', value: 342, suffix: '' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="border border-slate-700 bg-slate-900/50 backdrop-blur-sm p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-slate-500 font-mono-display tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 bg-cyan-400 rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section with technical cards */}
        <section className="relative py-24 px-4 bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-1 border border-orange-500/30 bg-orange-500/5 mb-4">
                <span className="text-orange-400 text-sm font-mono-display uppercase tracking-wider">
                  Features
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-mono-display font-bold text-slate-100 mb-4">
                SYSTEM CAPABILITIES
              </h2>
              <p className="text-slate-400 text-lg">3つの最適化アプローチ</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: '⚡',
                  title: 'ALGORITHM',
                  subtitle: '動的計画法',
                  description: 'ビットDP方式で全5!通りの順列を効率的に探索。O(n²×2ⁿ)の最適化アルゴリズム。',
                  accent: 'cyan',
                },
                {
                  icon: '🎯',
                  title: 'PRECISION',
                  subtitle: '高精度評価',
                  description: '段取り時間を1分単位で計算。最適解との差異を%で表示し、S～Dランクで評価。',
                  accent: 'orange',
                },
                {
                  icon: '📊',
                  title: 'ANALYTICS',
                  subtitle: 'リアルタイム分析',
                  description: 'ドラッグ操作に連動して段取り時間を即時計算。視覚的フィードバックで学習効果を向上。',
                  accent: 'cyan',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative border-2 border-slate-700 bg-slate-850 p-8 h-full overflow-hidden group-hover:border-cyan-500/50 transition-all duration-300">
                    {/* Corner accent */}
                    <div className={`absolute top-0 right-0 w-16 h-16 bg-${feature.accent}-500/10 border-l-2 border-b-2 border-${feature.accent}-500/30`} />

                    <div className="text-5xl mb-6">{feature.icon}</div>
                    <h3 className="font-mono-display font-bold text-2xl mb-2 text-slate-100">
                      {feature.title}
                    </h3>
                    <div className={`text-${feature.accent}-400 text-sm font-mono-display mb-4 tracking-wide`}>
                      {feature.subtitle}
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Hover effect line */}
                    <motion.div
                      className={`absolute bottom-0 left-0 h-1 bg-${feature.accent}-500`}
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Play Section - Technical steps */}
        <section className="relative py-24 px-4 bg-slate-950">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-1 border border-cyan-500/30 bg-cyan-500/5 mb-4">
                <span className="text-cyan-400 text-sm font-mono-display uppercase tracking-wider">
                  How to Play
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-mono-display font-bold text-slate-100 mb-4">
                OPERATION PROTOCOL
              </h2>
              <p className="text-slate-400 text-lg">3ステップで最適化を実行</p>
            </motion.div>

            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'EQUIPMENT ANALYSIS',
                  description: '5つの設備（A：プレス機、B：旋盤、C：フライス盤、D：研削盤、E：検査装置）の段取り時間マトリクスを確認。',
                  icon: '📋',
                },
                {
                  step: '02',
                  title: 'SEQUENCE OPTIMIZATION',
                  description: 'ドラッグ&ドロップで設備を配置。各配置で段取り時間がリアルタイム計算され、累積時間が表示される。',
                  icon: '🔄',
                },
                {
                  step: '03',
                  title: 'PERFORMANCE EVALUATION',
                  description: '全設備配置後、最適解との比較でスコアを算出。S～Dランクで評価し、改善提案を表示。',
                  icon: '✓',
                },
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  className="flex gap-6 items-start"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 border-2 border-cyan-500 bg-cyan-500/10 flex items-center justify-center">
                      <span className="font-mono-display font-bold text-2xl text-cyan-400">
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-mono-display font-bold text-xl text-slate-100 mb-2 flex items-center gap-3">
                      <span className="text-2xl">{step.icon}</span>
                      {step.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Visual separator */}
            <motion.div
              className="mt-16 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
          </div>
        </section>

        {/* Stats Section with industrial metrics */}
        <section className="relative py-24 px-4 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 grid-dots opacity-20" />

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-1 border border-orange-500/30 bg-orange-500/5 mb-4">
                <span className="text-orange-400 text-sm font-mono-display uppercase tracking-wider">
                  Performance Metrics
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-mono-display font-bold text-slate-100">
                SYSTEM STATISTICS
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'TOTAL PLAYS', value: 1247, unit: 'RUNS' },
                { label: 'AVG SCORE', value: 87, unit: '%' },
                { label: 'S RANK', value: 23, unit: 'USERS' },
                { label: 'BEST TIME', value: 108, unit: 'MIN' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="relative border-2 border-slate-700 bg-slate-850 p-6 text-center overflow-hidden group hover:border-cyan-500/50 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div className="relative z-10">
                    <div className="text-4xl md:text-5xl font-mono-display font-bold text-cyan-400 mb-2">
                      <AnimatedCounter value={stat.value} duration={1.5} />
                    </div>
                    <div className="text-xs text-slate-500 font-mono-display mb-1">
                      {stat.unit}
                    </div>
                    <div className="text-xs text-slate-600 font-mono-display tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-32 px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <motion.div
            className="max-w-4xl mx-auto text-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-mono-display font-bold text-slate-100 mb-6">
              READY TO
              <span className="block text-cyan-400 mt-2">OPTIMIZE?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              製造現場の段取り最適化を体験し、
              <br />
              生産効率向上のスキルを磨こう。
            </p>

            <motion.button
              onClick={() => router.push('/game')}
              className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-bold text-xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-700"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 font-mono-display flex items-center gap-3">
                <span className="text-3xl">▶</span>
                START NOW
              </span>
            </motion.button>

            {/* Decorative elements */}
            <div className="mt-16 flex justify-center gap-12">
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="text-sm text-slate-500 font-mono-display">FAST</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-orange-500/30 bg-orange-500/5 flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-sm text-slate-500 font-mono-display">PRECISE</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center mb-2 mx-auto">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="text-sm text-slate-500 font-mono-display">OPTIMAL</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-mono-display font-bold mb-4 text-cyan-400">
                  MANUFACTURING SETUP
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  段取り時間最適化を学べる
                  <br />
                  教育的シミュレーションシステム
                </p>
              </div>
              <div>
                <h4 className="text-sm font-mono-display font-semibold mb-4 text-slate-400 uppercase tracking-wider">
                  Technology Stack
                </h4>
                <ul className="space-y-2 text-slate-600 text-sm font-mono-display">
                  <li>→ Next.js 14 App Router</li>
                  <li>→ TypeScript</li>
                  <li>→ Supabase PostgreSQL</li>
                  <li>→ Prisma ORM</li>
                  <li>→ Framer Motion</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-mono-display font-semibold mb-4 text-slate-400 uppercase tracking-wider">
                  Resources
                </h4>
                <a
                  href="https://github.com/shinshin4n4n/manufacturing-setup-simulator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-cyan-400 transition-colors text-sm font-mono-display flex items-center gap-2"
                >
                  → GitHub Repository
                </a>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-800 text-center">
              <p className="text-slate-600 text-sm font-mono-display">
                © 2024 MANUFACTURING SETUP SIMULATOR — ALL RIGHTS RESERVED
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
