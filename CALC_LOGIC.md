# 할인 계산 로직 완전 명세서

> **필수 규칙**: 앱의 가격/할인/계산 관련 코드를 수정할 때 **이 파일을 먼저 읽고** 시작하세요.
> 수정 후 반드시 **프리뷰(375×812)에서 직접 확인**한 뒤에만 완료 보고하세요.
> 이 문서는 `/Users/minmacbook/Desktop/V5 festa/index.html`의 계산 엔진을 기술합니다.

---

## 0. 수정 시 필수 절차

```
1. CALC_LOGIC.md (이 파일) 읽기
2. 수정 대상 코드 라인 확인
3. 코드 수정
4. 프리뷰 모바일(375×812)에서 기준 케이스 검증: 퀸/5년/루네어/코지/토탈 → 59,320원
5. 해당 기능 화면까지 직접 이동하여 눈으로 확인 (스크린샷 또는 snapshot)
6. 다크/라이트 모드 둘 다 확인
7. 완료 보고
```

---

## 1. 핵심 가격 엔진

### 함수: `_getDetailedPricingByCareImpl` (L4217)

모든 가격 계산의 근원. 단일 제품(또는 콤보)의 월 렌탈료, 총납입, 할인 내역을 계산합니다.

```
파라미터:
  careId        — 케어 옵션 (serviceFree / special / basic / total)
  selectedMattress, selectedFrame, selectedSize, selectedPeriod
  selectedMode  — festa / rerental / frameOnly / mattressOnly
  mQuantity, fQuantity — 매트리스/프레임 수량
  isCross       — 결합할인 여부
  extras        — 추가 제품 배열 [{id, name, price, qty, period}]
  overrideTotalUnits  — 비교 모달에서 대수 오버라이드
  overridePromoMode   — 프로모 모드 오버라이드
```

---

## 2. 정책 기준: 신규 렌탈 수량과 기존고객 분리

```javascript
const newUnitsCount = mQtyInt + fQtyInt + 유료 추가제품 수량;
const hasExistingCoway = isCrossDiscount || aprilCount > 0;
```

- `newUnitsCount`는 **이번에 새로 렌탈하는 유료 제품 수량**만 센다.
- 매트리스, 프레임, 유료 추가제품, 힐링 제품은 모두 신규 렌탈 1개로 계산한다.
- `aprilCount`는 7월 신규 렌탈 할인 계산에 사용하지 않는다.
- 결합할인 5%는 사용자가 `isCrossDiscount === true`로 토글을 켰을 때만 적용한다.

---

## 3. 신규 렌탈 할인 (discountRate)

```javascript
if (newUnitsCount >= 2) discountRate = 0.15;
else if (newUnitsCount === 1 && hasExistingCoway) discountRate = 0.05;
else discountRate = 0;
```

| 조건 | 할인율 | 설명 |
|------|--------|------|
| 재렌탈 모드 | 0% | 재렌탈은 별도 할인 체계 |
| 신규 2개 이상 | **15%** | `7월 15%(2개이상)` |
| 신규 1개 + 결합할인 토글 ON | **5%** | `결합할인 5%` |
| 신규 1개 단독 | **0%** | 할인 없음 |

---

## 4. 반값/동시할인 제거 (festaMonths)

```javascript
festaMonths = 0;
```

7월 정책에서는 반값할인과 동시할인을 적용하지 않는다. 기존 총납입 계산식은 유지하지만 `festaMonths`가 항상 0이므로 반값 차감액은 0원이다.

### 7월 요약 표

| 조건 | 할인 | 반값 개월 | 비고 |
|------|------|----------|------|
| 신규 1개 단독 | 0% | 0개월 | 할인 없음 |
| 신규 1개 + 결합할인 토글 ON | 5% | 0개월 | 결합할인 5% |
| 신규 2개 이상 | 15% | 0개월 | 7월 15%(2개이상) |
| 기존 렌탈 N대 + 신규 1개 | 토글 ON일 때만 5% | 0개월 | 기존 수량은 자동 적용 조건이 아님 |

---

## 5. 매트리스 월 렌탈료 계산

```javascript
// L4241-4260
rawMonthly  = rentalData[period].monthly           // 원시 렌탈료 (PRODUCT_DATA)
sfMBC       = 서비스프리 약정할인 (기본 4,000)
mBase       = rawMonthly - sfMBC + cFee + aFee + mLE + mSE
prePkg      = mBase - 1000(자동이체) - mBC(약정할인) - mLE - mSE

// 페스타 모드
mPkgD  = ceil(prePkg × discountRate / 10) × 10      // 패키지 할인
mFinal = prePkg - mPkgD                              // 최종 월 렌탈료

// 재렌탈 모드
first12m = ceil(prePkg × 0.80 / 10) × 10            // 1~12개월: 20% 할인
restM    = ceil(prePkg × (1 - restRate) / 10) × 10  // 13개월~: 10%/13%/16%
mFinal   = ceil(가중평균 / 10) × 10
```

### 케어 비용 (cFee, aFee)

```
cFee = 2,000원  — basic 또는 total일 때 (L1092: DEFAULT_CARE_FEE)
aFee = MODEL_ADD_FEES[모델]  — special 또는 total일 때

MODEL_ADD_FEES (L1090):
  hybrid4: 5,000 / lunaire: 4,000 / modi: 4,000 / elite: 1,000
  smarts8: 4,000 / sigsc: 6,000 / doubleside: 2,000
  doublechainge: 5,000 / compactfoam: 2,000
```

### 약정 할인 (mBC)

```
mBC = MATTRESS_CONTRACT_DISCOUNTS[모델][케어][약정] 또는 DEFAULT_MBC

DEFAULT_MBC (L1234):
  serviceFree: 모든 약정 4,000
  special:     모든 약정 4,000
  basic:       모든 약정 0
  total:       모든 약정 0
```

### 특수 모델

```
lunaire:  mLE = 5,000 (루네어 신규 런칭 특별할인, L4242)
  — PRODUCT_DATA의 rawMonthly에 이미 5,000원 할인 반영됨
  — mLE는 mBase에 +, prePkg에서 - → mFinal에는 영향 없음 (표시용)
  — 도넛 할인 상세에 "루네어 특별할인 (5,000원/월)" 항목으로 표시
smarts8:  mSE = 9,000 (스마트 추가요금, L4239)
sigs(시그니처): NO_TOPPER_MODELS → total→basic, special→serviceFree 강제 변환 (L4231-4232)
```

---

## 6. 프레임 월 렌탈료 계산

```javascript
// L4262-4280
fBase   = rentalData[period].monthly + 1000           // 프레임 기본 (+자동이체 복원)
prePkg  = fBase - 1000                                // 자동이체 제거
fPkgD   = ceil(prePkg × discountRate / 10) × 10
fFinal  = prePkg - fPkgD
```

프레임은 매트리스보다 단순: 케어비용(cFee/aFee) 없음, mBC 없음.

---

## 7. 추가 제품(환경가전) 계산

```javascript
// L4300-4317
prePkg     = epPrice (사용자 입력 월 렌탈료)
autoDebit  = 1,000
pkgD       = ceil(prePkg × discountRate / 10) × 10
finalPrice = Math.max(0, prePkg - pkgD - autoDebit)  // 음수 방어 적용됨
epPromo    = finalPrice × 0.5 × epFestaMonths × qty
epTotal    = (finalPrice × qty × contractMonths) - epPromo
```

### 추가 제품 반값 개월수

```javascript
// L4304-4306
// 추가제품은 침대와 합산된 totalUnitsCount 기준 할인율을 공유한다.
epFestaMonths = festaMonths;  // 7월 정책에서는 항상 0
```

### ✅ 음수 방어 (해결됨)

```
prePkg ≤ pkgD + 1000 일 때 Math.max(0, finalPrice) 적용
예: 1000원 입력, 15% 할인 → max(0, 1000-150-1000) = 0원
매트리스(mFinal), 프레임(fFinal), 추가제품(finalPrice) 모두 적용
```

### ✅ 빈 추가제품 대수 제외 (해결됨)

```
가격 미입력(0원) 추가제품은 totalUnitsCount에서 제외
3곳 수정: L4223(extraQtyTotal), L4402(grandTotalUnits), L4503(_totalUnits)
조건: Number(p.price) > 0 ? qty : 0
```

---

## 8. 총 납입 계산

```javascript
// L4319-4325
bedMonthly       = (mFinal × mQty) + (fFinal × fQty)
bedPromoAmount   = (mFinal × 0.5 × festaMonths × mQty) + (fFinal × 0.5 × festaMonths × fQty)
bedRentPayable   = Math.max(0, bedMonthly × contractMonths - bedPromoAmount)
extraRentPayable = sum(ep.epTotal)
totalMonthly     = bedMonthly + extraTotalMonthly
totalRentPayable = bedRentPayable + extraRentPayable
```

---

## 9. 재렌탈 모드 계산

```javascript
// L4247-4256 (매트리스), L4268-4276 (프레임)
// 1~12개월: 20% 할인
// 13개월~: restRate 할인

restRate:
  1대:          10%
  1대+결합:     13%
  2대+:         16%

first12m = ceil(prePkg × 0.80 / 10) × 10
restM    = ceil(prePkg × (1 - restRate) / 10) × 10
mFinal   = ceil((first12m × min(12,totalM) + restM × max(0,totalM-12)) / totalM / 10) × 10
```

총납입/총할인은 평균 월액(`mFinal × 전체개월`)이 아니라 **구간별 실제 납입 합계**를 기준으로 한다.

```javascript
firstMonths = min(12, totalM)
restMonths  = max(0, totalM - 12)
stagedTotal = first12m × firstMonths + restM × restMonths
rerentalDiscountTotal = prePkg × totalM - stagedTotal
totalRentPayable = stagedTotal + extraRentPayable
```

표시 원칙:
- 메인 월 납부액은 상담 편의를 위해 가중평균 월액(`mFinal`)을 보여준다.
- 재렌탈 2단계 상세, 혜택분석 총할인, 총납입은 `stagedTotal` 기준으로 맞춘다.

---

## 10. 제휴카드 할인

### 카드 월 할인 (cardDiscount)

```
월 할인 = tier.total = tier.base + tier.promo
- base: 상시 할인 (약정 전체 기간)
- promo: 추가 할인 (프로모 기간만)
```

### 카드 총 할인 (calcCardTotalDiscount, L1224)

```javascript
baseTotal  = tier.base × totalMonths          // 상시 × 전체
promoTotal = tier.promo × promoMonths         // 추가 × 프로모기간
return baseTotal + promoTotal
```

```
promoMonths = min(약정개월, card.period)
- 5월 주요 프로모 카드: period = 60 (5년)
- KB국민 II: period = 36 (36개월)
- IBK/하나: period = 0 (추가할인 없음, base만)
```

### 제휴카드 총납입 온톨로지 (2026-05-05 표준)

제휴카드 선택 시 고객에게 보여주는 **총납입**은 `calcCardTotalDiscount()`의 명목 총혜택을 그대로 빼지 않는다.
카드 청구할인은 월 렌탈료를 0원 아래로 만들 수 없고, 연회비는 고객 부담이므로 아래 표준식을 모든 화면에서 사용한다.

```javascript
cardFinance = buildCardFinanceOntology(
  baseMonthly,          // 카드 적용 전 실제 월 렌탈료
  festaMonths,          // 반값 적용 개월수
  periodYears,
  selectedCardData,
  selectedTierIdx,
  rentTotalBeforeCard   // 반값/패키지 등 제품 할인 반영 후 총렌탈 납입
)

appliedDiscountTotal = sum(min(beforeCardMonthly, cardDiscount) × months)
excessBenefitTotal   = sum(max(0, cardDiscount - beforeCardMonthly) × months)
feeTotal             = domesticAnnualFee × periodYears
rentBillAfterCard    = max(0, rentTotalBeforeCard - appliedDiscountTotal)
customerPayTotal     = rentBillAfterCard + feeTotal
customerNetBenefit   = max(0, appliedDiscountTotal - feeTotal)
```

표시 원칙:
- **총납입/5년 총 납입/합산 총 납입**: `customerPayTotal`
- **총 할인**: 제품/프로모션 할인 + `customerNetBenefit` + 등록비 면제
- **카드 설명**: 명목 혜택(`grossDiscountTotal`)보다 `appliedDiscountTotal`, `excessBenefitTotal`, `feeTotal`을 우선 표시
- 월 렌탈료보다 카드 할인액이 큰 달은 초과분을 “초과 혜택”으로 설명하되 총납입에서는 추가 차감하지 않는다.

### 카드 데이터 (CARD_PROMO_DATA) — 2026-06 업데이트

| 카드 | tier1 (base/promo) | tier2 | tier3 | 프로모기간 |
|------|-------------------|-------|---------|----------|
| 현대카드 | 40만↑ 8,000/16,000 | 80만↑ 12,000/13,000 | 120만↑ 16,000/14,000 | 60개월 |
| 신한 | 30만↑ 13,000/11,000 | 70만↑ 17,000/7,000 | 150만↑ 30,000/0 | 60개월 |
| 우리 II | 30만↑ 13,000/10,000 | 80만↑ 17,000/7,000 | 150만↑ 23,000/7,000 | 60개월 |
| NH올원 | 30만↑ 10,000/12,000 | 100만↑ 15,000/12,000 | 200만↑ 30,000/12,000 | 60개월 |
| 삼성 | 30만↑ 7,000/15,000 | 70만↑ 10,000/14,000 | 120만↑ 13,000/13,000 | 60개월 |
| KB국민 II | 40만↑ 15,000/11,000 | 80만↑ 20,000/10,000 | - | **36개월** |
| LOCA | 30만↑ 13,000/2,000 | 70만↑ 16,000/1,000 | 150만↑ 25,000/0 | 60개월 |
| IBK | 30만↑ 13,000/0 | 70만↑ 17,000/0 | 120만↑ 23,000/0 | 없음 |
| 하나 | 30만↑ 13,000/0 | 80만↑ 18,000/0 | 150만↑ 25,000/0 | 없음 |

---

## 11. 총납입 탭 표시 공식

### 동일 약정 레이아웃 (hasDiffPeriod = false)

```javascript
// L2720-2744
baseTotal       = sum(itemBase × qty)                      // 할인 전 원래 가격
monthlyAfterCard = grandTotalMonthly - cardDiscount        // 카드 적용 월 납부
totalDisc       = baseTotal - monthlyAfterCard              // 총 할인액/월
totalRentAfterCard = cardFinance.customerPayTotal           // 카드 적용 총 납입
```

### 다른 약정 레이아웃 (hasDiffPeriod = true)

```javascript
// L2673-2718 — 침대/추가제품 각각 분리 표시
// 침대: bedMonthly, bedTotal
// 추가: ep.finalPrice × ep.qty, ep.epTotal
// 합계: monthlyAfterCard, cardFinance.customerPayTotal
```

---

## 12. 이중 계산 체계 (cp / ccp)

```
cp  = calculatedPrices  — 에디터 현재 선택 기반 (useMemo, L4335)
ccp = cartCalculatedPrices — 장바구니 배열 합산 (useMemo, L4413+)

분기: _useCart = cartItems.length > 0 && ccp
  → true:  ccp 사용 (장바구니 모드)
  → false: cp 사용 (에디터 프리뷰 모드)
```

---

## 13. 검증 기준 케이스

```
퀸 / 5년 / 루네어 / 코지 / 토탈 → 62,820원/월

계산 과정:
  루네어 퀸 5년: rawMonthly=39,900
    mBase = 39,900 - 4,000(sfMBC) + 2,000(cFee) + 4,000(aFee) = 41,900
    prePkg = 41,900 - 1,000(auto) - 0(mBC, total은 0) = 40,900
    mPkgD = ceil(40,900 × 0.10 / 10) × 10 = 4,090
    mFinal = 40,900 - 4,090 = 36,810

  코지 퀸 5년: rawMonthly=28,900
    fBase = 28,900 + 1,000 = 29,900
    prePkg = 29,900 - 1,000 = 28,900
    fPkgD = ceil(28,900 × 0.10 / 10) × 10 = 2,890
    fFinal = 28,900 - 2,890 = 26,010

  totalMonthly = 36,810 + 26,010 = 62,820원 ✓
  festaMonths = 6 (2대, 5년)
  totalRentPayable = 62,820 × 60 = 3,769,200원
```

---

## 14. 도넛 차트 (FESTA BENEFIT) 표시 로직

```
세그먼트 = 할인 전(mBase/fBase) 기준 금액
  매트리스 세그먼트 = mBase × qty × months - tpTot2 - careInc2
  프레임 세그먼트   = fBase × qty × months
  탑퍼 세그먼트     = TOPPER_MC2[모델] × qty × months (사이즈 무관 동일)
  추가 제품        = prePkg × qty × months (할인 전)

도넛 중앙 = totalRentPayable (실제 최종 납입액)

할인 상세 (세그먼트 합산 - 도넛 중앙 = 총 할인):
  자동이체 할인     = 1,000 × 제품수 × months
  현장할인         = floor(mBC/2) × months
  VIP 약정할인     = ceil(mBC/2) × months
  루네어 특별할인   = mLE × months (lunaire만)
  7월 15% 할인     = mPkgD × months (2대+)

검증: 세그먼트 합산 - 총 할인 = 도넛 중앙 (항상 일치해야 함)
```

---

## 15. 카탈로그 원가 대조 규칙

```
카탈로그 PDF = 토탈케어 + 자동이체 할인 적용 후 금액 = mFinal(토탈, 1대)

역산 공식:
  카탈로그 금액 = mBase(토탈) - 1,000(자동이체) - 0(mBC, 토탈은 0)
  → mBase(토탈) = 카탈로그 + 1,000
  → mBase(토탈) = rawMonthly - sfMBC + cFee + aFee + mLE + mSE

케어별 정상가(mBase) 관계:
  토탈    = rawMonthly - sfMBC + cFee(2,000) + aFee(모델별) + mLE + mSE
  스페셜  = 토탈 - cFee(2,000)
  베이직  = 토탈 - aFee(모델별)
  서프    = 토탈 - cFee - aFee

검증 예시 (하이브리드4 퀸 5년):
  카탈로그 = 46,900원 (토탈, 자동이체 후)
  코드: rawMonthly=44,900, sfMBC=4,000, cFee=2,000, aFee=5,000
  mBase(토탈) = 44,900 - 4,000 + 2,000 + 5,000 = 47,900
  mFinal = 47,900 - 1,000(자동이체) - 0(mBC) = 46,900 ✓

코웨이 공식앱 정상가(취소선) = mBase
코웨이 공식앱 7개월차~ 금액 = prePkg = mBase - 1,000 - mBC
도넛 할인 상세 표시 전략 (영업용):
  공식앱: 자동이체 + 약정할인(mBC+mLE 통합) + 프로모션 할인
  우리앱: 할인을 최대한 쪼개서 항목 수를 늘린다
    → 고객에게 "이렇게 많은 할인을 받고 있다"는 임팩트 전달
    → "지금 안 하면 다음엔 더 비싸다"는 영업 명분

  표시 항목:
    자동이체 할인 (1,000원/월)     ← 전 제품 공통
    현장할인 (floor(mBC/2)원/월)   ← 서프/스페셜만 (mBC 4,000 → 2,000)
    VIP 약정할인 (ceil(mBC/2)원/월) ← 서프/스페셜만 (mBC 4,000 → 2,000)
    루네어 특별할인 (mLE원/월)      ← 루네어만 (5,000)
    7월 15%(2개이상)                ← 신규 2대 이상
    결합할인 5%                     ← 신규 1대 + 토글 ON
    💳 카드 할인                   ← 카드 선택 시

  원칙: 쪼개되 임의 항목은 절대 만들지 않는다
        mBC를 현장/VIP로 쪼개는 것 = OK (실제 mBC를 분할 표시)
        "방문관리 페스타 할인"처럼 없는 항목 생성 = 절대 금지
```

---

## 16. 관련 상수 모음

```javascript
DEFAULT_CARE_FEE = 2,000                        // L1092
DAYS_IN_MONTH = 30                               // L1093
MINIMUM_WAGE = 10,030                            // L1094
EARLY_EXCHANGE_PENALTY_RATE = 0.5                // L1162
EARLY_EXCHANGE_PENALTY_MONTHS = 12               // L1163
```

---

## 17. 핫픽 계산 SSoT (세션 37 추가)

### 함수: `_computeHpResults(care, matt, frame, size, mQ, fQ, crossDisc, extras)`

핫픽 약정 시뮬레이션의 **단일 진실 원천**. 대수 산출 + 5/7/9년 pricing을 한 곳에서 계산.

```
totalUnits = mQ + fQ + extras(가격>0만)

→ [5, 7, 9].map(period => getDetailedPricingByCare(..., totalUnits))
→ [{ period, totalWithCard, totalMonthly, totalRentPayable, cardDiscount, festaMonths, promoAmount }]
```

**호출하는 곳 2곳:**
1. `applyHotPick()` — 장바구니 내 핫픽 바텀시트
2. 워터폴 IIFE 핫픽 step — `wfStepsData` useMemo 내

**⚠️ 새 할인/옵션 추가 시 이 함수만 수정하면 양쪽 모두 반영됨**

---

## 18. 워터폴 steps useMemo (세션 37 추가)

### 변수: `wfStepsData` (~L5320)

워터폴 차트의 steps 배열 계산을 useMemo로 분리. 슬라이드 넘김(wfStep) 시 재계산 방지.

```
반환값: { steps, maxStep, _mName, _fName, _period, _months,
          hasCareTP, hasCareBV, lS, rS, wfCardTotalD, fmt2 }

dependency 22개: isWaterfallOpen, gaugeComplete, calculatedPrices,
  cartItems, cartCalculatedPrices, activeMattress, activeFrame,
  activeSize, activePeriod, activeCare, viewMode, mattressQty,
  frameQty, isCrossDiscount, isAprilCombo, extraProducts,
  userTouched, promoMode, selectedCardData, selectedTierIdx, competitorData
```

---

## 19. 신규 렌탈 수량 계산 위치 전수조사 (2026-06-01 업데이트)

`aprilCount`는 기존고객 여부만 만들고 신규 렌탈 수량에는 더하지 않는다.

| 위치 | 용도 | aprilCount 처리 |
|------|------|-------------|
| 엔진 내부 | `newUnitsCount` 산출 | 제외 |
| 장바구니 합산 | `grandTotalUnits/newUnitsCount` | 제외 |
| `_computeHpResults` | 약정별 비교 수량 | 제외 |
| 기존고객 판정 | `hasExistingCoway` | `aprilCount > 0`이면 true |

핵심: 기존 렌탈 3대 + 신규 1개는 신규 4개가 아니라 **신규 1개 + 기존고객**이다.

## 19-1. 힐링 제품 계산 연동 (세션 38 추가)

```
힐링은 extraProducts에 합성되어 기존 엔진에 연동:

healingAsExtra (useMemo) — activeHealing + healingCare + healingPeriod → {price, qty, period}
  ↓
allExtras = [...extraProducts, healingAsExtra]
  ↓
cp/ccp에 allExtras로 전달 → 엔진이 extras로 처리
  ↓
newUnitsCount에 포함 → 힐링 단독도 신규 렌탈 1개로 계산

cp 가드 조건: hasBed || hasHealing → 힐링 단독으로도 계산 가능
```

---

## 20. 절대 금지 사항

1. **`setActiveSize/Period/Mattress/Frame` 직접 호출 금지** → handler 사용
2. **`getDetailedPricingByCare()` 비교 모달에서 직접 호출 금지** → `safeGetPricing()` 사용
3. **핫픽 대수를 직접 계산하지 않기** → `_computeHpResults` 사용 (세션 37)
4. **계산 함수 UI 수정 시 건드리지 않기** → 건드려야 하면 사용자에게 먼저 보고
5. **수정 후 기준 케이스(59,320원) 검증 필수**
6. **재렌탈 계산기 state(rcBase 등)와 메인 state 연동 금지**

---

## 21. 2026-07-01 할인 정책 전환

### 상수 (~L1107-1108)
```javascript
const RENTAL_POLICY_VERSION = '2026-07-rental-benefit-v1';
const FESTA_PROMOTION_ACTIVE = false;
const FESTA_END_DATE = new Date('2026-06-01T00:00:00+09:00');
```

### 영향 범위
| 항목 | 기준 |
|------|------|
| 신규 1개 단독 | 할인 0% |
| 신규 1개 + 결합할인 토글 ON | 결합할인 5% |
| 신규 2개 이상 | 7월 15%(2개이상) |
| 기존 렌탈 수량 | 신규 수량과 결합할인 자동 적용 조건에 포함하지 않음 |
| 힐링 | 신규 렌탈 1개로 포함 |
| 저장 견적 | `RENTAL_POLICY_VERSION`이 다르면 현재 정책으로 재계산 |

---

## 22. 절약 계산식 통일 (세션 39 추가)

### 메인 4분할 절약 (~L5869-5871)
```
정상가 = (mBase × mQty + fBase × fQty) × contractMonths
등록비 = 100000 × (mQty + fQty + extras수량)
절약 = 정상가 - 총납입(카드할인 반영) + 등록비면제
퍼센트 = 절약 / 정상가 × 100
```

### 등록비 면제 (혜택보기 ~L8205)
```
_regFee = 100000 × Math.max(1, cur.totalUnits)
```
- **1대 = 10만, 2대 = 20만, 3대 = 30만**
- 총 할인에 포함, 매월 절약에는 미포함 (일시성)

---

## 23. bestPeriodInfo useMemo (세션 39 추가)

### 위치: _computeHpResults 바로 아래 (~L4673)
```javascript
const bestPeriodInfo = useMemo(() => {
  const _bpMQ = userTouched.mattress ? Math.max(1, mattressQty) : 0;
  const _bpFQ = userTouched.frame ? frameQty : 0;
  // _computeHpResults로 5/7/9년 totalRentPayable 비교
  // → { results, bestP, curP, saving }
}, [activeCare, activeMattress, ..., userTouched.mattress, userTouched.frame]);
```

⚠️ **주의**: `userTouched`로 실제 선택된 제품만 수량 반영. 미선택 프레임을 1대로 잘못 넣으면 2대 판정되어 `7월 15%(2개이상)`이 잘못 적용될 수 있음.

---

## 24. 혜택 분석 상담 멘트 온톨로지 (2026-05-05 추가)

### 위치
혜택 분석 모달의 비용 구성 슬라이드 안에서 현재 견적값을 읽어 자동 생성한다. 고객과 함께 보는 핵심 비용 화면을 방해하지 않도록 UI는 침대 높이 영역 하단에 접힘 패널로 배치하고, 기본 상태는 닫힘이다.

```javascript
salesTalkMode      // 가격형 / 프리미엄형 / 망설임 대응 / 문자용
salesTalkOpen      // 상담 멘트 접힘/펼침, 혜택 분석 열 때 false로 초기화
_salesOntology     // 멘트 생성용 구조화 데이터
_salesTalks        // 고객 심리별 최종 문장
```

### 구조화 기준
| 노드 | 의미 | 예시 |
|------|------|------|
| context | 고객이 선택한 구성 | 루네어 + 파데 · 퀸 · 5년 · 토탈 · 2대 |
| price | 정상 월 납부액 대비 최종 월 납부액 | 정상가 기준 월 64,800원 → 월 26,120원 |
| proof | 5년 총 할인과 총 납입 근거 | 5년 총 2,385,800원 할인 / 총 납입 1,702,200원 |
| care | 관리 혜택 포지셔닝 | 방문관리와 탑퍼 교체까지 포함 |
| card | 제휴카드 순혜택 | 신한카드 순혜택 23,000원 |
| benefits | 실제 적용 혜택명 자동 나열 | 자동이체 할인, 7월 15%(2개이상), 신한카드 순혜택, 등록비 면제 |

### 멘트 모드
| 모드 | 목적 | 사용 상황 |
|------|------|----------|
| 가격형 | 월 부담을 먼저 낮춰 보이기 | 가격에 민감한 고객 |
| 프리미엄형 | 제품 가치와 관리 포함을 납득시키기 | 품질/관리/높이를 보는 고객 |
| 망설임 대응 | 지금 조건의 손실회피를 부드럽게 설명 | “생각해볼게요” 반응 |
| 문자용 | 바로 전송 가능한 짧은 요약 | 상담 후 재안내 |

### 주의
- 멘트는 화면에 표시된 `cur` 계산 결과만 사용한다.
- 카드가 선택되지 않은 경우에도 문장이 깨지지 않도록 “제휴카드 미적용”으로 처리한다.
- 결합할인 5%/7월 15%(2개이상), 제휴카드, 등록비 면제 등은 `benefits`에 자동 나열해 멘트 본문과 칩에 노출한다.
- 총 할인은 기존 혜택 분석 표시와 맞추기 위해 렌탈 할인 + 카드 순혜택 + 등록비 면제를 포함한다.
