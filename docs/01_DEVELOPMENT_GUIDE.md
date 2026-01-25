# 開発ガイド

## 開発フェーズ概要

本プロジェクトは5つのPhaseに分けて開発します。各Phaseには複数のIssueが含まれます。

| Phase | 説明 | Issue数 |
|-------|------|---------|
| Phase 1 | プロジェクト基盤 | Issue #1-3 |
| Phase 2 | コア機能実装 | Issue #4-7 |
| Phase 3 | ゲームロジック | Issue #8-11 |
| Phase 4 | UI/UX改善 | Issue #12-14 |
| Phase 5 | 最適化・デプロイ | Issue #15-17 |

---

## Phase 1: プロジェクト基盤（Issue #1-3）

### Issue #1: プロジェクトセットアップとPrismaスキーマ作成

**目的**: Next.js 14プロジェクトの初期化とデータベーススキーマの設計

**タスク**:
1. Next.jsプロジェクト作成（完了している場合はスキップ）
2. Prismaスキーマ定義
3. 初回マイグレーション実行

**Prismaスキーマ設計**:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ユーザー情報
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  gameRecords GameRecord[]
  products    Product[]
}

// 製品マスタ
model Product {
  id          String   @id @default(uuid())
  name        String
  setupTime   Int      // 標準段取り時間（秒）
  description String?
  createdAt   DateTime @default(now())
  userId      String

  user         User         @relation(fields: [userId], references: [id])
  gameRecords  GameRecord[]
}

// ゲーム記録
model GameRecord {
  id              String   @id @default(uuid())
  userId          String
  productId       String
  actualSetupTime Int      // 実際の段取り時間（秒）
  score           Int      // スコア
  completedAt     DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@index([userId, completedAt])
  @@index([score])
}
```

**Claude CLIプロンプト**:

```
製造業向け段取りシミュレーションゲームのPrismaスキーマを作成してください。

要件:
- User（ユーザー）、Product（製品）、GameRecord（ゲーム記録）の3つのモデル
- PostgreSQL使用
- UUID主キー
- 適切なリレーション設定
- インデックス設定

作成後、マイグレーションファイルも生成してください。
```

**実行コマンド**:

```powershell
# Prismaクライアント生成
npx prisma generate

# マイグレーション作成と実行
npx prisma migrate dev --name init

# Prisma Studioで確認
npx prisma studio
```

---

### Issue #2: Supabase認証の統合

**目的**: Supabase Authを使ったユーザー認証機能の実装

**タスク**:
1. Supabaseクライアント設定
2. 認証コンポーネント作成（ログイン、サインアップ）
3. 認証状態管理（Zustand）

**ファイル構成**:

```
src/
├── lib/
│   └── supabase.ts           # Supabaseクライアント
├── store/
│   └── authStore.ts          # 認証状態管理
├── components/
│   └── auth/
│       ├── LoginForm.tsx     # ログインフォーム
│       └── SignupForm.tsx    # サインアップフォーム
└── app/
    ├── login/
    │   └── page.tsx          # ログインページ
    └── signup/
        └── page.tsx          # サインアップページ
```

**Claude CLIプロンプト**:

```
Supabase Authを使った認証機能を実装してください。

必要なファイル:
1. src/lib/supabase.ts - Supabaseクライアント初期化
2. src/store/authStore.ts - Zustandで認証状態管理
3. src/components/auth/LoginForm.tsx - ログインフォーム
4. src/components/auth/SignupForm.tsx - サインアップフォーム
5. src/app/login/page.tsx - ログインページ
6. src/app/signup/page.tsx - サインアップページ

機能:
- メール/パスワード認証
- エラーハンドリング
- ログイン状態の永続化
- リダイレクト処理

TailwindCSSでスタイリングしてください。
```

---

### Issue #3: 基本レイアウトとナビゲーション

**目的**: アプリケーション全体のレイアウトとナビゲーションUI

**タスク**:
1. ルートレイアウトの作成
2. ヘッダー・フッターコンポーネント
3. ナビゲーションメニュー
4. レスポンシブ対応

**Claude CLIプロンプト**:

```
製造業向けゲームの基本レイアウトを作成してください。

必要なコンポーネント:
1. src/components/layout/Header.tsx - ヘッダー（ロゴ、ナビゲーション、ユーザーメニュー）
2. src/components/layout/Footer.tsx - フッター
3. src/components/layout/Navigation.tsx - ナビゲーションメニュー
4. src/app/layout.tsx - ルートレイアウト更新

機能:
- レスポンシブデザイン
- 認証状態に応じたメニュー切り替え
- アクティブリンクのハイライト
- モバイルメニュー（ハンバーガーメニュー）

デザイン:
- TailwindCSSを使用
- シンプルで見やすいデザイン
- ブランドカラー: ブルー系
```

---

## Phase 2: コア機能実装（Issue #4-7）

### Issue #4: 製品マスタ管理機能

**目的**: 製品の登録、編集、削除機能

**タスク**:
1. 製品一覧画面
2. 製品登録フォーム
3. 製品編集・削除機能
4. APIルート実装

**Claude CLIプロンプト**:

```
製品マスタ管理機能を実装してください。

APIルート（src/app/api/products/）:
- GET /api/products - 製品一覧取得
- POST /api/products - 製品登録
- PUT /api/products/[id] - 製品更新
- DELETE /api/products/[id] - 製品削除

ページ（src/app/products/）:
- /products - 製品一覧ページ
- /products/new - 製品登録ページ
- /products/[id]/edit - 製品編集ページ

コンポーネント（src/components/products/）:
- ProductList.tsx - 製品一覧表示
- ProductForm.tsx - 製品登録・編集フォーム
- ProductCard.tsx - 製品カード表示

Prismaを使ったCRUD操作を実装してください。
```

---

### Issue #5: ゲーム画面のUI実装

**目的**: 段取りシミュレーションのメインUI

**タスク**:
1. ゲーム画面レイアウト
2. 製品選択UI
3. タイマー表示
4. アクションボタン

**Claude CLIプロンプト**:

```
段取りシミュレーションゲームのメイン画面を作成してください。

ページ: src/app/game/page.tsx

コンポーネント（src/components/game/）:
- GameBoard.tsx - ゲームのメインボード
- ProductSelector.tsx - 製品選択UI
- SetupTimer.tsx - 段取り時間タイマー表示
- ActionButtons.tsx - ゲームアクションボタン
- ScoreDisplay.tsx - スコア表示

機能:
- 製品選択ドロップダウン
- スタート/ストップボタン
- リアルタイムタイマー表示
- スコア計算と表示

デザイン:
- 大きく見やすいタイマー表示
- 直感的な操作ボタン
- レスポンシブレイアウト
```

---

### Issue #6: ゲームロジックの状態管理

**目的**: Zustandを使ったゲーム状態の管理

**タスク**:
1. ゲームストアの作成
2. タイマー管理ロジック
3. スコア計算ロジック
4. ゲーム記録保存

**Claude CLIプロンプト**:

```
Zustandを使ったゲーム状態管理を実装してください。

ファイル: src/store/gameStore.ts

状態:
- currentProduct: 選択中の製品
- isRunning: タイマー実行中フラグ
- elapsedTime: 経過時間（秒）
- score: 現在のスコア
- gameRecords: ゲーム記録の配列

アクション:
- selectProduct(productId): 製品選択
- startTimer(): タイマー開始
- stopTimer(): タイマー停止
- calculateScore(): スコア計算
- saveGameRecord(): ゲーム記録保存
- resetGame(): ゲームリセット

スコア計算ロジック:
- 基準時間より早く完了: 高スコア
- 基準時間通り: 標準スコア
- 基準時間より遅い: 低スコア
- 計算式: score = Math.max(0, 1000 - (actualTime - standardTime) * 10)
```

---

### Issue #7: ゲーム記録保存API

**目的**: ゲーム結果をデータベースに保存するAPI

**タスク**:
1. ゲーム記録保存APIエンドポイント
2. スコアランキング取得API
3. ユーザーの過去記録取得API

**Claude CLIプロンプト**:

```
ゲーム記録保存APIを実装してください。

APIルート（src/app/api/game-records/）:
- POST /api/game-records - ゲーム記録保存
- GET /api/game-records - ユーザーの記録一覧取得
- GET /api/game-records/ranking - スコアランキング取得

機能:
- Prismaを使ったデータベース操作
- 認証チェック（ログインユーザーのみ）
- エラーハンドリング
- バリデーション

レスポンス形式:
- 成功: { success: true, data: {...} }
- 失敗: { success: false, error: "エラーメッセージ" }
```

---

## Phase 3: ゲームロジック（Issue #8-11）

### Issue #8: タイマー機能の実装

**目的**: 高精度なタイマー機能の実装

**Claude CLIプロンプト**:

```
React Hooksを使った高精度タイマー機能を実装してください。

カスタムフック: src/hooks/useTimer.ts

機能:
- start(): タイマー開始
- stop(): タイマー停止
- reset(): タイマーリセット
- 経過時間を秒単位で返す
- setIntervalを使った1秒ごとの更新

使用例:
const { elapsedTime, isRunning, start, stop, reset } = useTimer();
```

---

### Issue #9: スコア計算ロジックの改善

**目的**: より詳細なスコア計算システム

**Claude CLIプロンプト**:

```
段取り時間に基づく詳細なスコア計算ロジックを実装してください。

ファイル: src/lib/scoreCalculator.ts

関数:
1. calculateScore(actualTime, standardTime): 基本スコア計算
2. calculateBonus(actualTime, standardTime): ボーナスポイント計算
3. calculateGrade(score): 評価ランク（S, A, B, C, D）

計算式:
- 基本スコア = 1000点からの減点方式
- 標準時間の80%以下: ボーナス+200点
- 標準時間の90%以下: ボーナス+100点
- 標準時間を超過: 1秒あたり-20点
- 最低スコア: 0点

評価ランク:
- S: 1200点以上
- A: 1000-1199点
- B: 800-999点
- C: 600-799点
- D: 599点以下
```

---

### Issue #10: ゲームフロー制御

**目的**: ゲーム開始から終了までのフロー管理

**Claude CLIプロンプト**:

```
ゲームフローを管理するコンポーネントを作成してください。

コンポーネント: src/components/game/GameController.tsx

フロー:
1. 製品選択状態（IDLE）
2. ゲーム開始確認
3. タイマー実行中（RUNNING）
4. ゲーム終了
5. 結果表示（FINISHED）
6. 記録保存

状態遷移:
IDLE → RUNNING → FINISHED → IDLE

機能:
- 状態に応じたUI切り替え
- エラーハンドリング
- 確認ダイアログ表示
- トースト通知（react-hot-toast使用）
```

---

### Issue #11: リアルタイムバリデーション

**目的**: 不正な操作を防ぐバリデーション

**Claude CLIプロンプト**:

```
ゲーム中のバリデーション機能を実装してください。

ファイル: src/lib/gameValidation.ts

バリデーション項目:
1. 製品が選択されているか
2. タイマーが二重起動していないか
3. タイマー実行中に製品変更できないか
4. スコアが適正範囲か（0-2000点）
5. 経過時間が妥当か（0-3600秒）

関数:
- validateProductSelection(productId): 製品選択チェック
- validateTimerState(isRunning): タイマー状態チェック
- validateScore(score): スコア範囲チェック
- validateGameRecord(record): ゲーム記録の整合性チェック

エラーメッセージをToast表示する。
```

---

## Phase 4: UI/UX改善（Issue #12-14）

### Issue #12: ダッシュボード画面

**目的**: ユーザーのゲーム統計を表示するダッシュボード

**Claude CLIプロンプト**:

```
ユーザーダッシュボード画面を作成してください。

ページ: src/app/dashboard/page.tsx

コンポーネント（src/components/dashboard/）:
- StatsCard.tsx - 統計カード（総プレイ回数、平均スコアなど）
- RecentRecords.tsx - 最近のゲーム記録
- ScoreChart.tsx - スコア推移グラフ（簡易版、CSSのみ）
- PersonalBest.tsx - 自己ベスト記録

表示項目:
- 総プレイ回数
- 平均スコア
- 最高スコア
- 最近5件のプレイ記録
- スコアランク分布

デザイン:
- カードレイアウト
- グリッドシステム
- レスポンシブ対応
```

---

### Issue #13: ランキング画面

**目的**: 全ユーザーのスコアランキング表示

**Claude CLIプロンプト**:

```
スコアランキング画面を作成してください。

ページ: src/app/ranking/page.tsx

コンポーネント（src/components/ranking/）:
- RankingTable.tsx - ランキングテーブル
- RankingFilter.tsx - フィルター（全体、製品別）
- UserRankBadge.tsx - ユーザーの順位バッジ

機能:
- トップ100のランキング表示
- 製品別フィルタリング
- 自分の順位をハイライト
- ページネーション（10件ずつ）

表示項目:
- 順位
- ユーザー名
- スコア
- 評価ランク
- プレイ日時
```

---

### Issue #14: プロフィール画面

**目的**: ユーザープロフィールと設定画面

**Claude CLIプロンプト**:

```
ユーザープロフィール画面を作成してください。

ページ: src/app/profile/page.tsx

コンポーネント（src/components/profile/）:
- ProfileHeader.tsx - プロフィールヘッダー
- ProfileForm.tsx - プロフィール編集フォーム
- PasswordChangeForm.tsx - パスワード変更フォーム
- AccountSettings.tsx - アカウント設定

機能:
1. プロフィール表示
   - ユーザー名
   - メールアドレス
   - 登録日
   - 統計情報

2. プロフィール編集
   - ユーザー名変更
   - 保存処理

3. パスワード変更
   - 現在のパスワード入力
   - 新しいパスワード入力
   - 確認パスワード入力

APIエンドポイント:
- PUT /api/user/profile - プロフィール更新
- PUT /api/user/password - パスワード変更
```

---

## Phase 5: 最適化・デプロイ（Issue #15-17）

### Issue #15: パフォーマンス最適化

**目的**: アプリケーションのパフォーマンス改善

**Claude CLIプロンプト**:

```
Next.js 14のパフォーマンス最適化を実施してください。

最適化項目:
1. 画像最適化
   - next/imageコンポーネントの使用
   - 遅延読み込み

2. コード分割
   - dynamic importの活用
   - ルートベースの分割

3. キャッシング
   - React Server Componentsの活用
   - APIレスポンスのキャッシング

4. バンドルサイズ削減
   - 未使用コードの削除
   - tree-shakingの確認

確認コマンド:
npm run build
npm run analyze（要: @next/bundle-analyzer）
```

---

### Issue #16: エラーハンドリングとロギング

**目的**: 統一的なエラーハンドリング

**Claude CLIプロンプト**:

```
エラーハンドリングとロギング機能を実装してください。

ファイル:
1. src/lib/errorHandler.ts - エラーハンドラー
2. src/lib/logger.ts - ロガー
3. src/app/error.tsx - エラーページ
4. src/app/not-found.tsx - 404ページ

機能:
- グローバルエラーハンドラー
- APIエラーの統一処理
- クライアントエラーのログ記録
- ユーザーフレンドリーなエラーメッセージ

エラータイプ:
- バリデーションエラー
- 認証エラー
- データベースエラー
- ネットワークエラー
```

---

### Issue #17: Vercelへのデプロイ設定

**目的**: 本番環境へのデプロイ準備

**タスク**:
1. Vercelプロジェクト作成
2. 環境変数設定
3. ビルド設定確認
4. デプロイ実行

**デプロイ手順**:

```powershell
# Vercel CLIインストール
npm i -g vercel

# Vercelログイン
vercel login

# プロジェクト初期化
vercel

# 環境変数設定（Vercelダッシュボードで設定）
# - DATABASE_URL
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# 本番デプロイ
vercel --prod
```

**Claude CLIプロンプト**:

```
Vercelデプロイ用の設定を確認してください。

チェック項目:
1. next.config.js - 本番用設定
2. .vercelignore - 除外ファイル
3. vercel.json - Vercel設定ファイル（必要に応じて）
4. README.md - デプロイ手順の追記

本番環境チェックリスト:
- 環境変数の設定完了
- データベース接続確認
- ビルドエラーなし
- ESLintエラーなし
- TypeScriptエラーなし
- 本番用エラーページ設定
```

---

## 開発のベストプラクティス

### 1. コミットメッセージ規約

```
<type>: <subject>

type:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: フォーマット
- refactor: リファクタリング
- test: テスト追加
- chore: その他

例:
feat: Add product management feature (#4)
fix: Fix timer reset bug (#8)
docs: Update README with setup instructions
```

### 2. プルリクエストテンプレート

```markdown
## 概要
このPRの目的を簡潔に説明

## 変更内容
- 変更点1
- 変更点2

## 関連Issue
Closes #X

## テスト
- [ ] ローカルでテスト済み
- [ ] ビルドエラーなし
- [ ] ESLintエラーなし

## スクリーンショット
（必要に応じて）
```

### 3. コードレビューのポイント

- TypeScript型の適切な使用
- エラーハンドリングの実装
- レスポンシブデザインの確認
- パフォーマンスへの影響
- セキュリティの考慮

---

## トラブルシューティング

### Prismaマイグレーションエラー

```powershell
# マイグレーションをリセット
npx prisma migrate reset

# 強制的にマイグレーション適用
npx prisma db push
```

### Supabase接続エラー

- 環境変数の確認
- Supabaseプロジェクトの状態確認
- データベースURLの形式確認

### ビルドエラー

```powershell
# 依存関係の再インストール
rm -rf node_modules
npm install

# Next.jsキャッシュクリア
rm -rf .next
npm run build
```

---

## 次のステップ

各Issueを順番に実装し、完了したらプルリクエストを作成してmainブランチにマージしていきます。詳細は[Issue管理ガイド](./03_ISSUE_MANAGEMENT.md)を参照してください。
