# PowerShellコマンドガイド

製造業向け段取りシミュレーションゲーム開発でよく使うPowerShellコマンドをまとめています。

---

## 基本的なディレクトリ操作

### ディレクトリ移動

```powershell
# プロジェクトルートに移動
cd C:\Users\siguc\work\dev\projects\manufacturing-setup-simulator

# 相対パスで移動
cd src\app

# 親ディレクトリに戻る
cd ..

# ホームディレクトリに移動
cd ~
```

### ディレクトリ内容の表示

```powershell
# ファイル一覧表示（簡易）
ls

# 詳細表示
ls -l

# 隠しファイルも表示
ls -Force

# 特定の拡張子のみ表示
ls *.tsx

# 再帰的に表示
ls -Recurse
```

### ディレクトリ作成・削除

```powershell
# ディレクトリ作成
mkdir src\components\game

# 複数階層を一度に作成
mkdir -p src\components\game\ui

# ディレクトリ削除（空の場合のみ）
rmdir src\components\old

# ディレクトリと中身をすべて削除
rm -r src\components\old
```

---

## Gitコマンド

### 初期設定

```powershell
# Git初期化
git init

# ユーザー情報設定
git config user.name "Your Name"
git config user.email "your.email@example.com"

# グローバル設定
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 設定確認
git config --list
```

### リモートリポジトリ設定

```powershell
# リモートリポジトリ追加
git remote add origin https://github.com/username/manufacturing-setup-simulator.git

# リモートリポジトリ確認
git remote -v

# リモートリポジトリ変更
git remote set-url origin https://github.com/username/new-repo.git

# リモートリポジトリ削除
git remote remove origin
```

### ブランチ操作

```powershell
# ブランチ一覧表示
git branch

# リモートブランチも表示
git branch -a

# 新しいブランチ作成
git branch feature/issue-1-prisma-setup

# ブランチ作成と同時に切り替え
git checkout -b feature/issue-1-prisma-setup

# より新しい構文（Git 2.23以降）
git switch -c feature/issue-1-prisma-setup

# ブランチ切り替え
git checkout main
git switch main

# ブランチ削除（ローカル）
git branch -d feature/issue-1-prisma-setup

# 強制削除
git branch -D feature/issue-1-prisma-setup

# リモートブランチ削除
git push origin --delete feature/issue-1-prisma-setup
```

### ステージング・コミット

```powershell
# 変更状態確認
git status

# ファイルをステージング
git add src/app/page.tsx

# 複数ファイルを一度に
git add src/app/page.tsx src/components/Header.tsx

# すべての変更をステージング
git add .

# 特定のディレクトリ以下をすべて
git add src/components/

# ステージングから除外
git reset src/app/page.tsx

# コミット
git commit -m "feat: Add basic page layout"

# ステージング + コミット（追跡済みファイルのみ）
git commit -am "fix: Fix navigation link"

# 直前のコミットメッセージ修正
git commit --amend -m "feat: Add basic page layout (#1)"

# 直前のコミットにファイル追加
git add forgotten-file.tsx
git commit --amend --no-edit
```

### 変更確認

```powershell
# 変更差分表示（ステージング前）
git diff

# ステージング済みの差分
git diff --staged

# 特定ファイルの差分
git diff src/app/page.tsx

# コミット間の差分
git diff commit1 commit2

# 統計情報のみ表示
git diff --stat
```

### コミット履歴

```powershell
# コミット履歴表示
git log

# 1行で表示
git log --oneline

# グラフ表示
git log --oneline --graph

# 最新5件のみ
git log -5

# 特定ファイルの履歴
git log src/app/page.tsx

# 特定期間の履歴
git log --since="2024-01-01" --until="2024-01-31"
```

### プッシュ・プル

```powershell
# リモートにプッシュ
git push origin feature/issue-1-prisma-setup

# 初回プッシュ（追跡設定付き）
git push -u origin feature/issue-1-prisma-setup

# すべてのブランチをプッシュ
git push --all

# タグをプッシュ
git push --tags

# リモートから取得（マージしない）
git fetch origin

# リモートから取得してマージ
git pull origin main

# リベース形式でプル
git pull --rebase origin main
```

### マージ・リベース

```powershell
# mainブランチにマージ
git checkout main
git merge feature/issue-1-prisma-setup

# コンフリクト確認
git status

# コンフリクト解決後
git add .
git commit -m "Merge feature/issue-1-prisma-setup"

# リベース
git checkout feature/issue-1-prisma-setup
git rebase main

# リベース中止
git rebase --abort

# リベース継続（コンフリクト解決後）
git add .
git rebase --continue
```

### 一時保存（Stash）

```powershell
# 変更を一時保存
git stash

# メッセージ付きで保存
git stash save "WIP: working on feature"

# stash一覧表示
git stash list

# 最新のstashを適用
git stash apply

# stashを適用して削除
git stash pop

# 特定のstashを適用
git stash apply stash@{0}

# stash削除
git stash drop stash@{0}

# すべてのstash削除
git stash clear
```

### タグ

```powershell
# タグ一覧
git tag

# タグ作成
git tag v1.0.0

# 注釈付きタグ
git tag -a v1.0.0 -m "Release version 1.0.0"

# 特定のコミットにタグ
git tag v1.0.0 commit-hash

# タグをプッシュ
git push origin v1.0.0

# すべてのタグをプッシュ
git push --tags

# タグ削除（ローカル）
git tag -d v1.0.0

# タグ削除（リモート）
git push origin --delete v1.0.0
```

---

## npm / npxコマンド

### プロジェクト初期化

```powershell
# package.json作成
npm init

# デフォルト設定で作成
npm init -y

# Next.jsプロジェクト作成
npx create-next-app@latest manufacturing-setup-simulator
```

### パッケージ管理

```powershell
# パッケージインストール
npm install

# 特定のパッケージインストール
npm install zustand

# 複数パッケージを一度に
npm install zustand @supabase/supabase-js date-fns

# 開発用依存関係としてインストール
npm install -D @types/node

# グローバルインストール
npm install -g vercel

# 特定バージョン指定
npm install react@18.2.0

# パッケージアンインストール
npm uninstall zustand

# パッケージ更新
npm update

# 特定パッケージの更新
npm update next

# 古いパッケージ確認
npm outdated
```

### スクリプト実行

```powershell
# package.jsonのscriptsを実行
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm run start    # 本番サーバー起動
npm run lint     # ESLint実行

# npm run省略形（特定のスクリプトのみ）
npm start        # npm run startと同じ
npm test         # npm run testと同じ
```

### Prismaコマンド

```powershell
# Prisma初期化
npx prisma init

# マイグレーション作成
npx prisma migrate dev --name init

# マイグレーション適用
npx prisma migrate deploy

# データベースにスキーマを直接反映（開発用）
npx prisma db push

# Prismaクライアント生成
npx prisma generate

# Prisma Studio起動（GUI管理ツール）
npx prisma studio

# マイグレーションリセット
npx prisma migrate reset

# スキーマフォーマット
npx prisma format

# スキーマバリデーション
npx prisma validate
```

### Next.jsコマンド

```powershell
# 開発サーバー起動（デフォルト: http://localhost:3000）
npm run dev

# ポート指定して起動
npm run dev -- -p 3001

# ビルド
npm run build

# 本番サーバー起動
npm run start

# ESLint実行
npm run lint

# ESLint自動修正
npm run lint -- --fix
```

---

## 開発でよく使うコマンドセット

### 新しいIssue作業開始

```powershell
# 最新のmainブランチに更新
git checkout main
git pull origin main

# 新しいブランチ作成・切り替え
git checkout -b feature/issue-4-product-management

# 依存関係更新（必要に応じて）
npm install

# 開発サーバー起動
npm run dev
```

### 作業完了・プッシュ

```powershell
# 変更確認
git status
git diff

# ステージング
git add .

# コミット
git commit -m "feat: Add product management feature (#4)"

# リモートにプッシュ
git push -u origin feature/issue-4-product-management

# GitHubでプルリクエスト作成
# ブラウザでリポジトリを開く
```

### マージ後の清掃

```powershell
# mainブランチに戻る
git checkout main

# 最新状態に更新
git pull origin main

# マージ済みブランチ削除
git branch -d feature/issue-4-product-management

# リモートブランチ削除
git push origin --delete feature/issue-4-product-management
```

### データベースリセット（開発用）

```powershell
# Prismaマイグレーションリセット
npx prisma migrate reset

# スキーマを再度適用
npx prisma db push

# Prisma Studio確認
npx prisma studio
```

### トラブルシューティング

```powershell
# node_modules削除・再インストール
rm -r node_modules
rm package-lock.json
npm install

# Next.jsキャッシュクリア
rm -r .next
npm run build

# Gitのインデックスリセット
git reset --hard HEAD

# ローカル変更を破棄
git checkout .

# 追跡されていないファイル削除
git clean -fd
```

---

## ショートカット・エイリアス

PowerShellプロファイルに追加すると便利なエイリアス:

```powershell
# プロファイル編集
notepad $PROFILE

# 以下を追加:
function gs { git status }
function ga { git add . }
function gc { param($msg) git commit -m $msg }
function gp { git push }
function gl { git log --oneline --graph -10 }
function gco { param($branch) git checkout $branch }
function gcb { param($branch) git checkout -b $branch }

# プロファイル再読み込み
. $PROFILE
```

使用例:

```powershell
gs                              # git status
ga                              # git add .
gc "feat: Add feature"          # git commit -m "feat: Add feature"
gp                              # git push
gl                              # git log --oneline --graph -10
gco main                        # git checkout main
gcb feature/new-branch          # git checkout -b feature/new-branch
```

---

## 便利なツール

### CLIツール

```powershell
# Vercel CLI（デプロイ）
npm install -g vercel
vercel login
vercel

# GitHub CLI（Issue、PR管理）
# https://cli.github.com/ からインストール
gh auth login
gh issue list
gh pr create

# Tree（ディレクトリ構造表示、Windowsの場合）
tree /F
```

### VSCode統合ターミナル

VSCodeで `Ctrl + @` （またはメニュー: 表示 > ターミナル）でターミナルを開くと、プロジェクトルートで直接コマンド実行できます。

---

## よくあるエラーと対処法

### npm ERR! code ENOENT

```powershell
# package.jsonがない、または間違ったディレクトリにいる
cd C:\Users\siguc\work\dev\projects\manufacturing-setup-simulator
```

### error: failed to push some refs

```powershell
# リモートに新しいコミットがある
git pull origin main
# コンフリクト解決後
git push origin main
```

### Port 3000 is already in use

```powershell
# 別のポートで起動
npm run dev -- -p 3001

# または、使用中のプロセスを終了
# タスクマネージャーでNode.jsプロセスを終了
```

### Prisma Client did not initialize

```powershell
# Prismaクライアント再生成
npx prisma generate

# 開発サーバー再起動
npm run dev
```

---

## 参考資料

- [Git公式ドキュメント](https://git-scm.com/doc)
- [npm公式ドキュメント](https://docs.npmjs.com/)
- [Prisma CLI Reference](https://www.prisma.io/docs/reference/api-reference/command-reference)
- [Next.js CLI](https://nextjs.org/docs/api-reference/cli)
- [PowerShell Documentation](https://docs.microsoft.com/powershell/)

---

このガイドは随時更新していきます。新しい便利なコマンドを見つけたら追記してください。
