# BIREX Design Guide

## App Context
코웨이 비렉스 매트리스 렌탈 견적 앱.
코웨이 홈케어닥터(방문판매원)가 고객 집에서 태블릿으로 직접 보여주며 렌탈 계약을 설득하는 현장 영업 도구.
고객이 3초 안에 핵심 숫자를 파악하고 계약 결정을 내릴 수 있어야 함.

## Reference
- Notion 앱 (주요 레퍼런스 — 차분함/가독성/미니멀/타이포그래피 위계)
- Apple Card 앱 (정보 계층 구조)
- 현대카드 앱 (숫자 표시 방식)
- 키워드: Calm, Clean, Readable, Minimal
- 레퍼런스 첨부 시 레이아웃만 참고, 색상/폰트는 본 가이드 기준 유지

## Design Principles (세션 36 추가)
```
1. 타이포그래피 위계로 정보 구분 — 색상/장식이 아닌 크기·굵기로 계층 표현
2. 단순한 선(1px solid)으로 영역 구분 — 라운드 카드, 그림자 대신 선
3. 여백으로 그룹핑 — 공간이 곧 구조
4. 시니어 가독성 우선 — 대비율 충분히, 핵심 숫자 크게
5. 장식 최소화 — 정보 전달에 불필요한 요소 제거
```

## Color System
Notion 스타일 — 차분함/가독성 우선 (2026-04-03 변경)
브랜드 컬러: 블루(#2eaadc) + 포인트 레드(#eb5757, 할인/절약 전용)

### Light Mode
| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| Background | --color-background | #FFFFFF | 순백 배경 |
| Surface | --color-surface | #f7f6f3 | 카드/섹션 배경 (Notion 워밍그레이) |
| Text Primary | --color-text-primary | #37352f | 본문, 핵심 숫자 (Notion 다크) |
| Text Secondary | --color-text-secondary | #787774 | 보조 텍스트 |
| Text Tertiary | --color-text-tertiary | #9b9a97 | 라벨, 캡션 |
| Text Disabled | --color-text-disabled | #c4c4c0 | 비활성 |
| Text On Dark | --color-text-on-dark | #FFFFFF | 항상-어두운 배경 위 (명세서/차트) |
| Text On Light | --color-text-on-light | #37352f | 항상-밝은 배경 위 |
| On Primary | --color-on-primary | #FFFFFF | accent 버튼 위 텍스트 |
| Border | --color-border | #e9e9e7 | 구분선 (중립 그레이) |
| Border Light | --color-border-light | #f1f1ef | 미세 구분선 |
| Accent | --color-accent | #2eaadc | 선택 상태, 버튼 (Notion 블루) |
| Accent Dark | --color-accent-dark | #2387aa | hover/pressed 상태 |
| Accent Light | --color-accent-light | #d3e5ef | 선택된 배경, 칩 배경 |
| Discount | --color-discount | #eb5757 | 할인, 절약 금액 (Notion 레드) |
| Green | --color-green | #4daa57 | Notion 그린 (프로퍼티 태그용) |
| Orange | --color-orange | #e9914b | Notion 오렌지 (프로퍼티 태그용) |

### Dark Mode
| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| Background | --color-background | #191919 | Notion 다크 배경 |
| Surface | --color-surface | #202020 | 카드/섹션 배경 |
| Text Primary | --color-text-primary | #FFFFFF | 본문 |
| Text Secondary | --color-text-secondary | rgba(255,255,255,0.81) | 보조 |
| Text Tertiary | --color-text-tertiary | rgba(255,255,255,0.55) | 라벨 |
| Text Disabled | --color-text-disabled | rgba(255,255,255,0.38) | 비활성 |
| Text On Dark | --color-text-on-dark | #FFFFFF | 항상-어두운 배경 위 |
| Text On Light | --color-text-on-light | #37352f | 항상-밝은 배경 위 |
| On Primary | --color-on-primary | #FFFFFF | accent 버튼 위 텍스트 |
| Accent | --color-accent | #2eaadc | 선택 상태, 버튼 |
| Accent Dark | --color-accent-dark | #2387aa | hover/pressed 상태 |
| Accent Light | --color-accent-light | rgba(46,170,220,0.15) | 선택된 배경 |
| Discount | --color-discount | #eb5757 | 할인 |
| Border | --color-border | #2f2f2f | 구분선 |
| Border Light | --color-border-light | #2a2a2a | 미세 구분선 |

### 도넛 세그먼트 색상
| Token | Value | Usage |
|-------|-------|-------|
| --color-dot-mattress | #9ec8b9 | 매트리스 세그먼트 |
| --color-dot-frame | #b7d9ad | 프레임 세그먼트 |
| --color-dot-care | #d4e7c5 | 케어 세그먼트 |

### 텍스트 색상 사용 규칙
```
일반 UI (테마 전환):
  본문        → var(--color-text-primary)
  보조        → var(--color-text-secondary)
  라벨/캡션    → var(--color-text-tertiary)
  비활성       → var(--color-text-disabled)

accent/버튼 배경 위:
  글자        → var(--color-on-primary)

항상-어두운 컴포넌트 (명세서, 비교차트, 스와이프):
  주요 텍스트  → var(--color-text-on-dark)
  보조 텍스트  → rgba(255,255,255,0.70)
  라벨        → rgba(255,255,255,0.50)

금지:
  - 하드코딩 색상 사용 금지 → 반드시 CSS 변수 사용
  - #03C75A(구 초록) 사용 금지 → #2eaadc(Notion 블루) 사용
  - 카드 브랜드 색상만 예외 허용
```

### Color Rules
- 메인 컬러: 블루(#2eaadc), 할인 포인트: 레드(#eb5757)
- 블루 외 불필요한 컬러 추가 금지
- 그라데이션 사용 금지
- 카드사 브랜드 색상은 해당 카드 표시 시에만 허용
- **보조/라벨 텍스트 opacity 0.35 이하 사용 금지** → WCAG AA 미달
- 디자인 미니멀함보다 가독성 우선 — 현장 사용 앱
- **Accent(#2eaadc) 배경 위**: 반드시 `#FFFFFF` 흰색 텍스트 (대비율 3.2:1, 짧은 텍스트 허용)
- **버튼 위 짧은 텍스트**: 흰색 허용

### 다크/라이트 모드 전환 주의사항
```
자주 발생하는 오류 패턴:
  1. 하드코딩 색상 사용 → 한쪽 모드에서 반드시 깨짐
     ❌ color: #FFFFFF   →   ✅ var(--color-text-primary)
     ❌ border: #E5E5E5  →   ✅ var(--color-border)

  2. 항상-어두운 컴포넌트에 테마 변수 사용
     ❌ var(--color-text-primary)  →  ✅ var(--color-text-on-dark)
     (명세서, 비교차트, 스와이프 영역은 모드 무관하게 항상 어두운 배경)

  3. Border 색상 하드코딩
     ❌ border: 1px solid #E5E5E5  →  ✅ border: 1px solid var(--color-border)

검수 시 반드시 라이트/다크 모드 둘 다 직접 전환하면서 확인할 것
```

## Typography

### Font Family
- 한글: Pretendard
- 영문/숫자: Inter, SF Pro Display
- `--font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif`
- `--font-number: 'Inter', 'SF Pro Display', 'Pretendard', sans-serif`

### 금액/숫자 표시
- HERO 금액: font-weight **200~300**, font-size 42~48px (Notion의 가벼운 숫자 느낌)
- 주요 금액: font-weight **600~700**, font-size 18~22px
- 보조 금액: font-weight **500**, font-size 14px
- letter-spacing: -0.02em ~ -0.04em (숫자 간격 좁게)
- font-family: var(--font-number)

### 라벨/텍스트
- 섹션 라벨: 11~12px, weight 500~600
- 본문: 13~14px, weight 400~500
- 강조: 14~16px, weight 600~700
- 제목: 16~17px, weight 700~800

### 선택 칩/탭 필터 글자 크기 변경 금지
> UI 정보 밀도가 높아 선택 칩(싱글/퀸/킹 등), 탭 필터 텍스트 크기를 키우면
> 화면 밖으로 잘리는 문제 발생. 해당 요소 font-size 절대 변경 금지.

## Spacing
- 섹션 간 여백: 40px (padding 28px + separator 8~12px)
- 항목 간 여백: 16px
- 내부 패딩: 16~20px (좌우), 20~24px (상하)
- 섹션 구분: `1px solid var(--color-border)` 또는 여백만으로 구분

## Components

### Cards (Notion 스타일)
- border-radius: **4px** (거의 직각)
- 그림자: **none** (그림자 사용 금지)
- 테두리: 1px solid var(--color-border) 또는 없음
- 배경: var(--color-surface) 또는 투명

### Buttons
- Primary: 배경 var(--color-accent) 블루, color #FFFFFF, radius 4px
- Secondary: outline (border: var(--color-accent), color: var(--color-accent)), radius 4px
- Tertiary: 텍스트 버튼, border: 1px solid var(--color-border)
- 터치 영역: 최소 44px
- border-radius: **4px** (pill 형태 금지)

### Tags/Chips
- 직각형: border-radius **4px**
- 선택: background var(--color-accent) 블루, color #FFFFFF
- 비선택: border 1px solid var(--color-border), background transparent
- Notion 프로퍼티 태그: 블루(#d3e5ef), 그린(#dbeddb), 오렌지(#fadec9) 배경 사용 가능

### Donut Chart (비용 구성)
```
크기: 160px, stroke: 26px
센터 배경: 반드시 var(--color-background) 원형 fill 추가
  → 세그먼트 색상과 텍스트 충돌 방지
센터 텍스트:
  라벨: 13px, weight 600, var(--color-text-tertiary)
  숫자: 18px, weight 800, var(--color-text-primary)
  "원" 접미사 제거 — 숫자만 표시 (공간 확보)
  텍스트 영역: width = 내부원 - 16px (좌우 여백 확보)
세그먼트 색상 (index 순서):
  0 매트리스: var(--color-accent)      #2eaadc 블루
  1 프레임:   var(--color-green)       #4daa57 그린
  2 방문관리: var(--color-orange)      #e9914b 오렌지
  3 탑퍼/기타: var(--color-text-disabled) #c4c4c0 그레이

금지:
  - 센터 배경 없이 텍스트 직접 배치 → 대비 부족
  - 텍스트가 내부 원에 꽉 차게 배치 → 여백 필수
  - 유사 색상(초록 계열만) 사용 → 세그먼트 구분 불가
  - accent 색상을 센터 텍스트에 사용 → 블루 세그먼트와 충돌
```

### Bars (비교 바)
- border-radius: **2~3px**
- 일시불: background #ddd (또는 var(--color-border)), color #666
- 정상가: background #dbeddb (연한 그린), color #2b6b2b
- 렌탈: background var(--color-accent), color #fff

### Transitions
- 부드럽고 느린 트랜지션: 0.15~0.3s ease
- 버튼 터치: opacity 0.6 + scale(0.98)
- 모달 진입: slideUp 0.4s cubic-bezier(0.32,0.72,0,1)
- 무한 애니메이션 금지 (최대 3회)

## Information Hierarchy
3초 안에 핵심 파악 가능해야 함.

### 계층 구조
1. **핵심** (3초): 월 납부액, 할인 금액 → 가장 크고 눈에 띄게
2. **상세** (10초): 총 납입, 절약, 하루 비용 → 중간 크기, 요약 형태
3. **부가** (필요 시): 상세 내역, 할인 항목별 → 작은 크기, 1px 선으로 구분

### HERO Pattern
```
[MONTHLY 라벨 — 11px, weight 500, color: tertiary, uppercase]
[핵심 숫자 — 42px, weight 200, 좌정렬]
[비교 정보 — 12px, weight 500, color: accent]
```

### Summary Pattern
```
[항목1] | [항목2] | [항목3]  — 3~4분할, 1px 선 구분, 중앙 정렬
```

### Detail Pattern (Notion 테이블 스타일)
```
[항목]          [금액]          [비중]
──────────────────────────────────────
[항목명]        [1,794,000원]   [43%]
[항목명]        [360,000원]     [9%]
──────────────────────────────────────
[소계]          [4,188,000원]
[할인항목]      [-120,000원]           ← color: discount
──────────────────────────────────────
[총 할인]       [-730,800원]           ← color: discount, weight 800
═══════════════════════════════════════  ← 2px solid
[최종 금액]     [3,457,200원]          ← size 22px, weight 900
[월 납부액]     [57,620원]             ← color: accent
```

## Accessibility (WCAG AA)
- 텍스트 명도 대비: 4.5:1 이상 필수
- 어두운 배경 위엔 밝은 글자, 밝은 배경 위엔 어두운 글자
- accent 배경(#2eaadc) 위 텍스트는 #FFFFFF (짧은 텍스트 허용)
- prefers-reduced-motion 대응 (애니메이션 비활성)
- placeholder, 보조 텍스트도 대비 기준 충족

## Chart/Graph UI 원칙 (세션 38 추가)
```
1. 텍스트 위에 항상 배경 확보
   → 차트 내부 텍스트는 반드시 배경색(원형/사각) 위에 배치
   → 세그먼트/바 색상과 텍스트 색상 충돌 방지
2. 텍스트 영역에 최소 8px 여백
   → 차트 내부 공간의 60~70%만 텍스트에 사용
   → 꽉 차면 가독성 급락 (특히 모바일)
3. 라벨은 최소 13px
   → 11px 이하 라벨은 모바일에서 인식 불가
   → 차트 안 라벨도 예외 없음
4. 데이터 시각화 색상은 명확히 구분
   → 같은 계열 4색 금지 (초록×4 등)
   → CSS 변수로 정의된 구분 색상 사용
5. 숫자 접미사("원", "%") 생략 가능
   → 공간 부족 시 맥락으로 단위 파악 가능하면 제거
```

## Don'ts
- 라운드 카드 (border-radius 10px 이상) 사용 금지
- 그림자 (box-shadow) 사용 금지
- 그라데이션 사용 금지
- 색상 3가지 이상 사용 금지 (블루/레드/그레이 외, 도넛 세그먼트는 예외)
- pill 형태 (border-radius 100px) 사용 금지
- 무한 루프 애니메이션 금지
- 정보 과밀 배치 금지 (여백 충분히)
- 하드코딩 색상 사용 금지 (CSS 변수 사용)
- #03C75A(구 초록) 사용 금지
- 차트 내부 텍스트를 배경 없이 배치 금지
- 11px 이하 라벨 사용 금지 (모바일 가독성)

## File Structure
- 단일 HTML 파일: `/index.html`
- React 18 + Babel 인라인 트랜스파일
- 빌드: `sh build.sh` → `deploy/` (Babel 제거, JSX 사전변환)
- 백업: index1.html(세션35 시작), index2.html(세션36 시작), index3.html(Notion 적용 전)
- 히스토리: index1.html, index2.html 등 순번 보존

클로드 코드에게:
이 파일을 읽지 않고 작업을 시작하지 마세요.
어두운 배경에 어두운 텍스트는 절대 사용 금지.
라운드 카드, 그림자, pill 버튼 사용 금지 — Notion 스타일 유지.
작업 전 이 원칙을 숙지했다고 먼저 말하세요.
