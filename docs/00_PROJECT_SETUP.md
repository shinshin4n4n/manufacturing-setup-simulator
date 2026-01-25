# プロジェクトセットアップガイド

## プロジェクト概要

製造業向けの段取り時間最適化シミュレーションゲーム。プレイヤーは製造現場の段取り作業を効率化し、生産性を向上させることを目指します。

### コンセプト
- リアルタイムでの段取り時間の可視化
- 様々な製品の切り替え（段取り替え）をシミュレート
- 段取り時間削減によるコスト削減効果を学習
- ゲーム感覚で製造現場のカイゼンを体験

### 主な機能
1. 段取りシミュレーション（基本操作、時間計測）
2. 複数製品の管理と切り替え
3. スコアリングとランキングシステム
4. ユーザー認証とプロフィール管理
5. チュートリアルとヘルプシステム

---

## 技術スタック

### フロントエンド
- **Next.js 14** (App Router)
  - React Server Components対応
  - 最新のルーティングシステム
  - 組み込みの最適化機能
- **TypeScript**
  - 型安全な開発環境
  - エディタの補完機能
- **TailwindCSS**
  - ユーティリティファーストのCSS
  - レスポンシブデザイン対応

### バックエンド
- **Prisma**
  - 型安全なORMライブラリ
  - マイグレーション管理
  - データモデル定義
- **Supabase (PostgreSQL)**
  - マネージドPostgreSQLデータベース
  - 認証機能（Supabase Auth）
  - リアルタイム機能（オプション）

### 状態管理
- **Zustand**
  - 軽量でシンプルな状態管理
  - TypeScript完全対応
  - React Hooksベース

### デプロイ
- **Vercel**
  - Next.jsに最適化
  - 自動デプロイ
  - エッジネットワーク対応

---

## 環境準備

### 前提条件
- Node.js 18.x 以上
- npm または yarn
- Git
- Supabaseアカウント
- Vercelアカウント（デプロイ用）

### 1. Node.jsのインストール

```powershell
# Node.jsのバージョン確認
node --version
npm --version

# 推奨: Node.js 18.x または 20.x
```

### 2. プロジェクトの作成

```powershell
# Next.jsプロジェクトの作成
npx create-next-app@latest manufacturing-setup-simulator

# オプション選択
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias? … No

# プロジェクトディレクトリに移動
cd manufacturing-setup-simulator
```

### 3. 必要なパッケージのインストール

```powershell
# Prismaのインストール
npm install prisma @prisma/client

# Zustandのインストール
npm install zustand

# Supabase関連
npm install @supabase/supabase-js

# その他のユーティリティ
npm install date-fns
npm install clsx
npm install react-hot-toast

# 開発用依存関係
npm install -D @types/node
```

### 4. Prismaのセットアップ

```powershell
# Prisma初期化
npx prisma init

# .envファイルが作成されるので、Supabaseの接続情報を設定
# DATABASE_URL="postgresql://..."
```

### 5. Supabaseのセットアップ

1. [Supabase](https://supabase.com)にアクセス
2. 新しいプロジェクトを作成
3. Database接続情報を取得
4. `.env.local`ファイルに以下を追加:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

### 6. Gitリポジトリの初期化

```powershell
# Gitリポジトリ初期化
git init

# .gitignoreの確認（自動生成されている）
# node_modules, .env*, .next などが含まれていることを確認

# 初回コミット
git add .
git commit -m "Initial commit: Next.js 14 + TypeScript + TailwindCSS setup"

# GitHubリポジトリ作成後
git remote add origin https://github.com/[YOUR-USERNAME]/manufacturing-setup-simulator.git
git branch -M main
git push -u origin main
```

---

## プロジェクト構造

```
manufacturing-setup-simulator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # トップページ
│   │   ├── game/              # ゲーム画面
│   │   ├── profile/           # プロフィール
│   │   └── api/               # APIルート
│   ├── components/            # Reactコンポーネント
│   │   ├── ui/               # 共通UIコンポーネント
│   │   ├── game/             # ゲーム関連コンポーネント
│   │   └── layout/           # レイアウトコンポーネント
│   ├── lib/                   # ユーティリティ関数
│   │   ├── prisma.ts         # Prismaクライアント
│   │   ├── supabase.ts       # Supabaseクライアント
│   │   └── utils.ts          # 汎用関数
│   ├── store/                 # Zustand状態管理
│   │   ├── gameStore.ts      # ゲーム状態
│   │   └── userStore.ts      # ユーザー状態
│   └── types/                 # TypeScript型定義
├── prisma/
│   ├── schema.prisma         # データベーススキーマ
│   └── migrations/           # マイグレーションファイル
├── public/                    # 静的ファイル
├── docs/                      # プロジェクトドキュメント
├── .env.local                 # 環境変数（Git管理外）
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 開発フロー

### 1. ブランチ戦略

```
main (本番)
  └── develop (開発)
       └── feature/issue-番号-機能名 (機能開発)
```

### 2. イシュー駆動開発

1. GitHub Issuesで課題を作成
2. イシュー番号に対応するブランチを作成
3. 機能開発とテスト
4. プルリクエスト作成
5. レビューとマージ

### 3. Claude CLIの活用

```powershell
# Claude CLIで作業開始
claude code

# イシューに関する質問
"Issue #1の実装方法を教えてください"

# コード生成
"Prismaスキーマを作成してください"
```

---

## 次のステップ

1. [開発ガイド](./01_DEVELOPMENT_GUIDE.md)を確認
2. Phase 1から順番に開発を進める
3. 各Issueごとにブランチを作成して開発
4. [PowerShellガイド](./02_POWERSHELL_GUIDE.md)で頻出コマンドを確認

---

## トラブルシューティング

### Prismaの接続エラー

```powershell
# Prismaクライアントの再生成
npx prisma generate

# データベース接続の確認
npx prisma db push
```

### Next.jsのビルドエラー

```powershell
# キャッシュのクリア
rm -rf .next
npm run build
```

### 環境変数が読み込まれない

- `.env.local`ファイルが正しい場所にあるか確認
- サーバーを再起動（環境変数の変更後は必須）
- `NEXT_PUBLIC_`プレフィックスが必要かどうか確認

---

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
