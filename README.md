# 製造業向け段取りシミュレーションゲーム

製造現場の段取り時間最適化を学ぶシミュレーションゲームです。プレイヤーは様々な製品の段取り作業を効率化し、生産性向上を目指します。

## 特徴

- リアルタイムでの段取り時間の可視化
- 様々な製品の切り替え（段取り替え）シミュレーション
- 段取り時間削減によるコスト削減効果の学習
- ゲーム感覚で製造現場のカイゼンを体験

## 技術スタック

### フロントエンド
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **React 18**

### バックエンド・データベース
- **Prisma** (ORM)
- **PostgreSQL** (予定: Supabase)

### 状態管理
- **Zustand**

### UI/インタラクション
- **@dnd-kit** (ドラッグ&ドロップ機能)

### デプロイ
- **Vercel** (予定)

## 開発環境のセットアップ

### 前提条件

- Node.js 18.x 以上
- npm または yarn
- PostgreSQL（またはSupabaseアカウント）

### インストール手順

1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/manufacturing-setup-simulator.git
cd manufacturing-setup-simulator
```

2. 依存関係のインストール

```bash
npm install
```

3. 環境変数の設定

`.env.example`を`.env.local`にコピーして、必要な環境変数を設定します。

```bash
cp .env.example .env.local
```

`.env.local`を編集：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/manufacturing_db"
DIRECT_URL="postgresql://user:password@localhost:5432/manufacturing_db"
```

4. Prismaのセットアップ

```bash
# Prismaクライアント生成
npx prisma generate

# データベースマイグレーション（スキーマ作成後）
npx prisma migrate dev
```

5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## プロジェクト構造

```
manufacturing-setup-simulator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # APIルート
│   │   │   ├── game/         # ゲーム関連API
│   │   │   └── score/        # スコア関連API
│   │   ├── game/             # ゲーム画面
│   │   ├── ranking/          # ランキング画面
│   │   ├── layout.tsx        # ルートレイアウト
│   │   ├── page.tsx          # トップページ
│   │   └── globals.css       # グローバルCSS
│   ├── components/            # Reactコンポーネント
│   │   ├── ui/               # 共通UIコンポーネント
│   │   └── game/             # ゲーム関連コンポーネント
│   ├── lib/                   # ユーティリティ
│   │   ├── db/               # データベース関連
│   │   ├── types/            # TypeScript型定義
│   │   └── utils/            # 汎用関数
│   └── store/                 # Zustand状態管理
├── prisma/
│   └── schema.prisma         # データベーススキーマ
├── docs/                      # プロジェクトドキュメント
│   ├── 00_PROJECT_SETUP.md
│   ├── 01_DEVELOPMENT_GUIDE.md
│   ├── 02_POWERSHELL_GUIDE.md
│   └── 03_ISSUE_MANAGEMENT.md
├── public/                    # 静的ファイル
├── .env.example              # 環境変数テンプレート
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 開発ガイド

詳細な開発手順については、以下のドキュメントを参照してください：

- [プロジェクトセットアップガイド](./docs/00_PROJECT_SETUP.md)
- [開発ガイド](./docs/01_DEVELOPMENT_GUIDE.md)
- [PowerShellコマンドガイド](./docs/02_POWERSHELL_GUIDE.md)
- [Issue管理ガイド](./docs/03_ISSUE_MANAGEMENT.md)

## 開発フロー

1. Issue作成
2. ブランチ作成（`feature/issue-番号-機能名`）
3. 機能開発
4. コミット（`feat: 機能追加 (#issue番号)`）
5. プルリクエスト作成
6. レビュー・マージ

## 使用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# ESLint実行
npm run lint

# Prisma Studio起動（データベースGUI）
npx prisma studio
```

## 📚 ドキュメント

詳細なドキュメントは /docs ディレクトリを参照してください。

### 設計ドキュメント
- [データベース設計](./docs/design/DATABASE.md) - ER図、テーブル定義
- [画面設計](./docs/design/SCREENS.md) - 画面遷移図、ワイヤーフレーム
- [システム構成](./docs/design/ARCHITECTURE.md) - 技術スタック、アーキテクチャ
- [API仕様](./docs/design/API.md) - エンドポイント一覧

### 開発ドキュメント
- [環境構築](./docs/development/SETUP.md) - セットアップ手順
- [テスト](./docs/development/TESTING.md) - テスト戦略

### デプロイドキュメント
- [Vercelデプロイ](./docs/deployment/VERCEL.md) - デプロイ手順

## ライセンス

MIT

## 作者

製造業向けシミュレーションプロジェクトチーム

---

## 開発ステータス

現在のフェーズ: **Phase 1 - プロジェクト基盤**

- [x] Next.js 14プロジェクト初期化
- [ ] Prismaスキーマ作成
- [ ] Supabase認証統合
- [ ] 基本レイアウト作成

詳細は[開発ガイド](./docs/01_DEVELOPMENT_GUIDE.md)を参照してください。
