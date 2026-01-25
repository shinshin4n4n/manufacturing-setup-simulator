# Issue管理ガイド

GitHub Issuesを使ったプロジェクト管理方法をまとめています。

---

## Issue管理の基本方針

### 原則

1. **1 Issue = 1 Feature**: 1つのIssueには1つの明確な機能・タスク
2. **Issue駆動開発**: すべての作業はIssueから開始
3. **ブランチ命名規則**: `feature/issue-番号-機能名`
4. **コミットメッセージ**: `type: message (#issue番号)`
5. **プルリクエスト**: Issueをクローズするために必須

---

## Issueテンプレート

### 機能追加（Feature）

```markdown
## 概要
<!-- この機能の目的と概要を説明 -->

## 背景・理由
<!-- なぜこの機能が必要なのか -->

## 実装内容
<!-- 具体的に実装する内容 -->
- [ ] タスク1
- [ ] タスク2
- [ ] タスク3

## 技術的詳細
<!-- 使用する技術、ライブラリ、実装方針など -->

## 受け入れ条件
<!-- この機能が完成したと言える条件 -->
- [ ] 条件1
- [ ] 条件2

## 関連Issue
<!-- 関連するIssueがあればリンク -->
- Related to #X
- Depends on #Y

## 参考資料
<!-- 参考になるドキュメント、記事などのリンク -->
```

### バグ修正（Bug）

```markdown
## バグの説明
<!-- バグの内容を明確に説明 -->

## 再現手順
1. 手順1
2. 手順2
3. 手順3

## 期待される動作
<!-- 本来どうあるべきか -->

## 実際の動作
<!-- 実際にどうなっているか -->

## スクリーンショット
<!-- 可能であればスクリーンショットを添付 -->

## 環境
- OS:
- ブラウザ:
- Node.jsバージョン:
- その他:

## 原因（わかる場合）
<!-- バグの原因が分かっていれば記載 -->

## 修正方針
<!-- 修正の方向性 -->
```

### ドキュメント（Documentation）

```markdown
## 対象ドキュメント
<!-- 作成・更新するドキュメント -->

## 目的
<!-- なぜこのドキュメントが必要か -->

## 内容
<!-- ドキュメントに含める内容 -->
- 項目1
- 項目2
- 項目3

## 対象読者
<!-- 誰が読むことを想定しているか -->

## 参考資料
<!-- 参考にするドキュメント、記事など -->
```

---

## Issue作成方法

### GitHubウェブUIから作成

1. リポジトリページの「Issues」タブをクリック
2. 「New issue」ボタンをクリック
3. テンプレートを選択（またはBlankを選択）
4. タイトルと内容を記入
5. ラベル、Assignee、Projectsなどを設定
6. 「Submit new issue」をクリック

### GitHub CLIから作成

```powershell
# GitHub CLI認証
gh auth login

# Issueを作成
gh issue create --title "タイトル" --body "内容"

# インタラクティブモード
gh issue create

# テンプレートを使用
gh issue create --template feature_request.md

# ラベル付き
gh issue create --title "タイトル" --label "bug,priority:high"

# 担当者指定
gh issue create --title "タイトル" --assignee @me
```

---

## 17個のIssue詳細リスト

### Phase 1: プロジェクト基盤（Issue #1-3）

#### Issue #1: プロジェクトセットアップとPrismaスキーマ作成

```markdown
Title: プロジェクトセットアップとPrismaスキーマ作成
Labels: setup, phase-1, priority:high

## 概要
Next.js 14プロジェクトの初期セットアップとPrismaによるデータベーススキーマ設計

## 実装内容
- [x] Next.js 14プロジェクト作成（TypeScript, TailwindCSS, App Router）
- [ ] Prismaのインストールと初期化
- [ ] データベーススキーマ定義（User, Product, GameRecord）
- [ ] 初回マイグレーション実行
- [ ] Prisma Clientの生成確認

## 技術的詳細
- Next.js 14 (App Router)
- Prisma ORM
- Supabase PostgreSQL
- TypeScript

## 受け入れ条件
- [ ] `npx prisma migrate dev` が正常に実行できる
- [ ] Prisma Studioでテーブル確認できる
- [ ] スキーマに3つのモデル（User, Product, GameRecord）が定義されている
```

#### Issue #2: Supabase認証の統合

```markdown
Title: Supabase認証の統合
Labels: authentication, phase-1, priority:high

## 概要
Supabase Authを使ったユーザー認証機能の実装

## 実装内容
- [ ] Supabaseクライアント設定
- [ ] 認証Zustandストアの作成
- [ ] ログインフォームコンポーネント
- [ ] サインアップフォームコンポーネント
- [ ] ログインページ
- [ ] サインアップページ
- [ ] 認証状態の永続化
- [ ] ログアウト機能

## 技術的詳細
- @supabase/supabase-js
- Zustand（状態管理）
- TailwindCSS（スタイリング）

## 受け入れ条件
- [ ] メール/パスワードでサインアップできる
- [ ] ログイン/ログアウトが正常に動作する
- [ ] ページリロード後も認証状態が保持される
- [ ] エラーメッセージが適切に表示される
```

#### Issue #3: 基本レイアウトとナビゲーション

```markdown
Title: 基本レイアウトとナビゲーション
Labels: ui, layout, phase-1

## 概要
アプリケーション全体のレイアウトとナビゲーションUIの実装

## 実装内容
- [ ] ヘッダーコンポーネント
- [ ] フッターコンポーネント
- [ ] ナビゲーションメニュー
- [ ] ルートレイアウト更新
- [ ] レスポンシブ対応
- [ ] モバイルメニュー（ハンバーガーメニュー）
- [ ] アクティブリンクのハイライト

## デザイン方針
- シンプルで見やすい
- 製造業をイメージしたブルー系配色
- レスポンシブデザイン

## 受け入れ条件
- [ ] すべてのページで共通ヘッダー・フッターが表示される
- [ ] ログイン状態に応じてメニューが切り替わる
- [ ] モバイル表示で適切にレイアウトされる
```

### Phase 2: コア機能実装（Issue #4-7）

#### Issue #4: 製品マスタ管理機能

```markdown
Title: 製品マスタ管理機能
Labels: feature, crud, phase-2, priority:high

## 概要
製品の登録、編集、削除を行う管理機能

## 実装内容
- [ ] 製品一覧API (GET /api/products)
- [ ] 製品登録API (POST /api/products)
- [ ] 製品更新API (PUT /api/products/[id])
- [ ] 製品削除API (DELETE /api/products/[id])
- [ ] 製品一覧ページ
- [ ] 製品登録ページ
- [ ] 製品編集ページ
- [ ] 製品一覧コンポーネント
- [ ] 製品フォームコンポーネント

## 技術的詳細
- Prisma ORM（CRUD操作）
- Next.js API Routes
- フォームバリデーション

## 受け入れ条件
- [ ] 製品の登録・編集・削除が正常に動作する
- [ ] バリデーションエラーが適切に表示される
- [ ] ログインユーザーのみアクセス可能
```

#### Issue #5: ゲーム画面のUI実装

```markdown
Title: ゲーム画面のUI実装
Labels: feature, ui, phase-2, priority:high

## 概要
段取りシミュレーションゲームのメインUI

## 実装内容
- [ ] ゲームページ (src/app/game/page.tsx)
- [ ] GameBoardコンポーネント
- [ ] ProductSelectorコンポーネント
- [ ] SetupTimerコンポーネント
- [ ] ActionButtonsコンポーネント
- [ ] ScoreDisplayコンポーネント

## デザイン要件
- 大きく見やすいタイマー表示
- 直感的な操作ボタン
- レスポンシブレイアウト

## 受け入れ条件
- [ ] 製品選択ができる
- [ ] スタート/ストップボタンが配置されている
- [ ] タイマー表示領域がある
- [ ] スコア表示領域がある
```

#### Issue #6: ゲームロジックの状態管理

```markdown
Title: ゲームロジックの状態管理
Labels: feature, state-management, phase-2, priority:high

## 概要
Zustandを使ったゲーム状態の管理とロジック実装

## 実装内容
- [ ] gameStoreの作成
- [ ] 製品選択ロジック
- [ ] タイマー開始/停止ロジック
- [ ] スコア計算ロジック
- [ ] ゲーム記録保存ロジック
- [ ] ゲームリセットロジック

## スコア計算式
```
score = Math.max(0, 1000 - (actualTime - standardTime) * 10)
```

## 受け入れ条件
- [ ] 製品選択が状態に反映される
- [ ] タイマーが正確に動作する
- [ ] スコアが正しく計算される
- [ ] ゲームリセットが正常に動作する
```

#### Issue #7: ゲーム記録保存API

```markdown
Title: ゲーム記録保存API
Labels: feature, api, phase-2, priority:high

## 概要
ゲーム結果をデータベースに保存するAPI実装

## 実装内容
- [ ] POST /api/game-records（記録保存）
- [ ] GET /api/game-records（自分の記録取得）
- [ ] GET /api/game-records/ranking（ランキング取得）
- [ ] 認証チェック
- [ ] バリデーション
- [ ] エラーハンドリング

## 受け入れ条件
- [ ] ゲーム記録が正常に保存される
- [ ] 認証されたユーザーのみアクセス可能
- [ ] バリデーションエラーが適切に返される
```

### Phase 3: ゲームロジック（Issue #8-11）

#### Issue #8: タイマー機能の実装

```markdown
Title: タイマー機能の実装
Labels: feature, hooks, phase-3

## 概要
高精度なタイマー機能のカスタムフック実装

## 実装内容
- [ ] useTimerカスタムフック作成
- [ ] start/stop/reset関数
- [ ] 経過時間の秒単位管理
- [ ] setIntervalを使った1秒更新

## 技術的詳細
- React Hooks（useState, useEffect, useRef）
- setInterval/clearIntervalの適切な管理

## 受け入れ条件
- [ ] タイマーが正確に1秒ごとに更新される
- [ ] start/stop/resetが正常に動作する
- [ ] メモリリークがない（useEffectのクリーンアップ）
```

#### Issue #9: スコア計算ロジックの改善

```markdown
Title: スコア計算ロジックの改善
Labels: feature, logic, phase-3

## 概要
より詳細なスコア計算システムの実装

## 実装内容
- [ ] scoreCalculator.ts作成
- [ ] 基本スコア計算関数
- [ ] ボーナスポイント計算関数
- [ ] 評価ランク判定関数（S, A, B, C, D）

## 計算ロジック
- 基本スコア: 1000点から減点方式
- 標準時間80%以下: +200点ボーナス
- 標準時間90%以下: +100点ボーナス
- 超過1秒あたり: -20点
- 最低スコア: 0点

## 受け入れ条件
- [ ] スコアが正しく計算される
- [ ] ボーナスポイントが適用される
- [ ] 評価ランクが正しく判定される
```

#### Issue #10: ゲームフロー制御

```markdown
Title: ゲームフロー制御
Labels: feature, logic, phase-3

## 概要
ゲーム開始から終了までのフロー管理

## 実装内容
- [ ] GameControllerコンポーネント作成
- [ ] 状態遷移ロジック（IDLE → RUNNING → FINISHED）
- [ ] 確認ダイアログ
- [ ] トースト通知（react-hot-toast）

## 状態遷移
1. IDLE（製品選択待ち）
2. RUNNING（タイマー実行中）
3. FINISHED（結果表示）

## 受け入れ条件
- [ ] 状態遷移が正しく動作する
- [ ] エラー時に適切なメッセージが表示される
- [ ] 確認ダイアログが正しく表示される
```

#### Issue #11: リアルタイムバリデーション

```markdown
Title: リアルタイムバリデーション
Labels: feature, validation, phase-3

## 概要
ゲーム中の不正操作を防ぐバリデーション機能

## 実装内容
- [ ] gameValidation.ts作成
- [ ] 製品選択チェック
- [ ] タイマー状態チェック
- [ ] スコア範囲チェック
- [ ] ゲーム記録整合性チェック

## バリデーション項目
- 製品が選択されているか
- タイマーが二重起動していないか
- タイマー実行中に製品変更できないか
- スコアが0-2000点の範囲か
- 経過時間が0-3600秒の範囲か

## 受け入れ条件
- [ ] 不正な操作が防止される
- [ ] エラーメッセージがToastで表示される
```

### Phase 4: UI/UX改善（Issue #12-14）

#### Issue #12: ダッシュボード画面

```markdown
Title: ダッシュボード画面
Labels: feature, ui, phase-4

## 概要
ユーザーのゲーム統計を表示するダッシュボード

## 実装内容
- [ ] ダッシュボードページ
- [ ] StatsCardコンポーネント
- [ ] RecentRecordsコンポーネント
- [ ] ScoreChartコンポーネント
- [ ] PersonalBestコンポーネント

## 表示項目
- 総プレイ回数
- 平均スコア
- 最高スコア
- 最近5件の記録
- スコア推移グラフ（簡易版）

## 受け入れ条件
- [ ] 統計情報が正しく表示される
- [ ] レスポンシブデザイン対応
- [ ] データがない場合の表示も適切
```

#### Issue #13: ランキング画面

```markdown
Title: ランキング画面
Labels: feature, ui, phase-4

## 概要
全ユーザーのスコアランキング表示

## 実装内容
- [ ] ランキングページ
- [ ] RankingTableコンポーネント
- [ ] RankingFilterコンポーネント
- [ ] UserRankBadgeコンポーネント
- [ ] ページネーション

## 機能
- トップ100表示
- 製品別フィルタリング
- 自分の順位ハイライト
- 10件ずつページネーション

## 受け入れ条件
- [ ] ランキングが正しく表示される
- [ ] フィルタリングが動作する
- [ ] ページネーションが正常に動作する
```

#### Issue #14: プロフィール画面

```markdown
Title: プロフィール画面
Labels: feature, ui, phase-4

## 概要
ユーザープロフィールと設定画面

## 実装内容
- [ ] プロフィールページ
- [ ] ProfileHeaderコンポーネント
- [ ] ProfileFormコンポーネント
- [ ] PasswordChangeFormコンポーネント
- [ ] PUT /api/user/profile API
- [ ] PUT /api/user/password API

## 機能
- プロフィール表示
- ユーザー名変更
- パスワード変更
- 統計情報表示

## 受け入れ条件
- [ ] プロフィール情報が表示される
- [ ] ユーザー名変更が動作する
- [ ] パスワード変更が動作する
```

### Phase 5: 最適化・デプロイ（Issue #15-17）

#### Issue #15: パフォーマンス最適化

```markdown
Title: パフォーマンス最適化
Labels: optimization, phase-5

## 概要
アプリケーションのパフォーマンス改善

## 実装内容
- [ ] 画像最適化（next/image使用）
- [ ] コード分割（dynamic import）
- [ ] キャッシング戦略
- [ ] バンドルサイズ削減
- [ ] React Server Components活用

## 確認項目
- [ ] Lighthouseスコア80以上
- [ ] バンドルサイズ分析実施
- [ ] 不要なコード削除

## 受け入れ条件
- [ ] ビルドが正常に完了する
- [ ] パフォーマンスが改善されている
```

#### Issue #16: エラーハンドリングとロギング

```markdown
Title: エラーハンドリングとロギング
Labels: infrastructure, phase-5

## 概要
統一的なエラーハンドリングとロギング機能

## 実装内容
- [ ] errorHandler.ts作成
- [ ] logger.ts作成
- [ ] エラーページ (error.tsx)
- [ ] 404ページ (not-found.tsx)
- [ ] APIエラーの統一処理

## エラータイプ
- バリデーションエラー
- 認証エラー
- データベースエラー
- ネットワークエラー

## 受け入れ条件
- [ ] エラーが適切にハンドリングされる
- [ ] ユーザーフレンドリーなエラーメッセージ
- [ ] エラーログが記録される
```

#### Issue #17: Vercelへのデプロイ設定

```markdown
Title: Vercelへのデプロイ設定
Labels: deployment, phase-5, priority:high

## 概要
本番環境へのデプロイ準備とVercel設定

## 実装内容
- [ ] Vercelプロジェクト作成
- [ ] 環境変数設定
- [ ] ビルド設定確認
- [ ] デプロイ実行
- [ ] 本番環境動作確認
- [ ] README.mdにデプロイ手順追記

## 環境変数
- DATABASE_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## 受け入れ条件
- [ ] Vercelに正常にデプロイできる
- [ ] 本番環境で動作確認完了
- [ ] 環境変数が正しく設定されている
```

---

## Issue管理のワークフロー

### 1. Issueの選択

```powershell
# GitHub CLIでIssue一覧確認
gh issue list

# 特定のラベルで絞り込み
gh issue list --label "phase-1"

# Issueの詳細確認
gh issue view 1
```

### 2. ブランチ作成

```powershell
# mainから最新を取得
git checkout main
git pull origin main

# Issueに対応するブランチ作成
git checkout -b feature/issue-1-prisma-setup
```

### 3. 開発作業

```powershell
# Claude CLIで作業
claude code

# プロンプト例:
"Issue #1のPrismaスキーマを作成してください"
```

### 4. コミット

```powershell
# 変更確認
git status
git diff

# ステージング
git add .

# コミット（Issue番号を含める）
git commit -m "feat: Add Prisma schema for User, Product, GameRecord (#1)"

# 追加のコミット
git commit -m "docs: Update README with Prisma setup instructions (#1)"
```

### 5. プッシュ

```powershell
# リモートにプッシュ
git push -u origin feature/issue-1-prisma-setup
```

### 6. プルリクエスト作成

```powershell
# GitHub CLIでPR作成
gh pr create --title "feat: Add Prisma schema (#1)" --body "Closes #1"

# またはブラウザで作成
# GitHubのリポジトリページで "Compare & pull request" をクリック
```

### 7. レビュー・マージ

```powershell
# PRの状態確認
gh pr status

# マージ（GitHubのUIで承認後）
gh pr merge 1 --squash
```

### 8. ブランチ削除

```powershell
# mainに戻る
git checkout main
git pull origin main

# ローカルブランチ削除
git branch -d feature/issue-1-prisma-setup

# リモートブランチ削除
git push origin --delete feature/issue-1-prisma-setup
```

---

## ラベル体系

### 種類（Type）

- `feature`: 新機能
- `bug`: バグ修正
- `docs`: ドキュメント
- `refactor`: リファクタリング
- `test`: テスト追加
- `chore`: その他のタスク

### Phase

- `phase-1`: プロジェクト基盤
- `phase-2`: コア機能実装
- `phase-3`: ゲームロジック
- `phase-4`: UI/UX改善
- `phase-5`: 最適化・デプロイ

### 優先度（Priority）

- `priority:high`: 高優先度
- `priority:medium`: 中優先度
- `priority:low`: 低優先度

### 状態（Status）

- `status:blocked`: ブロックされている
- `status:in-progress`: 作業中
- `status:review`: レビュー待ち

---

## GitHub Projectsの活用

### プロジェクトボード設定

1. リポジトリの「Projects」タブから新規プロジェクト作成
2. テンプレート: 「Team backlog」を選択
3. カラム構成:
   - **Backlog**: 未着手
   - **Ready**: 着手可能
   - **In Progress**: 作業中
   - **In Review**: レビュー中
   - **Done**: 完了

### Issueの移動

- IssueをPhaseごとにBacklogに追加
- 作業開始時にIn Progressに移動
- PR作成時にIn Reviewに移動
- マージ完了でDoneに移動

---

## 参考資料

- [GitHub Issues Documentation](https://docs.github.com/issues)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [GitHub Projects Documentation](https://docs.github.com/issues/planning-and-tracking-with-projects)

---

このガイドに従ってIssue管理を行うことで、プロジェクトの進捗を可視化し、効率的に開発を進めることができます。
