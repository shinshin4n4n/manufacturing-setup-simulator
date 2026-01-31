# 製造業向け段取りシミュレーションゲーム

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://manufacturing-setup-simulator.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

製造現場の段取り時間最適化を学べる教育的シミュレーションゲームです。動的計画法（ビットDP）を用いた最適化アルゴリズムにより、プレイヤーは段取り替え作業の効率化を体験できます。

## 🎯 デモ

**本番環境:** https://manufacturing-setup-simulator.vercel.app

**リポジトリ:** https://github.com/shinshin4n4n/manufacturing-setup-simulator

## 📌 プロジェクト概要

このゲームは、製造業における「段取り替え」の最適化を学習するためのシミュレーターです。5つの設備（プレス機、旋盤、フライス盤、研削盤、検査装置）を最適な順序で配置し、段取り時間を最小化することを目指します。

### 段取り替えとは？

製造ラインで異なる製品を生産する際に、設備や金型を変更する作業のことです。この時間を短縮することで、生産効率が大幅に向上します（トヨタ生産方式でも重要な改善テーマとされています）。

## ✨ 実装機能

### ゲーム機能
- **ドラッグ&ドロップ操作**: 直感的な設備配置（@dnd-kit使用）
- **リアルタイム計算**: 配置ごとに段取り時間を即時表示
- **最適化アルゴリズム**: ビットDP方式による最適解の自動計算（O(n²×2ⁿ)）
- **3段階ヒント機能**:
  - レベル1: 一般的なアドバイス
  - レベル2: 次に配置すべき設備の候補
  - レベル3: 最適な次の設備を明示
- **タイマー機能**: プレイ時間の計測
- **音声効果**: ドロップ音、完了音、スコア音（ミュート切替可能）

### スコアリング & ランキング
- **S～Dランク評価**: 最適解との比較で5段階評価
  - S: 100% (完璧)
  - A: 95-99%
  - B: 85-94%
  - C: 75-84%
  - D: 74%以下
- **グローバルランキング**: 全プレイヤーのスコアをランキング表示
- **詳細な結果表示**: 総段取り時間、最適時間、スコア、使用したヒント数

### UI/UX
- **モダンなダークテーマ**: グラデーション、アニメーション効果
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **エラーハンドリング**: リトライ機能付きエラートースト
- **Loading状態**: 非同期処理中のローディング表示

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 14.2** - App Router、Server Components
- **React 18.3** - UI構築
- **TypeScript 5.7** - 型安全性
- **TailwindCSS 3.4** - スタイリング
- **Framer Motion 12.29** - アニメーション
- **@dnd-kit 6.3** - ドラッグ&ドロップ機能
- **React Hot Toast 2.6** - トースト通知

### バックエンド & データベース
- **Next.js API Routes** - RESTful API
- **Prisma 5.22** - ORM（型安全なデータベースアクセス）
- **PostgreSQL** - リレーショナルデータベース（Supabase）

### 状態管理
- **Zustand 5.0** - 軽量で直感的なグローバル状態管理

### 開発ツール
- **ESLint 8.57** - コード品質チェック
- **PostCSS 8.4** - CSS処理
- **Autoprefixer** - ベンダープレフィックス自動付与
- **tsx** - TypeScript実行環境

### デプロイ & インフラ
- **Vercel** - ホスティング & CI/CD
- **Supabase** - PostgreSQLデータベース

## 📊 開発統計

- **開発期間**: 2026年1月25日 〜 2026年1月31日（6日間）
- **コミット数**: 35
- **Issue数**: 18
- **Pull Request数**: 12
- **テストファイル**: 1（setupTimeOptimizer.test.ts）

## 🎮 使い方

### 1. ゲーム開始
トップページから「START SIMULATION」をクリック

### 2. 設備を配置
左側の設備リストから、右側の配置エリアにドラッグ&ドロップ

### 3. 段取り時間を確認
配置するたびに累積段取り時間が自動計算されて表示

### 4. ヒントの活用（任意）
困った時は3段階のヒント機能を使用可能（スコアに影響）

### 5. 完了してスコア確認
5つすべて配置したら「完了」ボタンを押してスコアとランクを確認

### 6. ランキングを見る
他のプレイヤーのスコアと比較してランキングをチェック

## 📁 プロジェクト構造

```
manufacturing-setup-simulator/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # APIエンドポイント
│   │   │   ├── game/
│   │   │   │   ├── calculate-time/  # 段取り時間計算API
│   │   │   │   ├── hint/            # ヒント取得API
│   │   │   │   ├── start/           # ゲーム開始API
│   │   │   │   └── submit/          # スコア送信API
│   │   │   └── score/
│   │   │       └── ranking/         # ランキング取得API
│   │   ├── game/                     # ゲーム画面
│   │   │   └── page.tsx
│   │   ├── ranking/                  # ランキング画面
│   │   │   └── page.tsx
│   │   ├── page.tsx                  # トップページ
│   │   ├── layout.tsx                # ルートレイアウト
│   │   └── globals.css               # グローバルスタイル
│   ├── components/                   # Reactコンポーネント
│   │   ├── game/                     # ゲーム関連
│   │   │   ├── DraggableEquipmentCard.tsx
│   │   │   ├── PlacementArea.tsx
│   │   │   ├── DroppableArea.tsx
│   │   │   ├── EquipmentCard.tsx
│   │   │   ├── EquipmentDragOverlay.tsx
│   │   │   ├── HintDisplay.tsx
│   │   │   ├── HintPanel.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   └── Timer.tsx
│   │   ├── ui/                       # 共通UIコンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── Modal.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── Layout.tsx
│   ├── lib/                          # ユーティリティ & ロジック
│   │   ├── db/
│   │   │   └── prisma.ts             # Prismaクライアント
│   │   ├── types/                    # TypeScript型定義
│   │   │   └── game.ts
│   │   └── utils/                    # 汎用関数
│   │       ├── setupTimeCalculator.ts  # 段取り時間計算
│   │       ├── setupTimeOptimizer.ts   # 最適化アルゴリズム
│   │       ├── optimalCache.ts         # 最適解キャッシュ
│   │       ├── soundEffects.ts         # 音声効果
│   │       ├── toast.ts                # トースト通知
│   │       └── __tests__/
│   │           └── setupTimeOptimizer.test.ts
│   └── store/                        # Zustand状態管理
│       └── gameStore.ts
├── prisma/
│   ├── schema.prisma                 # データベーススキーマ
│   └── seed.ts                       # シードデータ
├── docs/                             # ドキュメント
│   ├── design/                       # 設計ドキュメント
│   │   ├── DATABASE.md               # ER図、テーブル定義
│   │   ├── SCREENS.md                # 画面遷移図
│   │   ├── ARCHITECTURE.md           # システム構成
│   │   └── API.md                    # API仕様書
│   ├── development/                  # 開発ドキュメント
│   │   ├── SETUP.md                  # 環境構築手順
│   │   └── TESTING.md                # テスト戦略
│   └── deployment/                   # デプロイドキュメント
│       └── VERCEL.md                 # Vercelデプロイ手順
├── public/                           # 静的ファイル
├── .env.example                      # 環境変数テンプレート
├── .gitignore
├── next.config.mjs                   # Next.js設定
├── package.json
├── postcss.config.mjs                # PostCSS設定
├── tailwind.config.ts                # TailwindCSS設定
└── tsconfig.json                     # TypeScript設定
```

## 📚 ドキュメント

### 設計ドキュメント
- [データベース設計](./docs/design/DATABASE.md) - ER図、テーブル定義、リレーション
- [画面設計](./docs/design/SCREENS.md) - 画面遷移図、ワイヤーフレーム
- [システム構成](./docs/design/ARCHITECTURE.md) - 技術スタック、アーキテクチャ図
- [API仕様](./docs/design/API.md) - エンドポイント一覧、リクエスト/レスポンス

### 開発ドキュメント
- [環境構築](./docs/development/SETUP.md) - セットアップ手順、トラブルシューティング
- [テスト](./docs/development/TESTING.md) - テスト戦略、テストケース

### デプロイドキュメント
- [Vercelデプロイ](./docs/deployment/VERCEL.md) - デプロイ手順、環境変数設定

### 開発ガイド
- [プロジェクトセットアップ](./docs/00_PROJECT_SETUP.md)
- [開発ガイド](./docs/01_DEVELOPMENT_GUIDE.md)
- [PowerShellコマンドガイド](./docs/02_POWERSHELL_GUIDE.md)
- [Issue管理ガイド](./docs/03_ISSUE_MANAGEMENT.md)

## 🚀 開発プロセス

本プロジェクトはIssueベースの開発フローを採用しています:

1. **Issue作成** - 機能追加やバグ修正のタスクをIssueとして管理
2. **ブランチ作成** - `feature/issue-番号-機能名` または `fix/issue-番号-バグ名`
3. **機能開発** - コードの実装とテスト
4. **コミット** - 規約に従ったコミットメッセージ（`feat:`, `fix:`, `docs:` など）
5. **プルリクエスト作成** - レビュー依頼
6. **レビュー & マージ** - コードレビュー後にmasterへマージ

### コミットメッセージ規約

```
<type>: <subject>

<body>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Type:**
- `feat:` - 新機能
- `fix:` - バグ修正
- `docs:` - ドキュメント更新
- `style:` - コードフォーマット
- `refactor:` - リファクタリング
- `test:` - テスト追加・修正
- `chore:` - ビルド・設定変更

## 📝 セットアップ

### 前提条件

- Node.js 18.x 以上
- npm または yarn
- PostgreSQLデータベース（またはSupabaseアカウント）

### インストール手順

1. **リポジトリのクローン**

```bash
git clone https://github.com/shinshin4n4n/manufacturing-setup-simulator.git
cd manufacturing-setup-simulator
```

2. **依存関係のインストール**

```bash
npm install
# または
yarn install
```

3. **環境変数の設定**

`.env.example`を`.env.local`にコピーして、必要な環境変数を設定:

```bash
cp .env.example .env.local
```

`.env.local`を編集:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/manufacturing_db"
DIRECT_URL="postgresql://user:password@localhost:5432/manufacturing_db"

# Supabase (Optional)
# NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
# NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

4. **Prismaのセットアップ**

```bash
# Prismaクライアント生成（postinstallで自動実行されます）
npx prisma generate

# データベースマイグレーション
npx prisma migrate dev

# シードデータの投入
npm run db:seed
```

5. **開発サーバーの起動**

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 🧪 テスト

```bash
# テスト実行（Vitest）
npm run test

# テストカバレッジ
npm run test:coverage

# Prisma Studio（データベースGUI）
npx prisma studio
```

## 📦 使用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド（Prisma生成 + Next.jsビルド）
npm run build

# 本番サーバー起動
npm run start

# ESLint実行
npm run lint

# データベースシード
npm run db:seed

# Prisma Client生成（postinstallで自動実行）
npm run postinstall
```

## 🗄️ データベーススキーマ

### Equipment（設備）
- `id`: UUID（主キー）
- `name`: 設備名
- `code`: 設備コード（A, B, C, D, E）
- `description`: 説明

### SetupMatrix（段取り時間マトリクス）
- `id`: UUID（主キー）
- `fromEquipmentId`: 開始設備ID
- `toEquipmentId`: 終了設備ID
- `setupTime`: 段取り時間（分）
- `difficulty`: 難易度レベル

### GameSession（ゲームセッション）
- `id`: UUID（主キー）
- `playerName`: プレイヤー名
- `score`: スコア（0-100）
- `totalTime`: 総段取り時間（分）
- `difficulty`: 難易度
- `completedAt`: 完了日時

詳細は[データベース設計ドキュメント](./docs/design/DATABASE.md)を参照してください。

## 🔗 リンク

- **本番環境**: https://manufacturing-setup-simulator.vercel.app
- **リポジトリ**: https://github.com/shinshin4n4n/manufacturing-setup-simulator
- **Issue一覧**: https://github.com/shinshin4n4n/manufacturing-setup-simulator/issues
- **Pull Request一覧**: https://github.com/shinshin4n4n/manufacturing-setup-simulator/pulls

## 🤝 コントリビューション

コントリビューションを歓迎します！以下の手順に従ってください:

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 👤 開発者

**製造業向けシミュレーションプロジェクトチーム**

- GitHub: [@shinshin4n4n](https://github.com/shinshin4n4n)

---

## 🎓 学習リソース

### 段取り替えについて
- [トヨタ生産方式](https://global.toyota/jp/company/vision-and-philosophy/production-system/)
- [SMED（Single-Minute Exchange of Dies）](https://ja.wikipedia.org/wiki/SMED)

### 使用技術
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

<div align="center">

**Made with ❤️ and Claude Sonnet 4.5**

🚀 [デモを見る](https://manufacturing-setup-simulator.vercel.app) | 📖 [ドキュメント](./docs/) | 🐛 [バグ報告](https://github.com/shinshin4n4n/manufacturing-setup-simulator/issues)

</div>
