# Vercelデプロイガイド

## 概要

このドキュメントは、製造業向け段取りシミュレーションゲームをVercelにデプロイする手順を記述します。

## Vercelとは

Vercelは、Next.jsの開発元が提供するホスティングプラットフォームです。

### 主な特徴

- **ゼロコンフィグ**: Next.jsプロジェクトを自動検出してデプロイ
- **自動スケーリング**: トラフィックに応じて自動でスケール
- **グローバルCDN**: 世界中にエッジノードを展開
- **プレビューデプロイ**: プルリクエストごとに自動デプロイ
- **無料プラン**: 個人プロジェクトやスモールチームに最適

### 料金プラン

| プラン | 月額 | 特徴 |
|-------|------|------|
| **Hobby** | 無料 | 個人プロジェクト、無制限のWebサイト |
| **Pro** | $20 | チーム向け、高度な分析 |
| **Enterprise** | カスタム | 大規模企業向け、SLA保証 |

個人開発や学習目的の場合、**Hobbyプラン（無料）**で十分です。

---

## 前提条件

### 必要なもの

- GitHubアカウント
- Supabaseアカウント（データベース用）
- プロジェクトがGitHubにプッシュされていること

---

## デプロイ手順

### Step 1: Vercelアカウントの準備

#### 1.1. アカウント作成

1. [Vercel](https://vercel.com/)にアクセス
2. "Start Deploying"または"Sign Up"をクリック
3. **GitHubアカウントでサインアップ**（推奨）
   - "Continue with GitHub"を選択
   - GitHubの認証を許可

#### 1.2. Vercel CLIのインストール（オプション）

ローカルからデプロイする場合は、Vercel CLIをインストールします。

```bash
npm install -g vercel
```

インストール確認:

```bash
vercel --version
```

---

### Step 2: データベースの準備（Supabase）

Vercelにデプロイする前に、本番用のデータベースを準備します。

#### 2.1. Supabaseプロジェクト作成

1. [Supabase](https://supabase.com/)にアクセス
2. "Start your project"をクリック
3. 新しいプロジェクトを作成
   - **Project name**: `manufacturing-setup-simulator`
   - **Database Password**: 強力なパスワードを設定（記録しておく）
   - **Region**: `Northeast Asia (Tokyo)` or `Southeast Asia (Singapore)`

#### 2.2. データベース接続情報を取得

1. Supabaseダッシュボードで"Settings" → "Database"を開く
2. "Connection string"セクションで以下を取得:
   - **Connection pooling** (Vercelでは推奨)
   - **Direct connection**

**例:**

```
# Connection pooling (DATABASE_URL)
postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct connection (DIRECT_URL)
postgresql://postgres:[YOUR-PASSWORD]@xxx.supabase.com:5432/postgres
```

#### 2.3. データベーススキーマの作成

ローカル環境からSupabaseにマイグレーションを実行します。

1. `.env.local`を更新してSupabaseの接続情報を設定

```env
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@xxx.supabase.com:5432/postgres"
```

2. マイグレーション実行

```bash
npx prisma migrate deploy
```

3. サンプルデータ投入（オプション）

```bash
npm run db:seed
```

---

### Step 3: GitHubリポジトリの準備

#### 3.1. リポジトリをプッシュ

プロジェクトがまだGitHubにプッシュされていない場合:

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/yourusername/manufacturing-setup-simulator.git

# プッシュ
git push -u origin main
```

#### 3.2. .gitignoreの確認

機密情報がGitにコミットされていないことを確認:

```gitignore
# .gitignore
.env
.env.local
.env.production
.env.development
node_modules/
.next/
out/
coverage/
```

**重要**: `.env.local`は絶対にGitにコミットしないでください。

---

### Step 4: Vercelにデプロイ

#### 方法A: Vercelダッシュボードからデプロイ（推奨）

##### 4.1. 新しいプロジェクトを作成

1. [Vercelダッシュボード](https://vercel.com/dashboard)にログイン
2. "Add New..." → "Project"をクリック
3. "Import Git Repository"セクションでGitHubリポジトリを検索
4. `manufacturing-setup-simulator`を選択
5. "Import"をクリック

##### 4.2. プロジェクト設定

**Configure Project**画面で以下を設定:

| 項目 | 設定値 |
|------|--------|
| **Framework Preset** | Next.js（自動検出） |
| **Root Directory** | ./ |
| **Build Command** | `npm run build`（自動） |
| **Output Directory** | `.next`（自動） |
| **Install Command** | `npm install`（自動） |

##### 4.3. 環境変数の設定

"Environment Variables"セクションで以下の環境変数を追加:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.xxx:...` | Production |
| `DIRECT_URL` | `postgresql://postgres:...` | Production |

**設定手順:**

1. "Environment Variables"を展開
2. "Name"に`DATABASE_URL`を入力
3. "Value"にSupabaseのConnection pooling URLを入力
4. "Production"にチェック
5. "Add"をクリック
6. `DIRECT_URL`も同様に追加

##### 4.4. デプロイ開始

"Deploy"ボタンをクリックしてデプロイを開始します。

**デプロイプロセス:**

```
Building...
├── Installing dependencies
├── Running build command
├── Generating Prisma Client
├── Building Next.js
└── Uploading to CDN

Deploying...
└── https://manufacturing-setup-simulator.vercel.app
```

**所要時間**: 通常2-5分

---

#### 方法B: Vercel CLIからデプロイ

##### 4.1. ログイン

```bash
vercel login
```

ブラウザで認証を完了します。

##### 4.2. デプロイ

プロジェクトディレクトリで実行:

```bash
vercel
```

質問に答えます:

```
? Set up and deploy "~/manufacturing-setup-simulator"? [Y/n] y
? Which scope do you want to deploy to? Your Username
? Link to existing project? [y/N] n
? What's your project's name? manufacturing-setup-simulator
? In which directory is your code located? ./
```

##### 4.3. 環境変数を設定

```bash
vercel env add DATABASE_URL production
# Supabaseの接続情報を入力

vercel env add DIRECT_URL production
# Supabaseの直接接続情報を入力
```

##### 4.4. 本番デプロイ

```bash
vercel --prod
```

---

### Step 5: デプロイの確認

#### 5.1. デプロイ完了

デプロイが完了すると、以下のURLが表示されます:

```
✅ Production: https://manufacturing-setup-simulator.vercel.app
```

#### 5.2. 動作確認

1. URLをブラウザで開く
2. 以下を確認:
   - [ ] トップページが表示される
   - [ ] ゲーム開始ボタンが機能する
   - [ ] ゲーム画面で設備が表示される
   - [ ] ゲーム完了後にスコアが保存される
   - [ ] ランキングが表示される

#### 5.3. エラーの確認

エラーが発生した場合:

1. Vercelダッシュボードで"Deployments"を開く
2. 最新のデプロイをクリック
3. "Build Logs"でビルドログを確認
4. "Function Logs"でランタイムエラーを確認

---

## 環境変数の管理

### Vercelダッシュボードで管理

1. Vercelダッシュボードでプロジェクトを開く
2. "Settings" → "Environment Variables"を開く
3. 環境変数を追加・編集・削除

### 環境の種類

| 環境 | 説明 |
|------|------|
| **Production** | 本番環境（mainブランチ） |
| **Preview** | プレビュー環境（プルリクエスト） |
| **Development** | 開発環境（`vercel dev`） |

### 必須の環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `DATABASE_URL` | データベース接続URL（Connection pooling） | `postgresql://postgres.xxx:...` |
| `DIRECT_URL` | データベース直接接続URL | `postgresql://postgres:...` |

### 環境変数の更新

環境変数を更新した場合、再デプロイが必要です。

```bash
# Vercel CLIの場合
vercel --prod

# または、Vercelダッシュボードで"Redeploy"をクリック
```

---

## カスタムドメインの設定（オプション）

独自ドメインを使用する場合の設定手順です。

### Step 1: ドメインの追加

1. Vercelダッシュボードでプロジェクトを開く
2. "Settings" → "Domains"を開く
3. "Add"をクリック
4. ドメイン名を入力（例: `manufacturing-simulator.com`）
5. "Add"をクリック

### Step 2: DNSレコードの設定

ドメインレジストラ（お名前.com、ムームードメイン等）で以下のDNSレコードを設定:

#### ルートドメインの場合

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |

#### サブドメインの場合

| Type | Name | Value |
|------|------|-------|
| CNAME | www | cname.vercel-dns.com |

### Step 3: SSL証明書の自動発行

VercelがSSL証明書を自動的に発行します（Let's Encrypt）。

**所要時間**: 通常5-10分

### Step 4: 確認

1. ブラウザでカスタムドメインにアクセス
2. HTTPS接続が確立されていることを確認

---

## プレビューデプロイ

### プレビューデプロイとは

プルリクエストごとに自動的に作成される一時的なデプロイです。

### 動作

1. ブランチを作成してプッシュ

```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
```

2. GitHubでプルリクエストを作成
3. Vercelが自動的にプレビューデプロイを作成
4. プルリクエストにコメントが追加される

```
Vercel bot commented
✅ Preview: https://manufacturing-setup-simulator-git-feature-new-feature.vercel.app
```

### プレビュー環境の環境変数

プレビュー環境用の環境変数を設定できます。

1. Vercelダッシュボードで"Settings" → "Environment Variables"
2. "Preview"にチェックを入れて環境変数を追加

---

## 継続的デプロイ（CD）

### 自動デプロイ

GitHubのブランチにプッシュすると、Vercelが自動的にデプロイします。

| ブランチ | デプロイ先 |
|---------|-----------|
| `main` | 本番環境 |
| その他 | プレビュー環境 |

### デプロイ設定

Vercelダッシュボードで"Settings" → "Git"を開いて設定:

- **Production Branch**: `main`（デフォルト）
- **Auto Deploy**: 有効化（推奨）
- **Deploy Hooks**: Webhook URLを生成してCI/CDから手動デプロイ可能

### デプロイフロー

```mermaid
graph LR
    A[git push] --> B[GitHub]
    B --> C[Vercel Webhook]
    C --> D[Build]
    D --> E[Deploy]
    E --> F[Production/Preview]
```

---

## パフォーマンス最適化

### Next.js最適化

Vercelは自動的に以下を最適化します:

- **コード分割**: ページごとに最小限のJavaScriptを読み込み
- **画像最適化**: Next.js Imageコンポーネントの自動最適化
- **キャッシング**: 静的ファイルの永続キャッシュ
- **Edge Functions**: グローバルに分散された関数実行

### カスタム最適化

#### next.config.ts

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Gzip圧縮
  compress: true,

  // 画像最適化
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // SWC Minify（高速化）
  swcMinify: true,

  // React Strict Mode
  reactStrictMode: true,
};

export default nextConfig;
```

---

## モニタリングと分析

### Vercel Analytics

Vercelダッシュボードで"Analytics"を開くと、以下の情報を確認できます:

- **Visitors**: 訪問者数
- **Page Views**: ページビュー数
- **Top Pages**: 人気ページ
- **Devices**: デバイス分布

### Function Logs

サーバーレス関数のログを確認:

1. Vercelダッシュボードで"Deployments"を開く
2. デプロイをクリック
3. "Functions"タブを開く
4. 関数をクリックしてログを確認

### Real-time Logs

リアルタイムでログをストリーミング:

```bash
vercel logs
```

---

## トラブルシューティング

### ビルドエラー

**エラー**: `Module not found`

**解決方法**:

1. `package.json`に依存関係が記載されているか確認
2. ローカルで`npm install`を実行
3. `package-lock.json`をコミット
4. 再デプロイ

---

**エラー**: `Prisma Client not generated`

**解決方法**:

`package.json`にpostinstallスクリプトを追加:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

### データベース接続エラー

**エラー**: `Can't reach database server`

**解決方法**:

1. Vercelの環境変数を確認
2. Supabaseの接続情報が正しいか確認
3. Supabaseプロジェクトが起動しているか確認

---

### デプロイが遅い

**原因**: ビルド時間が長い

**解決方法**:

1. 不要な依存関係を削除
2. `next.config.ts`で最適化設定を追加
3. Vercel Proプランにアップグレード（ビルド並列化）

---

## セキュリティ

### 環境変数の保護

- 環境変数は`.env.local`で管理し、Gitにコミットしない
- Vercelダッシュボードで環境変数を設定
- APIキーやパスワードは絶対にコードに直接書かない

### HTTPS

Vercelは自動的にHTTPSを有効化します（Let's Encrypt）。

### セキュリティヘッダー

`next.config.ts`にセキュリティヘッダーを追加:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

---

## バックアップとロールバック

### バックアップ

Vercelは自動的にすべてのデプロイを保存します。

### ロールバック

以前のデプロイにロールバックする手順:

1. Vercelダッシュボードで"Deployments"を開く
2. ロールバックしたいデプロイを選択
3. "..."メニューから"Promote to Production"をクリック

---

## サポート

デプロイに関する質問や問題がある場合:

- **Vercelドキュメント**: https://vercel.com/docs
- **Vercelサポート**: https://vercel.com/support
- **GitHubリポジトリ**: https://github.com/yourusername/manufacturing-setup-simulator/issues

---

## まとめ

### デプロイチェックリスト

- [ ] GitHubにプッシュ
- [ ] Supabaseデータベース作成
- [ ] Supabaseに環境変数を設定してマイグレーション実行
- [ ] Vercelアカウント作成
- [ ] Vercelでプロジェクトをインポート
- [ ] Vercelで環境変数を設定
- [ ] デプロイ
- [ ] 動作確認
- [ ] カスタムドメイン設定（オプション）

### 次のステップ

- Vercel Analyticsで使用状況を監視
- パフォーマンス最適化
- カスタムドメインの設定
- 継続的デプロイの活用
