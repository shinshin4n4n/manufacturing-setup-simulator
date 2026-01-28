# 開発環境構築ガイド

## 概要

このドキュメントは、製造業向け段取りシミュレーションゲームの開発環境構築手順を記述します。

## 前提条件

### 必要な環境

開発を始める前に、以下のソフトウェアをインストールしてください。

| ソフトウェア | 必須バージョン | 確認コマンド | インストール先 |
|-------------|---------------|-------------|---------------|
| **Node.js** | 18.x 以上 | `node -v` | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x 以上 | `npm -v` | Node.jsに同梱 |
| **Git** | 最新版 | `git --version` | [git-scm.com](https://git-scm.com/) |
| **PostgreSQL** | 14.x 以上（オプション） | `psql --version` | [postgresql.org](https://www.postgresql.org/) |

### 推奨環境

| 項目 | 推奨 |
|------|------|
| OS | Windows 10/11、macOS 12+、Ubuntu 20.04+ |
| メモリ | 8GB以上 |
| ストレージ | 500MB以上の空き容量 |
| エディタ | Visual Studio Code |

---

## セットアップ手順

### 1. リポジトリのクローン

GitHubからプロジェクトをクローンします。

```bash
git clone https://github.com/yourusername/manufacturing-setup-simulator.git
cd manufacturing-setup-simulator
```

### 2. 依存関係のインストール

プロジェクトに必要なパッケージをインストールします。

```bash
npm install
```

**インストールされる主な依存関係:**

- Next.js 14
- React 18
- TypeScript 5
- Prisma 5
- TailwindCSS 3
- Zustand 5
- @dnd-kit
- framer-motion

**所要時間**: 通常2-5分

### 3. 環境変数の設定

環境変数ファイルを作成して、データベース接続情報を設定します。

#### 3.1. テンプレートをコピー

```bash
cp .env.example .env.local
```

Windowsの場合（PowerShell）:

```powershell
Copy-Item .env.example .env.local
```

#### 3.2. 環境変数を編集

`.env.local`ファイルを開いて、以下の内容を設定します。

```env
# データベース接続URL
DATABASE_URL="postgresql://user:password@localhost:5432/manufacturing_db"
DIRECT_URL="postgresql://user:password@localhost:5432/manufacturing_db"
```

#### 3.3. データベース選択

以下のいずれかの方法でデータベースを準備してください。

---

#### 方法A: ローカルPostgreSQL（推奨：開発環境）

**Step 1: PostgreSQLをインストール**

- [PostgreSQL公式サイト](https://www.postgresql.org/download/)からダウンロード
- インストール時にパスワードを設定（覚えておいてください）

**Step 2: データベースを作成**

```bash
# PostgreSQLに接続
psql -U postgres

# データベースを作成
CREATE DATABASE manufacturing_db;

# 確認
\l

# 終了
\q
```

**Step 3: .env.localを更新**

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/manufacturing_db"
DIRECT_URL="postgresql://postgres:your_password@localhost:5432/manufacturing_db"
```

`your_password`を実際のパスワードに置き換えてください。

---

#### 方法B: Supabase（推奨：本番環境）

**Step 1: Supabaseアカウント作成**

1. [Supabase](https://supabase.com/)にアクセス
2. "Start your project"をクリック
3. GitHubアカウントでサインアップ

**Step 2: 新しいプロジェクトを作成**

1. "New Project"をクリック
2. プロジェクト名: `manufacturing-setup-simulator`
3. データベースパスワードを設定（強力なパスワードを推奨）
4. リージョンを選択（日本の場合: Northeast Asia (Tokyo)）
5. "Create new project"をクリック

**Step 3: 接続情報を取得**

1. プロジェクトダッシュボードで"Settings" → "Database"を開く
2. "Connection string"セクションで以下を取得:
   - **Connection pooling** (DATABASE_URL用)
   - **Direct connection** (DIRECT_URL用)

**Step 4: .env.localを更新**

```env
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@xxx.supabase.com:5432/postgres"
```

`[YOUR-PASSWORD]`を実際のパスワードに置き換えてください。

---

### 4. Prismaのセットアップ

データベーススキーマを作成して、Prismaクライアントを生成します。

#### 4.1. Prismaクライアントの生成

```bash
npx prisma generate
```

このコマンドは、`prisma/schema.prisma`に基づいてTypeScript型付きのPrismaクライアントを生成します。

#### 4.2. データベースマイグレーション

データベースにテーブルを作成します。

```bash
npx prisma migrate dev --name init
```

**実行内容:**
- Equipmentテーブル作成
- SetupMatrixテーブル作成
- GameSessionテーブル作成
- インデックスと外部キー制約の追加

**所要時間**: 通常10-30秒

#### 4.3. サンプルデータの投入（オプション）

開発用のサンプルデータを投入します。

```bash
npm run db:seed
```

**投入されるデータ:**
- 5つの設備（旋盤A、旋盤B、フライス盤、ボール盤、研削盤）
- 20の段取りマトリクス
- 5つのサンプルゲームセッション

### 5. 開発サーバーの起動

すべての設定が完了したら、開発サーバーを起動します。

```bash
npm run dev
```

**出力例:**

```
> manufacturing-setup-simulator@0.1.0 dev
> next dev

  ▲ Next.js 14.2.20
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.100:3000

 ✓ Ready in 2.5s
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 6. 動作確認

以下の項目を確認して、セットアップが正常に完了したことを確認します。

- [ ] トップページが表示される
- [ ] ゲーム開始ボタンをクリックできる
- [ ] ゲーム画面で設備リストが表示される
- [ ] ランキング画面でランキングが表示される（サンプルデータ投入済みの場合）

---

## データベース管理ツール

### Prisma Studio

Prisma Studioは、データベースの内容をGUIで確認・編集できるツールです。

#### 起動方法

```bash
npx prisma studio
```

ブラウザで [http://localhost:5555](http://localhost:5555) が開きます。

#### 機能

- **テーブル閲覧**: Equipment、SetupMatrix、GameSessionの内容を確認
- **データ編集**: レコードの追加・更新・削除
- **フィルタリング**: 条件を指定してデータを検索
- **リレーション表示**: 外部キーの関連を可視化

### pgAdmin（PostgreSQLの場合）

ローカルPostgreSQLを使用している場合、pgAdminも利用できます。

1. [pgAdmin](https://www.pgadmin.org/download/)をダウンロード
2. インストール
3. PostgreSQLサーバーに接続
4. `manufacturing_db`データベースを選択

---

## トラブルシューティング

### データベース接続エラー

**エラーメッセージ:**

```
Error: P1001: Can't reach database server
```

**解決方法:**

1. `.env.local`の接続情報を確認
2. PostgreSQLが起動しているか確認:

```bash
# macOS/Linux
pg_ctl status

# Windows
sc query postgresql-x64-14
```

3. データベースが存在するか確認:

```bash
psql -U postgres -l
```

### ポート競合エラー

**エラーメッセージ:**

```
Error: Port 3000 is already in use
```

**解決方法:**

1. 他のプロセスがポート3000を使用している
2. 別のポートで起動:

```bash
PORT=3001 npm run dev
```

または、使用中のプロセスを終了:

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Prismaマイグレーションエラー

**エラーメッセージ:**

```
Error: Migration failed
```

**解決方法:**

1. データベースをリセット:

```bash
npx prisma migrate reset
```

**警告**: すべてのデータが削除されます。

2. マイグレーションを再実行:

```bash
npx prisma migrate dev --name init
```

### 依存関係のインストールエラー

**エラーメッセージ:**

```
npm ERR! code ERESOLVE
```

**解決方法:**

1. `node_modules`と`package-lock.json`を削除:

```bash
# macOS/Linux
rm -rf node_modules package-lock.json

# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules, package-lock.json
```

2. 再インストール:

```bash
npm install
```

---

## 推奨VS Code拡張機能

開発効率を向上させるために、以下のVS Code拡張機能をインストールすることをお勧めします。

### 必須

| 拡張機能 | ID | 説明 |
|---------|-----|------|
| **Prisma** | `Prisma.prisma` | Prismaスキーマのシンタックスハイライトと自動補完 |
| **ESLint** | `dbaeumer.vscode-eslint` | コード品質チェック |
| **Prettier** | `esbenp.prettier-vscode` | コードフォーマッター |
| **TypeScript** | 組み込み | TypeScript言語サポート |

### 推奨

| 拡張機能 | ID | 説明 |
|---------|-----|------|
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | TailwindCSSのクラス名補完 |
| **PostCSS Language Support** | `csstools.postcss` | PostCSSシンタックスハイライト |
| **GitLens** | `eamodio.gitlens` | Git履歴の可視化 |
| **Path Intellisense** | `christian-kohler.path-intellisense` | ファイルパスの自動補完 |
| **Auto Rename Tag** | `formulahendry.auto-rename-tag` | HTMLタグの自動リネーム |
| **Import Cost** | `wix.vscode-import-cost` | インポートサイズの表示 |

### インストール方法

#### 方法1: VS Code UI

1. VS Codeを開く
2. 拡張機能タブ（Ctrl+Shift+X / Cmd+Shift+X）を開く
3. 拡張機能名で検索してインストール

#### 方法2: コマンドライン

```bash
code --install-extension Prisma.prisma
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension csstools.postcss
code --install-extension eamodio.gitleens
code --install-extension christian-kohler.path-intellisense
code --install-extension formulahendry.auto-rename-tag
code --install-extension wix.vscode-import-cost
```

---

## VS Code設定

プロジェクトルートに`.vscode/settings.json`を作成して、以下の設定を追加すると、チーム全体で統一された開発環境を構築できます。

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "\"([^\"]*)\""]
  ],
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

---

## 開発ワークフロー

### 日常的な開発

1. **最新のコードを取得**

```bash
git pull origin main
```

2. **依存関係を更新**

```bash
npm install
```

3. **開発サーバー起動**

```bash
npm run dev
```

4. **コード編集**
   - `src/`配下のファイルを編集
   - ホットリロードで変更が即座に反映される

5. **Prismaスキーマ変更時**

```bash
# スキーマ変更後
npx prisma migrate dev --name <migration_name>

# Prismaクライアント再生成
npx prisma generate
```

### コードの品質チェック

#### ESLint実行

```bash
npm run lint
```

#### Prettier実行（フォーマット）

```bash
npx prettier --write .
```

---

## 次のステップ

環境構築が完了したら、以下のドキュメントを参照してください。

- [テスト](./TESTING.md) - テストの書き方と実行方法
- [データベース設計](../design/DATABASE.md) - データベーススキーマの詳細
- [API仕様](../design/API.md) - APIエンドポイントの仕様
- [システム構成](../design/ARCHITECTURE.md) - アーキテクチャの概要

---

## サポート

セットアップに関する質問や問題がある場合は、GitHubのIssueで報告してください。

- GitHub Issues: https://github.com/yourusername/manufacturing-setup-simulator/issues
