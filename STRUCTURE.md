# 비렉스 견적 가이드 v5 — 앱 구조도

> 최종 업데이트: 2026-04-04 (세션 37 — 성능 최적화 + 버그 수정)
> 파일: `/Users/minmacbook/Desktop/V5 festa/index.html` (단일 HTML, React + Babel 인라인)
> 빌드: `sh build.sh` → `deploy/` 폴더 (JSX→JS 사전 변환, Babel standalone 제거)
> 추가 파일: `manifest.json` (PWA standalone), `sw.js` (Service Worker), `icon-192.png`, `icon-512.png`
> 배포: `deploy/` 폴더 → Cloudflare 업로드

---

## 1. 화면 구조도 (계층 트리)

```
App (Root)
│
├── 🔲 상단 헤더
│   ├── COWAY 로고
│   ├── 모드 탭: [페스타] [매트리스] [프레임]     → viewMode
│   ├── 다크/라이트 토글                          → isDarkMode
│   └── 담당자 버튼                               → customerName
│
├── 🔲 메인 견적 화면
│   ├── 가격 대시보드 (MONTHLY 59,320원)           → calculatedPrices
│   ├── 미니 대시보드 (총납입/절약/하루)
│   ├── 상단 탭 바 (퀸/5년/토탈/루네어/코지/63.5cm) → configTab
│   ├── 사이즈 선택                                → activeSize
│   ├── 약정 선택                                  → activePeriod
│   ├── 매트리스 선택 (카테고리 필터)               → activeMattress, mattCatFilter
│   ├── 프레임 선택 (카테고리 필터)                 → activeFrame, frameCatFilter
│   ├── 케어 옵션 선택                             → activeCare
│   └── 높이 진단                                  → heightDiagOpen
│
├── 🔲 하단 네비게이션 바 (5개 탭)
│   ├── [장바구니]  → QuoteModal (isQuoteOpen)
│   ├── [제휴카드]  → QuoteModal 카드탭 (qTab='card')
│   ├── [보관함]    → HubModal (isHubOpen)
│   ├── [글자크기]  → 인라인 슬라이더
│   └── [더보기]    → ToolboxModal (즐겨찾기 포함)
│
├── 📋 QuoteModal (장바구니 모달)
│   ├── 내부 탭 (qTab)
│   │   ├── [요약]      summary   — 가격 요약, 월 납부 내역
│   │   ├── [총납입]    total     — 추가 제품 입력, 반값/카드 할인 합산
│   │   ├── [제휴카드]  card      — 카드 할인 계산
│   │   ├── [매트리스]  mattress  — 매트리스 상세
│   │   ├── [프레임]    frame     — 프레임 상세
│   │   └── [고객 응대]  tip       — 고객 질문 대응/일시불 비교
│   │
│   ├── 서브 모달
│   │   ├── 검은 명세서 (Receipt)  → showReceipt
│   │   ├── 핫픽 추천 바텀시트      → (인라인 렌더링)
│   │   └── 이미지 뷰어             → iwViewerOpen
│   │
│   └── 하단 버튼: [닫기] [명세서] [보관함에 담기]
│
├── 📋 HubModal (보관함 모달)
│   ├── 내부 탭 (hubTab)
│   │   ├── [맞춤 추천]    recommend  — 예산/사이즈/케어 기반 추천
│   │   └── [저장 견적]    archive   — 저장된 견적 관리
│   └── 담당자 설정 버튼
│
├── 📋 FavListModal (즐겨찾기 모달)
│   ├── 즐겨찾기 카드 목록
│   ├── 코멘트 편집
│   ├── 사진 첨부/뷰어                → favPhotoViewer
│   └── 비교 기능
│
├── 📋 SurveyModal (케어 진단)
│   ├── 질문 흐름                     → surveyAnswers
│   └── SurveyResultModal (결과)      → isSurveyResultOpen
│
├── 📋 워터폴 차트 바텀시트 (FESTA BENEFIT) — 세션 29 핫픽 통합
│   ├── 두괄식 순서: 인트로→도넛→절감율→**핫픽**→카드→전문케어→탑퍼→매트리스→프레임
│   ├── 도넛 차트 슬라이드 (isDonutStep)    → 비용 구성 원형 그래프 + 실납입
│   │   ├── 침대 높이 표시 (파운데이션만 짧은다리)
│   │   ├── 매트리스 사이즈 표시 (예: 퀸 1500×2000mm)
│   │   ├── 범례: 항목별 금액/비중/횟수/1회당비용 + 추가제품(환경가전)
│   │   ├── 할인 상세: 자동이체/현장/VIP/루네어/15%/반값 (상세명세서 연동)
│   │   ├── 카드할인 (연회비 차감, 기간별 상세)
│   │   ├── 실납입 + 월 납부액
│   │   └── 카드 미선택 시 "💳 매월 2만원 더 아끼기" 바로가기
│   ├── 절감율 요약 슬라이드 (isSummaryStep)  → 항목별 가로 막대 비교
│   │   ├── 세스코/탑퍼/매트리스/프레임 일시불 대비 절감율
│   │   ├── 방문관리/탑퍼 횟수+1회당금액 (바 오른쪽 표시)
│   │   ├── 카드할인 (연회비 차감, 순할인 기준)
│   │   ├── 외부 링크: 세스코몰/코웨이/시몬스
│   │   ├── 도움말(HintBadge) — 세스코 비교/방문관리 안내/코웨이2011원조
│   │   └── 하단 요약: 약 XX만원 절감 / 케어+카드 조합 / XX% DOWN
│   ├── 경쟁사 비교 슬라이드 (isCompStep) → 세션 34 신규
│   │   ├── 3컬럼 카드 (코웨이/시몬스/에이스) + 카드 탭 확대
│   │   ├── 확대: 풀 너비 + 좌우 스와이프 전환 + 인디케이터
│   │   ├── 정가 기준, 매트/프레임 분리, 토퍼 비용, 세스코 비용
│   │   ├── 침대 높이 3사 비교, MDF/본넬 태그, 모델명 링크
│   │   ├── 절감 배너 + footnotes 6개
│   │   └── data/competitorMap.json (v1.5) lazy load
│   ├── 핫픽 약정 시뮬레이션 (isHotPickStep) → 세션 29 신규
│   │   ├── 케어 4종 버튼 + 결합할인 토글
│   │   ├── 약정 카드 3개 (5/7/9년, 선택만)
│   │   ├── 비용 차이 설명 (7/9년 선택 시 자동 표시)
│   │   └── 하단 "케어명 · N년 적용" 버튼
│   ├── 카드할인 슬라이드 (isCardStep)       → 카드 적용 상세
│   ├── 스텝별 비교 (전문케어→탑퍼→매트리스→프레임)
│   ├── 좌우 탭 제스처 + 프로그레스 바 + maxHeight 95vh
│   └── 드래그 다운 닫기                → isWaterfallOpen
│
├── 📋 기타 모달
│   ├── PriceExplorer (가격 탐색기)    → isPriceExplorerOpen
│   ├── BarCompare (막대 비교)         → isBarCompareOpen
│   ├── CareCompare (케어 비교)        → isCareCompareOpen
│   ├── SizeCompare (사이즈 비교)      → isSizeCompareOpen
│   ├── PeriodCompare (약정 비교)      → isPeriodCompareOpen
│   ├── ImageWarehouse (이미지 창고)   → isImageWarehouseOpen
│   ├── SmartHub (빠른 접근)           → isSmartHubOpen
│   ├── RerentalCalc (재렌탈 계산기)   → isRerentalCalcOpen
│   └── (UpdateLog 삭제됨 — 세션 26)
│
├── 🖼️ 스플래시 화면                    → #app-loader (CSS 애니메이션)
│
└── 🔔 Toast 알림                     → toasts[]

📋 survey-editor.html (독립 관리 도구 — 세션 27 신규)
├── Step 1 조건 카드 (ConditionCard)   → 케어/높이/매트리스/프레임 토글
├── Step 2 상세 질문 (StructCard)      → 관절/반려동물/청소환경
├── Step 3 침대 높이 선호              → 오프셋 + 제품 조합 미리보기
├── Step 3 키 프로필                   → 키별 권장 범위 + 제품 조합
├── Step 4 케어 설문                   → 질문/옵션 인라인 편집
├── Step 5 프레임 타입                 → 프레임 토글
├── Step 6 케어/프레임 규칙            → 규칙별 토글
├── 높이 보정 상세                     → 미니탭 + 보정값 표
├── 높이 판정 기준                     → 판정 라벨 편집
└── JSON 내보내기                      → 클립보드 복사 → Claude 전달
```

---

## 2. 이름 대조표: 내가 부르는 이름 vs 코드 변수명

| 내가 부르는 이름 | 코드 변수명 | 타입 | 진입 방법 |
|---|---|---|---|
| **메인 화면** | App() | 컴포넌트 | 앱 시작 |
| **모드 (페스타/매트리스/프레임)** | viewMode | state | 상단 헤더 탭 |
| **가격 대시보드** | calculatedPrices (cp) | computed | 메인 화면 상단 |
| **미니 대시보드** | (인라인 렌더링) | JSX | 가격 아래 3분할 |
| **상단 탭** | configTab | state | 메인 화면 |
| **사이즈 선택** | activeSize | state | 상단탭 > 사이즈 |
| **약정 선택** | activePeriod | state | 상단탭 > 약정 |
| **매트리스 선택** | activeMattress | state | 메인 > 매트리스 리스트 |
| **프레임 선택** | activeFrame | state | 메인 > 프레임 리스트 |
| **케어 옵션** | activeCare | state | 메인 > 케어 영역 |
| **수량 조절** | mattressQty, frameQty | state | 장바구니 내부 |
| **추가 제품** | extraProducts | state | 장바구니 > 제품 추가 |
| --- | --- | --- | --- |
| **장바구니** | QuoteModal / isQuoteOpen | 모달 | 하단 바 > 장바구니 |
| **요약 탭** | qTab='summary' | 탭 | 장바구니 > 요약 |
| **제휴카드 탭** | qTab='card' | 탭 | 장바구니 > 제휴카드 |
| **매트리스 탭** | qTab='mattress' | 탭 | 장바구니 > 매트리스 |
| **프레임 탭** | qTab='frame' | 탭 | 장바구니 > 프레임 |
| **고객 응대 탭** | qTab='tip' | 탭 | 장바구니 > 고객 응대 |
| **합계 탭** | qTab='total' | 탭 | 장바구니 > 추가상품 |
| --- | --- | --- | --- |
| **명세서 (검은색)** | showReceipt / showReceiptDirect | 모달 | 장바구니 > 명세서 버튼 |
| **핫픽 추천** | hotPickResult | 바텀시트 | 장바구니 내부 |
| --- | --- | --- | --- |
| **즐겨찾기** | isFavListOpen | 모달 | 하단 바 > 즐겨찾기 |
| **즐겨찾기 추가** | isFavModalOpen | 팝업 | 게이지 100% or 저장 |
| --- | --- | --- | --- |
| **보관함** | isHubOpen | 모달 | 하단 바 > 보관함 |
| **맞춤 추천** | hubTab='recommend' | 탭 | 보관함 > 맞춤 추천 |
| **저장 견적** | hubTab='archive' | 탭 | 보관함 > 저장 견적 |
| --- | --- | --- | --- |
| **케어 진단** | isSurveyOpen | 모달 | 진단 버튼 |
| **진단 결과** | isSurveyResultOpen | 모달 | 진단 완료 후 |
| --- | --- | --- | --- |
| **FESTA BENEFIT 차트** | faqChartStep | JSX | FAQ 모달 > 2번째 슬라이드 |
| **스와이프 브리핑** | faqCards2[] | JSX | FAQ 모달 > 스와이프 캐러셀 |
| **비교 차트** | isBarCompareOpen | 모달 | 메인 > 비교 버튼 |
| --- | --- | --- | --- |
| **재렌탈 계산기** | isRerentalCalcOpen | 모달 | 더보기 > 재렌탈 계산기 |
| **스플래시 화면** | #app-loader | HTML/CSS | 앱 로딩 시 자동 표시 |

---

## 3. 공식 명칭 제안

향후 소통 시 아래 이름을 사용합니다:

| 공식 명칭 | 설명 | 코드 |
|---|---|---|
| **메인** | 앱 첫 화면 | App |
| **장바구니** | 제품별 상세 가격 모달 | QuoteModal |
| **명세서** | 검은 배경 영수증 | Receipt |
| **보관함** | 저장/추천/치트키 허브 | HubModal |
| **즐겨찾기** | 즐겨찾기 목록 | FavList |
| **케어진단** | 맞춤 케어 설문 | Survey |
| **핫픽** | 최저가 자동 추천 | HotPick |
| **비교차트** | 제품/기간 비교 | BarCompare |
| **가격탐색기** | 렌탈료 비교 도구 | PriceExplorer |
| **대시보드** | 메인 가격 표시 영역 | Dashboard |
| **미니대시** | 3분할 요약 (총납입/절약/하루) | MiniDash |

---

## 4. 네이밍 불일치 목록

| 개념 | 현재 사용되는 이름들 | 권장 통일명 |
|---|---|---|
| 즐겨찾기 | favorites, fav, FavList, favModal | `fav` |
| 보관함 | Hub, Archive, savedProposals | `hub` |
| 케어 진단 | Survey, Diagnose, 진단 | `survey` |
| 핫픽 추천 | HotPick, Recommendation, 추천 | `hotpick` |
| 모달 열기 | isXxxOpen, showXxx, xxxOpen | `isXxxOpen` |
| 탭 상태 | qTab, hubTab, configTab | `xxxTab` |
| 가격 계산 | cp, calculatedPrices, pricing | `cp` |
| 추가 제품 | extraProducts, calculatedExtras, addedProduct | `extra` |

---

## 5. 주요 컴포넌트 목록

| 컴포넌트 | 라인 | 용도 |
|---|---|---|
| HintBadge | ~1403 | 도움팁 배지 (? 말풍선, createPortal) |
| IconComponent | ~1415 | SVG 아이콘 렌더링 |
| MTag / FTag / CTag | ~1379/1388/1397 | 매트리스/프레임/케어 태그 |
| QuantityStepper | ~1579 | 수량 ±1 조절 |
| DonutChart | ~1406 | 도넛 차트 |
| NumberAnimation | ~1340 | 숫자 애니메이션 |
| HubArchiveCard | ~1502 | 보관함 카드 아이템 |
| QuoteModal | ~1675 | 장바구니 전체 |
| App | ~3649 | 루트 컴포넌트 |

---

## 6. 주요 데이터 구조

| 이름 | 라인 | 용도 |
|---|---|---|
| PRODUCT_DATA | ~1170 | 매트리스/프레임 전체 데이터 |
| CARE_OPTIONS | ~1115 | 케어 옵션 4종 |
| CARD_PROMO_DATA | ~1121 | 제휴카드 10종 |
| PROMOTION_FREE_MONTHS | ~1026 | 페스타 반값 개월수 |
| MODEL_ADD_FEES | ~1020 | 모델별 추가요금 |
| TOPPER_PRICES | ~1055 | 탑퍼 일시불 가격 |
| TOPPER_MONTHLY_COST | ~1067 | 탑퍼 월 비용 |
| SIZE_INFO | ~5695 | 사이즈 규격 |
| HEALING_DATA | 외부 JSON | 힐링 제품 11종 (data/catalog/healing.json, lazy load) |

---

## 7. 핵심 함수

| 함수명 | 용도 |
|---|---|
| _getDetailedPricingByCareImpl() | 단일 제품 가격 계산 엔진 (모든 계산의 근원) |
| getDetailedPricingByCare() | 위 함수의 캐시 래퍼 |
| **getSafeCompareParams()** | **userTouched 기반 안전 파라미터 (_mQ, _fQ, _vm)** |
| **safeGetPricing()** | **SSoT 래퍼 — 비교창/브리핑에서 반드시 이것 사용** |
| calculateCartPricing() | 장바구니 배열 합산 가격 계산 (⚠️ extraQtyTotal: 가격>0만 대수 포함, calculatedExtras 포함) |
| calcCardTotalDiscount() | 카드 할인 총액 계산 (기간 가중) |
| loadHealingCatalog() | 힐링 JSON lazy load (세션 38) |
| getHealingPrice() | 힐링 모델별 가격 조회 (세션 38) |
| addExtraProduct() | 추가 제품 등록 |
| addCartItem() / addComboToCart() | 장바구니에 제품 추가 |
| **_computeHpResults()** | **핫픽 공통 헬퍼 — 대수 산출 + 5/7/9년 pricing (SSoT, 세션 37)** |
| applyHotPick() | 핫픽 추천 적용 (→ _computeHpResults 호출) |
| startSurvey() / applySurveyResult() | 케어 진단 시작/결과 적용 |
| formatPrice() | 가격 포맷팅 (NaN 방어 포함) |
| **handleSizeChange(size, opts)** | **atomic: 사이즈+매트리스+프레임+케어 한번에 세팅 (세션 16)** |
| **handlePeriodChange(period, opts)** | **atomic: 약정+매트리스+프레임 한번에 세팅 (세션 16)** |
| **handleMattressChange(mattress, opts)** | **atomic: 매트리스+케어 한번에 세팅 (세션 16)** |
| **handleFrameChange(frame, opts)** | **atomic: 프레임 세팅 (세션 16)** |
| _correctMattress(size, period, mode, cur) | 내부: 유효한 매트리스 반환 |
| _correctFrame(size, period, mode, cur) | 내부: 유효한 프레임 반환 |
| **pillTouchStart/Move/End** | **pill 롱프레스 → 코웨이 홈페이지 열기 (세션 19)** |
| **pillClickGuard(handler)** | **롱프레스 후 click 이중 발화 방지 (세션 19)** |

---

## 8. 계산 흐름도 (세션 9 추가)

```
[_getDetailedPricingByCareImpl] ← 단일 제품 가격 엔진 (L4056)
    │
    ├─→ [calculatedPrices (cp)] ← 에디터 현재 선택 기반 useMemo (L4174)
    │     - activeMattress/Frame/Size/Period/Care + qty 기반
    │     - realSavings = (일시불+케어비용) - 총납입
    │
    └─→ [calculateCartPricing → cartCalculatedPrices (ccp)] ← 장바구니 합산 (L4240)
          - cartItems[] 배열 기반, 각 아이템 개별 계산 후 합산
          - totalSaving = 일시불가만 - 총납입 (⚠️ 케어비용 미포함)
          - extras는 bedRentPayable과 분리 계산

[분기 플래그]
  _useCart = cartItems.length > 0 && ccp
  → true: ccp 사용 (장바구니 모드)
  → false: cp 사용 (에디터 프리뷰 모드)

[가격 표시 경로 6개]
  1. 메인 HERO 대시보드 → cp 기반 (에디터 프리뷰)
  2. 장바구니 미니배너 → ccp.grandTotalMonthly 직접
  3. 장바구니 모달 (QuoteModal) → _useCart ? ccp : cp 분기
  4. FAQ 모달 → cp/ccp 혼합 (cardDiscount prop 사용)
  5. 핫픽 추천 → **_computeHpResults** 헬퍼 (SSoT, 세션 37)
  6. 비교 모달들 → **safeGetPricing()** 사용 (SSoT, 세션 14에서 변경)
     ⚠️ getDetailedPricingByCare 직접 호출 금지 (state 잔류 버그 발생)
  7. 케어 비교 모달 → 카드 하단에 방문관리/탑퍼/세스코 비용 상세 표시 (세션 15)
  8. 매트리스/프레임 비교 모달 → renderPeriodSelector에 케어 4종 버튼 포함 (세션 15)
  9. 사이즈 비교 모달 → SIZES.filter로 현재 매트리스에 없는 사이즈 숨김 (세션 28 변경)
  10. FESTA BENEFIT 워터폴 (세션 28 추가, 세션 29 핫픽, 세션 30 extras+할인상세)
     - 도넛: 렌탈 비용 구성 + 추가제품(환경가전) + 할인상세(명세서 연동) + 카드할인 + 실납입/월납부
     - 절감율: 항목별 일시불 대비 절감율 막대 + 방문관리/탑퍼 횟수 + 카드할인 + 총절감
     - 핫픽: 약정 시뮬레이션 (케어 변경 + 결합 토글 + 5/7/9년 비교 + 비용 차이 설명)
     - 카드: 카드 적용 상세 (기간별 분리)
     - 핫픽 step → **_computeHpResults** 헬퍼 (SSoT, 세션 37)
     - steps 계산 → **wfStepsData** useMemo (세션 37, 슬라이드 넘김 시 재계산 방지)
```
