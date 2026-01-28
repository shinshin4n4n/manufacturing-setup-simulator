# API仕様書

## 概要

このドキュメントは、製造業向け段取りシミュレーションゲームのAPIエンドポイント仕様を記述します。

## ベースURL

```
開発環境: http://localhost:3000
本番環境: https://your-app.vercel.app
```

## 共通仕様

### リクエストヘッダー

```http
Content-Type: application/json
```

### レスポンス形式

すべてのAPIレスポンスはJSON形式で返されます。

#### 成功レスポンス

```json
{
  "data": { ... },
  "status": 200
}
```

#### エラーレスポンス

```json
{
  "error": "エラーの種類",
  "message": "エラーの詳細メッセージ"
}
```

### HTTPステータスコード

| コード | 説明 |
|-------|------|
| 200 | 成功 |
| 400 | リクエストエラー（不正な入力） |
| 404 | リソースが見つからない |
| 500 | サーバーエラー |

---

## エンドポイント一覧

### 1. ゲーム開始

新しいゲームセッションを開始し、設備データと最適解を取得します。

#### エンドポイント

```
POST /api/game/start
```

#### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| difficulty | number | ✓ | 難易度（1-5） |

#### リクエスト例

```json
{
  "difficulty": 1
}
```

#### レスポンス（成功）

**ステータスコード**: `200 OK`

| フィールド | 型 | 説明 |
|-----------|-----|------|
| sessionId | string | セッションID（UUID） |
| equipments | array | 設備リスト |
| equipments[].id | string | 設備ID（UUID） |
| equipments[].code | string | 設備コード（例: LATHE-A） |
| equipments[].name | string | 設備名（例: 旋盤A） |
| equipments[].description | string \| null | 設備説明 |
| optimalTime | number | 最適な段取り時間（分） |
| optimalSequence | array | 最適な設備順序（設備ID配列） |

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "equipments": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "code": "LATHE-A",
      "name": "旋盤A",
      "description": "高精度汎用旋盤"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "code": "LATHE-B",
      "name": "旋盤B",
      "description": "高速旋盤"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "code": "MILL-A",
      "name": "フライス盤",
      "description": "NC フライス盤"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "code": "DRILL-A",
      "name": "ボール盤",
      "description": "縦型ボール盤"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "code": "GRIND-A",
      "name": "研削盤",
      "description": "平面研削盤"
    }
  ],
  "optimalTime": 190,
  "optimalSequence": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003",
    "550e8400-e29b-41d4-a716-446655440004",
    "550e8400-e29b-41d4-a716-446655440005"
  ]
}
```

#### エラーレスポンス

**1. 不正なJSON（400 Bad Request）**

```json
{
  "error": "Invalid JSON",
  "message": "Request body must be valid JSON"
}
```

**2. 不正な難易度（400 Bad Request）**

```json
{
  "error": "Invalid difficulty",
  "message": "Difficulty must be a number"
}
```

または

```json
{
  "error": "Invalid difficulty",
  "message": "Difficulty must be between 1 and 5"
}
```

**3. 設備データなし（500 Internal Server Error）**

```json
{
  "error": "No equipment found",
  "message": "No equipment data available in the database"
}
```

**4. 計算エラー（500 Internal Server Error）**

```json
{
  "error": "Calculation error",
  "message": "Failed to calculate optimal sequence"
}
```

**5. 予期しないエラー（500 Internal Server Error）**

```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

#### 使用例（JavaScript）

```javascript
const response = await fetch('/api/game/start', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    difficulty: 1,
  }),
});

const data = await response.json();

if (response.ok) {
  console.log('Session ID:', data.sessionId);
  console.log('Equipments:', data.equipments);
  console.log('Optimal Time:', data.optimalTime);
} else {
  console.error('Error:', data.error, data.message);
}
```

---

### 2. ゲーム完了・スコア送信

ゲーム完了時にプレイヤーの結果を送信し、スコアとランキングを取得します。

#### エンドポイント

```
POST /api/game/submit
```

#### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| playerName | string | ✓ | プレイヤー名（空文字不可） |
| sequence | array | ✓ | プレイヤーが選択した設備順序（設備ID配列） |
| totalTime | number | ✓ | 合計段取り時間（分） |
| difficulty | number | ✓ | 難易度（1-5） |
| hintsUsed | number | - | 使用したヒント数（デフォルト: 0） |

#### リクエスト例

```json
{
  "playerName": "山田太郎",
  "sequence": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003",
    "550e8400-e29b-41d4-a716-446655440004",
    "550e8400-e29b-41d4-a716-446655440005"
  ],
  "totalTime": 200,
  "difficulty": 1,
  "hintsUsed": 1
}
```

#### レスポンス（成功）

**ステータスコード**: `200 OK`

| フィールド | 型 | 説明 |
|-----------|-----|------|
| score | number | スコア（0-100） |
| rank | string | ランク（S/A/B/C/D） |
| optimalTime | number | 最適な段取り時間（分） |
| ranking | number | ランキング順位（1位から） |

```json
{
  "score": 90.25,
  "rank": "A",
  "optimalTime": 190,
  "ranking": 12
}
```

#### ランク判定基準

| ランク | スコア範囲 |
|-------|-----------|
| S | 95〜100 |
| A | 85〜94 |
| B | 70〜84 |
| C | 50〜69 |
| D | 0〜49 |

#### スコア計算式

```
baseScore = 100 × (optimalTime / playerTime)
score = baseScore × (1 - 0.05 × hintsUsed)
```

- **ヒントペナルティ**: 1ヒント使用ごとに5%減少

#### エラーレスポンス

**1. 不正なJSON（400 Bad Request）**

```json
{
  "error": "Invalid JSON",
  "message": "Request body must be valid JSON"
}
```

**2. 不正なプレイヤー名（400 Bad Request）**

```json
{
  "error": "Invalid playerName",
  "message": "Player name must be a non-empty string"
}
```

**3. 不正な設備順序（400 Bad Request）**

```json
{
  "error": "Invalid sequence",
  "message": "Sequence must be a non-empty array"
}
```

または

```json
{
  "error": "Invalid sequence",
  "message": "Failed to calculate setup time from sequence"
}
```

**4. 不正な合計時間（400 Bad Request）**

```json
{
  "error": "Invalid totalTime",
  "message": "Total time must be a positive number"
}
```

**5. 不正な難易度（400 Bad Request）**

```json
{
  "error": "Invalid difficulty",
  "message": "Difficulty must be a number between 1 and 5"
}
```

**6. 計算エラー（500 Internal Server Error）**

```json
{
  "error": "Calculation error",
  "message": "Failed to calculate optimal sequence"
}
```

**7. データベースエラー（500 Internal Server Error）**

```json
{
  "error": "Database error",
  "message": "Failed to save game session"
}
```

**8. 予期しないエラー（500 Internal Server Error）**

```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

#### 使用例（JavaScript）

```javascript
const response = await fetch('/api/game/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    playerName: '山田太郎',
    sequence: [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004',
      '550e8400-e29b-41d4-a716-446655440005',
    ],
    totalTime: 200,
    difficulty: 1,
    hintsUsed: 1,
  }),
});

const data = await response.json();

if (response.ok) {
  console.log('Score:', data.score);
  console.log('Rank:', data.rank);
  console.log('Ranking:', data.ranking);
} else {
  console.error('Error:', data.error, data.message);
}
```

---

### 3. ランキング取得

難易度別のランキングを取得します。

#### エンドポイント

```
GET /api/score/ranking
```

#### クエリパラメータ

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| difficulty | number | - | 1 | 難易度（1-5） |
| limit | number | - | 10 | 取得件数（1-100） |

#### リクエスト例

```
GET /api/score/ranking?difficulty=1&limit=10
```

#### レスポンス（成功）

**ステータスコード**: `200 OK`

| フィールド | 型 | 説明 |
|-----------|-----|------|
| rankings | array | ランキングリスト |
| rankings[].rank | number | 順位（1位から） |
| rankings[].playerName | string | プレイヤー名 |
| rankings[].score | number | スコア |
| rankings[].totalTime | number | 合計段取り時間（分） |
| rankings[].completedAt | string | 完了日時（ISO 8601形式） |
| total | number | 該当難易度の総エントリー数 |

```json
{
  "rankings": [
    {
      "rank": 1,
      "playerName": "山田太郎",
      "score": 95,
      "totalTime": 200,
      "completedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "rank": 2,
      "playerName": "鈴木一郎",
      "score": 92,
      "totalTime": 215,
      "completedAt": "2024-01-15T09:45:00.000Z"
    },
    {
      "rank": 3,
      "playerName": "佐藤花子",
      "score": 88,
      "totalTime": 230,
      "completedAt": "2024-01-14T18:20:00.000Z"
    },
    {
      "rank": 4,
      "playerName": "高橋健太",
      "score": 85,
      "totalTime": 250,
      "completedAt": "2024-01-13T14:15:00.000Z"
    },
    {
      "rank": 5,
      "playerName": "田中美咲",
      "score": 78,
      "totalTime": 280,
      "completedAt": "2024-01-13T11:00:00.000Z"
    }
  ],
  "total": 42
}
```

#### ランキングのソート順

1. **スコア降順**: 高いスコアが上位
2. **完了日時昇順**: 同じスコアの場合、早く完了した方が上位

#### エラーレスポンス

**1. 不正な難易度（400 Bad Request）**

```json
{
  "error": "Invalid difficulty",
  "message": "Difficulty must be a number"
}
```

または

```json
{
  "error": "Invalid difficulty",
  "message": "Difficulty must be between 1 and 5"
}
```

**2. 不正なリミット（400 Bad Request）**

```json
{
  "error": "Invalid limit",
  "message": "Limit must be a number"
}
```

または

```json
{
  "error": "Invalid limit",
  "message": "Limit must be at least 1"
}
```

または

```json
{
  "error": "Invalid limit",
  "message": "Limit cannot exceed 100"
}
```

**3. データベースエラー（500 Internal Server Error）**

```json
{
  "error": "Database error",
  "message": "Failed to count game sessions"
}
```

または

```json
{
  "error": "Database error",
  "message": "Failed to fetch rankings"
}
```

**4. 予期しないエラー（500 Internal Server Error）**

```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

#### 使用例（JavaScript）

```javascript
const difficulty = 1;
const limit = 10;

const response = await fetch(
  `/api/score/ranking?difficulty=${difficulty}&limit=${limit}`
);

const data = await response.json();

if (response.ok) {
  console.log('Rankings:', data.rankings);
  console.log('Total entries:', data.total);

  data.rankings.forEach((entry) => {
    console.log(
      `${entry.rank}位: ${entry.playerName} - ${entry.score}点 (${entry.totalTime}分)`
    );
  });
} else {
  console.error('Error:', data.error, data.message);
}
```

---

## その他のエンドポイント

### 4. 段取り時間計算

指定された設備順序の段取り時間を計算します（ゲーム中のリアルタイム計算用）。

#### エンドポイント

```
POST /api/game/calculate-time
```

#### リクエストボディ

```json
{
  "sequence": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002"
  ]
}
```

#### レスポンス

```json
{
  "totalTime": 30
}
```

---

### 5. ヒント取得

次に配置すべき最適な設備を取得します。

#### エンドポイント

```
POST /api/game/hint
```

#### リクエストボディ

```json
{
  "currentSequence": [
    "550e8400-e29b-41d4-a716-446655440001"
  ],
  "remainingEquipments": [
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003"
  ]
}
```

#### レスポンス

```json
{
  "hint": "550e8400-e29b-41d4-a716-446655440002",
  "setupTime": 30
}
```

---

## レート制限

現在、レート制限は実装されていませんが、将来的に以下の制限を検討しています。

| エンドポイント | 制限 |
|---------------|------|
| POST /api/game/start | 10リクエスト/分 |
| POST /api/game/submit | 5リクエスト/分 |
| GET /api/score/ranking | 30リクエスト/分 |

## CORS設定

開発環境では、すべてのオリジンからのリクエストを許可しています。本番環境では、特定のドメインのみ許可する予定です。

## API変更履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| v0.1.0 | 2024-01 | 初回リリース |

## テスト用curlコマンド

### ゲーム開始

```bash
curl -X POST http://localhost:3000/api/game/start \
  -H "Content-Type: application/json" \
  -d '{"difficulty": 1}'
```

### ゲーム完了

```bash
curl -X POST http://localhost:3000/api/game/submit \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "テストユーザー",
    "sequence": ["id1", "id2", "id3", "id4", "id5"],
    "totalTime": 200,
    "difficulty": 1,
    "hintsUsed": 0
  }'
```

### ランキング取得

```bash
curl -X GET "http://localhost:3000/api/score/ranking?difficulty=1&limit=10"
```

## サポート

API仕様に関する質問や問題がある場合は、GitHubのIssueで報告してください。

- GitHub Issues: https://github.com/yourusername/manufacturing-setup-simulator/issues
