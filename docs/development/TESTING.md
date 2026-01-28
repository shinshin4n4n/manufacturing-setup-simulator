# テスト戦略ドキュメント

## 概要

このドキュメントは、製造業向け段取りシミュレーションゲームのテスト戦略を記述します。

## テスト方針

### テストピラミッド

```
        /\
       /  \
      / E2E \ ← エンドツーエンドテスト（少数）
     /______\
    /        \
   / 統合     \ ← 統合テスト（中程度）
  /__________\
 /            \
/ ユニット     \ ← ユニットテスト（多数）
/______________\
```

### テストの種類と比率

| テストタイプ | 割合 | 説明 |
|-------------|------|------|
| **ユニットテスト** | 70% | 個別の関数・コンポーネントのテスト |
| **統合テスト** | 20% | 複数のモジュール間の連携テスト |
| **E2Eテスト** | 10% | ユーザーシナリオの完全なテスト |

### テスト原則

1. **信頼性**: テストは決定論的で、再現可能であること
2. **速度**: テストは高速に実行できること
3. **独立性**: テストは他のテストに依存しないこと
4. **明確性**: テストの意図が明確であること
5. **保守性**: テストコードも本番コードと同じ品質であること

---

## カバレッジ基準

### 目標カバレッジ

| 項目 | 目標 | 現在 |
|------|------|------|
| **全体カバレッジ** | 60%以上 | TBD |
| **重要ビジネスロジック** | 90%以上 | TBD |
| **APIエンドポイント** | 80%以上 | TBD |
| **UIコンポーネント** | 50%以上 | TBD |

### カバレッジの種類

- **ラインカバレッジ**: コードの各行が実行されたか
- **分岐カバレッジ**: すべての分岐（if/else）が実行されたか
- **関数カバレッジ**: すべての関数が呼び出されたか
- **ステートメントカバレッジ**: すべてのステートメントが実行されたか

---

## テスト実行方法

### テストフレームワーク

| ツール | バージョン | 用途 |
|-------|-----------|------|
| **Jest** | ^29.x | ユニット・統合テスト |
| **React Testing Library** | ^14.x | Reactコンポーネントテスト |
| **Playwright** | ^1.x（将来） | E2Eテスト |
| **MSW** | ^2.x（将来） | APIモック |

### セットアップ（将来実装予定）

#### 1. 依存関係のインストール

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

#### 2. Jest設定ファイル（jest.config.js）

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/_*.{js,jsx,ts,tsx}',
  ],
  coverageThresholds: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

#### 3. Jest セットアップファイル（jest.setup.js）

```javascript
import '@testing-library/jest-dom'
```

### テストコマンド

#### すべてのテストを実行

```bash
npm test
```

#### ウォッチモード（開発中）

```bash
npm test -- --watch
```

#### カバレッジレポート生成

```bash
npm run test:coverage
```

#### 特定のファイルのみテスト

```bash
npm test -- src/lib/utils/index.test.ts
```

#### 更新されたファイルのみテスト

```bash
npm test -- --onlyChanged
```

### カバレッジレポートの確認

カバレッジレポートは`coverage/`ディレクトリに生成されます。

#### HTMLレポートを開く

```bash
# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

---

## テストの書き方

### ディレクトリ構造

テストファイルはテスト対象ファイルと同じディレクトリに配置します。

```
src/
├── lib/
│   └── utils/
│       ├── index.ts           ← テスト対象
│       └── index.test.ts      ← テストファイル
├── components/
│   └── game/
│       ├── EquipmentCard.tsx  ← テスト対象
│       └── EquipmentCard.test.tsx ← テストファイル
└── app/
    └── api/
        └── game/
            └── start/
                ├── route.ts        ← テスト対象
                └── route.test.ts   ← テストファイル
```

### ユニットテストの例

#### 1. ユーティリティ関数のテスト

**テスト対象: `src/lib/utils/index.ts`**

```typescript
// src/lib/utils/index.ts
export function calculateScore(playerTime: number, optimalTime: number): number {
  if (playerTime <= 0 || optimalTime <= 0) {
    throw new Error('Time must be positive');
  }
  return Math.min(100, (optimalTime / playerTime) * 100);
}

export function getRank(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 95) return 'S';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}
```

**テストファイル: `src/lib/utils/index.test.ts`**

```typescript
// src/lib/utils/index.test.ts
import { calculateScore, getRank } from './index';

describe('calculateScore', () => {
  test('最適時間と同じ場合、スコアは100', () => {
    const result = calculateScore(100, 100);
    expect(result).toBe(100);
  });

  test('最適時間より遅い場合、スコアは100未満', () => {
    const result = calculateScore(200, 100);
    expect(result).toBe(50);
  });

  test('最適時間より早い場合、スコアは100', () => {
    const result = calculateScore(80, 100);
    expect(result).toBe(100);
  });

  test('プレイヤー時間が0以下の場合、エラー', () => {
    expect(() => calculateScore(0, 100)).toThrow('Time must be positive');
    expect(() => calculateScore(-10, 100)).toThrow('Time must be positive');
  });

  test('最適時間が0以下の場合、エラー', () => {
    expect(() => calculateScore(100, 0)).toThrow('Time must be positive');
    expect(() => calculateScore(100, -10)).toThrow('Time must be positive');
  });
});

describe('getRank', () => {
  test.each([
    [100, 'S'],
    [95, 'S'],
    [94, 'A'],
    [85, 'A'],
    [84, 'B'],
    [70, 'B'],
    [69, 'C'],
    [50, 'C'],
    [49, 'D'],
    [0, 'D'],
  ])('スコア%iはランク%s', (score, expectedRank) => {
    expect(getRank(score)).toBe(expectedRank);
  });
});
```

#### 2. Reactコンポーネントのテスト

**テスト対象: `src/components/ui/Button.tsx`**

```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, disabled, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
    >
      {children}
    </button>
  );
}
```

**テストファイル: `src/components/ui/Button.test.tsx`**

```typescript
// src/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('ボタンがレンダリングされる', () => {
    render(<Button>クリック</Button>);
    expect(screen.getByText('クリック')).toBeInTheDocument();
  });

  test('クリックイベントが発火する', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>クリック</Button>);

    fireEvent.click(screen.getByText('クリック'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disabled状態ではクリックできない', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>クリック</Button>);

    fireEvent.click(screen.getByText('クリック'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('primary variantのクラスが適用される', () => {
    render(<Button variant="primary">クリック</Button>);
    const button = screen.getByText('クリック');
    expect(button).toHaveClass('btn-primary');
  });

  test('secondary variantのクラスが適用される', () => {
    render(<Button variant="secondary">クリック</Button>);
    const button = screen.getByText('クリック');
    expect(button).toHaveClass('btn-secondary');
  });
});
```

#### 3. APIエンドポイントのテスト

**テスト対象: `src/app/api/game/start/route.ts`**

**テストファイル: `src/app/api/game/start/route.test.ts`**

```typescript
// src/app/api/game/start/route.test.ts
import { POST } from './route';
import { NextRequest } from 'next/server';

// Prismaのモック
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    equipment: {
      findMany: jest.fn(),
    },
  },
}));

// ユーティリティ関数のモック
jest.mock('@/lib/utils', () => ({
  findOptimalSequence: jest.fn(),
}));

describe('POST /api/game/start', () => {
  test('正常なリクエストでセッションデータが返される', async () => {
    // モックデータ
    const mockEquipments = [
      { id: '1', code: 'LATHE-A', name: '旋盤A', description: null },
      { id: '2', code: 'LATHE-B', name: '旋盤B', description: null },
    ];

    const mockOptimalResult = {
      sequence: ['1', '2'],
      time: 30,
    };

    // モック設定
    const { prisma } = require('@/lib/db/prisma');
    const { findOptimalSequence } = require('@/lib/utils');
    prisma.equipment.findMany.mockResolvedValue(mockEquipments);
    findOptimalSequence.mockResolvedValue(mockOptimalResult);

    // リクエスト作成
    const request = new NextRequest('http://localhost:3000/api/game/start', {
      method: 'POST',
      body: JSON.stringify({ difficulty: 1 }),
    });

    // APIコール
    const response = await POST(request);
    const data = await response.json();

    // アサーション
    expect(response.status).toBe(200);
    expect(data.sessionId).toBeDefined();
    expect(data.equipments).toEqual(mockEquipments);
    expect(data.optimalTime).toBe(30);
    expect(data.optimalSequence).toEqual(['1', '2']);
  });

  test('不正な難易度でエラーが返される', async () => {
    const request = new NextRequest('http://localhost:3000/api/game/start', {
      method: 'POST',
      body: JSON.stringify({ difficulty: 10 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid difficulty');
  });
});
```

---

## テストのベストプラクティス

### 1. テストの命名

**Good:**

```typescript
test('最適時間と同じ場合、スコアは100', () => {
  // ...
});
```

**Bad:**

```typescript
test('test1', () => {
  // ...
});
```

### 2. AAA（Arrange-Act-Assert）パターン

```typescript
test('ボタンクリックでカウントが増加する', () => {
  // Arrange（準備）
  const { getByText, getByTestId } = render(<Counter />);
  const button = getByText('増加');

  // Act（実行）
  fireEvent.click(button);

  // Assert（検証）
  expect(getByTestId('count')).toHaveTextContent('1');
});
```

### 3. テストの独立性

**Good:**

```typescript
describe('Counter', () => {
  test('初期値は0', () => {
    render(<Counter />);
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  test('ボタンクリックで増加', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('増加'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });
});
```

**Bad:**

```typescript
let counter: RenderResult;

describe('Counter', () => {
  beforeAll(() => {
    counter = render(<Counter />); // 他のテストに影響
  });

  test('初期値は0', () => {
    expect(counter.getByTestId('count')).toHaveTextContent('0');
  });

  test('ボタンクリックで増加', () => {
    fireEvent.click(counter.getByText('増加'));
    expect(counter.getByTestId('count')).toHaveTextContent('1'); // 前のテストに依存
  });
});
```

### 4. テストデータの作成

**Good:**

```typescript
function createMockEquipment(overrides = {}) {
  return {
    id: '1',
    code: 'LATHE-A',
    name: '旋盤A',
    description: null,
    ...overrides,
  };
}

test('設備が表示される', () => {
  const equipment = createMockEquipment({ name: 'テスト設備' });
  render(<EquipmentCard equipment={equipment} />);
  expect(screen.getByText('テスト設備')).toBeInTheDocument();
});
```

---

## CI/CD統合（将来実装予定）

### GitHub Actions設定例

`.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## テストカバレッジレポート

### 現在のカバレッジ（例）

| ファイル | ライン | 分岐 | 関数 | ステートメント |
|---------|--------|------|------|---------------|
| `src/lib/utils/index.ts` | 85% | 80% | 90% | 85% |
| `src/components/ui/Button.tsx` | 100% | 100% | 100% | 100% |
| `src/app/api/game/start/route.ts` | 75% | 70% | 80% | 75% |

---

## 今後の改善計画

### Phase 1: 基本テスト（現在）

- [ ] Jestセットアップ
- [ ] ユニットテストの作成
- [ ] カバレッジ目標60%達成

### Phase 2: 統合テスト

- [ ] MSWでAPIモック
- [ ] データベース統合テスト
- [ ] Prismaモックの改善

### Phase 3: E2Eテスト

- [ ] Playwrightセットアップ
- [ ] 重要フローのE2Eテスト
- [ ] ビジュアルリグレッションテスト

---

## サポート

テストに関する質問や問題がある場合は、GitHubのIssueで報告してください。

- GitHub Issues: https://github.com/yourusername/manufacturing-setup-simulator/issues
