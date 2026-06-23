# DEV_RULES — 개발 작업 규칙

> 이 파일은 모든 작업 시작 전 반드시 읽어야 합니다.

---

## ★★★ 절대 금지: 가격/할인 항목 임의 생성·변경

**코웨이 공식앱에 존재하지 않는 할인 항목, 가격 항목, 숫자를 임의로 만들지 않는다.**

```
위반 사례 (세션 35):
  - "방문관리 페스타 할인"이라는 존재하지 않는 항목을 임의 생성
  - 사전 보고 없이 코딩 → 고객에게 잘못된 정보 전달 위험

필수 절차:
  1. 할인 항목 추가/삭제/변경 → 반드시 사전 보고 후 승인
  2. 가격 표시 방식 변경 → 반드시 사전 보고 후 승인
  3. 새 할인율/금액/개월수 등 숫자 → 코웨이 공식 데이터 확인 후 승인
  4. "이 정도는 괜찮겠지" 판단 금지 → 숫자 관련은 무조건 물어본다
  5. UI 표시 변경이라도 금액/할인/비율이 포함되면 반드시 보고
```

**이 규칙은 다른 모든 규칙보다 우선한다.**

## ★★★ 계산 관련 작업 시 필수: 코딩 전 손계산 검증

**MD를 읽었다고 이해한 게 아니다. 실제 숫자로 계산해서 맞아야 이해한 것이다.**

```
필수 절차:
  1. 변경 대상 케이스의 숫자를 직접 손계산하여 보고
     예: "모디 슈싱 5년 서프 1대: rawMonthly=32,900 → mBase=28,900 → prePkg=23,900 → mFinal=23,900"
  2. 변경 전/후 시뮬레이션을 숫자 표로 보여주고 승인 후 코딩
     예: "세그먼트 합 X - 할인 합 Y = 최종 Z" 정합 확인
  3. 승인 없이 코딩 시작 절대 금지
  4. 코딩 중 정합이 안 맞으면 → 임의 항목 생성 금지, 작업 중단 후 보고

위반 사례 (세션 35):
  - 계산 로직을 정확히 이해하지 않은 채 코딩 시작
  - 정합을 맞추려고 "방문관리 페스타 할인"이라는 존재하지 않는 항목 임의 생성
  - 세그먼트 기준을 4번 변경하며 수시간 낭비
```

---

## ★ 최우선 규칙: 모든 코드 변경 시 필수 절차

**index.html의 모든 수정/추가/삭제 — 종류 불문, 매번 아래 절차를 따른다.**
사용자가 따로 요청하지 않아도 자동으로 수행한다.

```
1단계: 4개 파일 읽기 (매 세션, 매 작업 시작 시)
   → DEV_RULES.md + STRUCTURE.md + DESIGN_GUIDE.md + CALC_LOGIC.md

2단계: CALC_LOGIC.md로 영향 범위 확인
   → 수정할 코드가 계산 함수, 할인율, 상수, 가격 표시에 영향을 주는지 판단
   → 직접 관련 없더라도, 삭제/이동이 계산 호출 경로를 끊는지 확인

3단계: 코드 수정 (최소 범위, 한 번에 한 가지)

4단계: 빌드 실행 (자동, 사용자 요청 불필요)
   → export PATH="/tmp/node-v20.18.1-darwin-arm64/bin:$PATH"
   → cd ~/Desktop/"V5 festa" && sh build.sh
   → ★ cp index.html deploy/index.html 절대 금지 (Babel 3MB 포함됨)
   → 빌드 완료 시 사용자에게 "deploy 업데이트 완료" 알림

5단계: deploy/index.html로 프리뷰(375×812) 검증
   → 빌드 후: cp -r deploy/* /tmp/festa-deploy/ (preview 샌드박스용)
   → 프리뷰 서버: festa (port 8080, ruby WEBrick, /tmp/festa-deploy)
   → 기준 케이스: 퀸/5년/루네어/코지/토탈 → 59,320원
   → 수정한 화면까지 직접 이동하여 눈으로 확인
   → 프리뷰 안 되면 스킵하고 "빌드 완료"로 알림

6단계: 완료 보고 (스크린샷 또는 snapshot 증거 포함)
```

**위 절차를 생략하고 코드를 수정하는 것은 절대 금지.**

---

## 대규모 작업 원칙

- 기능 통합/분리/삭제 전 **반드시 영향받는 계산 함수 목록 먼저 파악**
- 내 승인 받고 작업 시작
- 작업 전 백업 필수

## 수정 원칙 (핵심)

- **한 번에 한 가지만 수정** — 여러 기능을 동시에 수정하지 마
- **수정 전 반드시 백업** — `index_backup_[날짜_시간].html`로 저장
- **수정 후 즉시 기준 케이스 검증** — 59,320원 통과 못 하면 즉시 롤백
- **검증 실패 시 즉시 롤백** — 원인 파악 후 재시도
- **수정 범위 최소화** — "이것만 수정, 다른 건 절대 건드리지 마"

## 계산 로직 보호

- UI 수정 시 계산 함수 **절대 건드리지 마**
- 건드려야 하면 나한테 **먼저 보고**
- 수정 후 반드시 기준 케이스로 검증
  - **퀸/5년/루네어/코지/토탈 → 59,320원**

## SSoT 원칙 (세션 14 추가)

- 비교창/브리핑에서 가격 계산 시 **반드시 `safeGetPricing()` 사용**
- `getDetailedPricingByCare()`를 비교창에서 직접 호출하면 **state 잔류 버그 재발**
- `userTouched.mattress/frame = false`인 항목은 **어디서도 가격에 포함 금지**
- 새 비교 UI 추가 시 `safeGetPricing()` 사용 필수

## UI 요소 삭제/이동 원칙

- 버튼/탭/섹션 삭제 시 **해당 요소가 계산 로직과 연동되어 있는지 반드시 확인**
- 연동된 경우: 대체 호출 경로가 있는지 확인하고, 없으면 **삭제 전 사용자에게 보고**
- 삭제 후 **기준 케이스(59,320원) 검증 필수**
- 상태 변수(state)를 트리거하는 유일한 버튼인지 확인 — 유일하면 삭제 금지

## 장바구니 연동 원칙

- 장바구니 수량 변경/추가/삭제 후 반드시 아래 전체 확인
  - 브리핑 슬라이드 금액 일치 여부
  - 대시보드 금액 일치 여부
  - 즐겨찾기 불러오기 후 금액 일치 여부
- **장바구니 변경 시 브리핑/대시보드 데이터 재계산 트리거 확인 필수**
- 즐겨찾기/위자드 조작 후 장바구니 변경 시 이전 state 잔류 여부 확인
- **프레임 단독 / 매트리스 단독 / 세트 각각 브리핑 확인 필수**

## 검수 원칙

- HERO 영역만 말고 **스크롤 아래까지 전부 확인**
- **모든 탭/모달 직접 열어서 확인**
- **다크/라이트 모드 둘 다 확인**
- **모바일 웹앱이므로 모든 확인은 Chrome DevTools 모바일 뷰 기준으로 진행**
  - 아이폰 14 Pro (393px) 또는 갤럭시 S23 (360px) 기준
- **오류 수정 후 반드시 전체 화면 검수** — 수정한 영역뿐 아니라 다른 영역까지 사이드이펙트 없는지 확인
- 장바구니 버튼 존재 여부, 하단 네비 바, 모달 열기/닫기 등 기본 동작까지 점검

## 완료 보고 원칙

- 수정 후 **반드시 프리뷰에서 직접 확인**한 뒤에만 완료 보고
- 코드만 수정하고 "완료"라고 하지 마. **스크린샷 또는 eval 결과**로 증명
- 프리뷰에서 해당 화면까지 직접 이동하여 눈으로 확인
- 확인 없이 완료 보고 절대 금지
- **"코드상 오류 없음"으로 완료 보고 금지** → 반드시 실제 버튼 클릭/데이터 입력/연동 동작까지 직접 확인 후 보고

## 파일 저장 원칙

- 수정 후 반드시 아래 순서로 진행
  1. `~/Desktop/V5 festa/index.html` 파일 저장 확인
  2. 프리뷰 서버 재시작 또는 새로고침
  3. 브라우저 강제 새로고침 (Cmd+Shift+R) — 캐시 클리어
  4. 프리뷰에서 직접 확인 후 완료 보고
- **파일 저장 없이 완료 보고 절대 금지**
- 저장 후에도 브라우저 캐시로 인해 이전 화면이 보일 수 있음 → 반드시 강제 새로고침 후 확인

## 위저드(컨설팅) 스텝 구조 (세션 21 변경)

- Step 1~3: 건강/반려/생활 설문 (복수 선택 가능)
- Step 4: 케어 설문 (5문항 슬라이드)
- Step 5: 투/단매트리스 선택 ← **마지막으로 이동됨**
- Step 6: 결과 + 자동 적용
- `consultStep < 6` 동안 **좌우 스와이프 탭 전환 차단**
- 보관함 → 진단 버튼: `handleDiagnoseFromArchive` → 컨설팅 위저드 진입 (SurveyModal 아님)

## 계산 연동 규칙 (세션 9 추가)

### 이중 계산 체계
- **cp** (`calculatedPrices`): 에디터 현재 선택 기반 (useMemo)
- **ccp** (`cartCalculatedPrices`): 장바구니 배열 합산 (useMemo)
- **분기**: `_useCart = cartItems.length > 0 && ccp` → true면 ccp 사용, false면 cp 사용

### _useCart 분기 필수
- 가격을 표시하는 모든 곳에서 `_useCart ? ccp.xxx : cp.xxx` 패턴 준수
- **cp의 값을 장바구니 모드에서 절대 사용하지 마** (extras, 할인내역 포함)
- **브리핑/대시보드/슬라이드도 동일하게 _useCart 분기 적용 필수**

### dailyPrice 통일
- 하루 비용 계산은 **모든 화면에서 `Math.floor`** 사용 (Math.round 금지)
- 상수 `DAYS_IN_MONTH` 사용 (하드코딩 `30` 금지)

### extras(추가 제품) 계산
- calculateCartPricing에서 extras는 **bedRentPayable과 분리 계산** 필수
- `grandTotalMonthly`(표시용)에는 extras 포함 OK
- `grandTotalRentPayable`(총납입)은 `bedRentPayable + extrasRentPayable` 분리 합산

### 카드 할인 표시
- 월 할인: `cardDiscount` (= `tier.total`) 사용 — 프로모 기간 월 할인액
- 총 할인: `calcCardTotalDiscount()` 사용 — 프로모/비프로모 기간 가중 합산
- **평균 내지 마** (`totalDiscount / months` 금지)

## 할인 구조 명세

- 패키지 할인: 2대 이상 → 자동 15% (토글 무관)
- 결합할인: 기존 코웨이 고객 + 토글 ON → 1대에서 5% 실질 효과
- 반값할인: 1대 → 약정별 N개월 / 3대+ → 3~5개월 / 2대 → 없음
- 반값 약정 개월: `PROMOTION_FREE_MONTHS = { 3:3, 5:6, 7:12, 9:15 }` (L1046)

## 비교 모달 규칙

### 카드 클릭 동작
- 비교 모달에서 카드 클릭 시 **선택만 적용**, 모달은 닫지 않음 (X 버튼으로 닫기)
- **반드시 handler 함수 사용** (`handleMattressChange`, `handleFrameChange` 등)
- `setActiveMattress` 등 직접 호출 금지 — 도미노 cascade 재발 원인

### 도미노 방지 원칙 (세션 16 추가)
- state 변경 시 **반드시 atomic handler 사용**:
  - `handleSizeChange(size, {touch:true})` — 사이즈+매트리스+프레임+케어 한번에
  - `handlePeriodChange(period, {touch:true})` — 약정+매트리스+프레임 한번에
  - `handleMattressChange(mattress, {touch:true})` — 매트리스+케어 한번에
  - `handleFrameChange(frame, {touch:true})` — 프레임 단독
- `setActiveSize()`, `setActivePeriod()`, `setActiveMattress()` **직접 호출 절대 금지**
- 새 UI 추가 시에도 handler 경유 필수
- 기존 useEffect는 안전망 — handler가 정상이면 발동 안 함

### barCompare(매트리스/프레임 비교 모달) 규칙 (세션 16 추가, 세션 17 정정)
- barCompare에는 **2개 섹션**이 있음:
  1. **카드 비교 섹션** (상단) — 메인 state 사용 (`activePeriod`, `activeCare`, `activeSize`)
  2. **바 차트 비교 섹션** (하단) — 로컬 state 사용 (`barCompareSize`, `barComparePeriod`, `barCompareCare`)
- 로컬 state는 바 차트 섹션(독립 비교 도구)에서 **실사용 중 — 제거 금지**
- 카드 비교 섹션에서 변경하면 메인 대시보드에 즉시 반영됨
- M담기/F담기 버튼으로 장바구니 담기 가능

### SizeCompare 보정 규칙 (세션 17 추가, 세션 28 변경)
- 사이즈 비교 모달에서 **현재 매트리스에 없는 사이즈는 필터링** (SIZES.filter)
- 기존의 자동보정+대체 표시 방식 대신, 해당 사이즈가 없으면 목록에서 숨김
- `viewMode === 'frameOnly'`일 때는 프레임 기준으로 필터링

### 장바구니 불일치 안내창 규칙 (세션 18 추가)
- `addToCart` 호출 시 기존 cartItems의 **마지막 아이템**과 사이즈/약정 비교
- 불일치 시 `cartMismatchConfirm` state로 모달 표시
- "그래도 담기" → `_doAddToCart(newItem)` 호출
- `editingCartItemId`에 해당하는 아이템은 비교에서 제외

### HERO 제품 홈페이지 링크 규칙 (세션 18 추가)
- HERO MONTHLY 라벨 옆에 선택된 매트리스/프레임의 코웨이 홈페이지 링크 버튼 표시
- `<a href target="_blank">` 사용 (iOS 팝업 차단 우회)
- `onClick stopPropagation` 필수 (HERO 영역 클릭 시 장바구니 모달 오픈 방지)

### pill 롱프레스 → 홈페이지 열기 규칙 (세션 19 추가)
- 매트리스/프레임 pill 버튼 500ms 이상 누르면 `PRODUCT_URLS[key]` 새 탭 열기
- touchend 기반 (setTimeout 없음 → iOS 팝업 차단 우회 의도)
- `pillLongPress` useRef로 시작시각/좌표/triggered 관리
- `pillTouchMove` 10px 초과 이동 시 롱프레스 취소 (스크롤 보호)
- `pillClickGuard`로 롱프레스 후 click 이벤트 이중 발화 방지
- **비교 모달 내 pill에는 미적용** (메인 화면만)
- **iOS 실기기 테스트 필요** — React synthetic touchEnd에서 user activation 인정 여부 미확인

### HERO 비교 텍스트 규칙 (세션 19 추가)
- 형식: `{현재모드} {현재가}원  {비교모드} {차액}원 더 저렴`
- 예: "페스타 59,320원  재렌탈 1,230원 더 저렴"
- `_fm` = 현재 promoMode 기준 월납부액, `_altFm` = 반대 모드
- `_diff = _fm - _altFm` → 양수면 alt 저렴, 음수면 현재 저렴

### 케어 선택 버튼
- 매트리스/프레임 비교 모달에 케어 4종 버튼 포함 (`renderPeriodSelector` 내)
- `setActiveCare` + `setUserTouched({care:true})` 반드시 함께 호출
- 대시보드 케어 버튼은 `activeCare===opt.id && !!userTouched.care`로 활성 판단

### 케어 비용 표시 상수
- 방문관리 월비용: 5,100원 (6,000 × 0.85 페스타 할인)
- 방문 주기: 4개월 1회
- 세스코: 싱글/슈싱 72,000 / 퀸 77,000 / 킹+ 82,000원/회
- 탑퍼 월비용: `TOPPER_MONTHLY_COST` 객체 참조

## 재렌탈 계산기 독립성 규칙 (세션 22 추가)
- `rcBase/rcPeriod/rcUnits/rcCross`는 **재렌탈 계산기 전용 state**
- 메인 `activePeriod`, `isCrossDiscount`와 **절대 연동 금지**
- `_getDetailedPricingByCareImpl` **호출 금지** — 독립 인라인 계산만 사용
- 약정 3/6년은 계산기에만 존재 (메인 앱은 5/7/9년만)
- 계산 공식: `first12 = ceil(base×0.80/10)×10`, `rest = ceil(base×(1-rate)/10)×10`, `avg = ceil(가중평균/10)×10`
- restRate: 1대=10%, 결합=13%, 2대+=16%

## 스플래시/PWA 규칙 (세션 22 추가)
- 스플래시: `#app-loader` (CSS 애니메이션) — 앱 로딩 완료 시 fade-out 후 display:none
- `manifest.json` + `sw.js`는 index.html과 같은 폴더에 위치해야 함
- SW 수정 시 브라우저 캐시 주의 — SW는 24시간 캐시됨

## 계산 로직 수정 시 필수 절차 (세션 23 추가)

```
1. CALC_LOGIC.md 먼저 읽기 (할인 공식, 상수, 분기 조건 전체 수록)
2. 수정 대상 코드 라인 확인
3. 코드 수정 (최소 범위)
4. 프리뷰(375×812)에서 기준 케이스 검증: 퀸/5년/루네어/코지/토탈 → 59,320원
5. 해당 기능 화면까지 직접 이동하여 확인 (스크린샷 또는 snapshot)
6. 다크/라이트 모드 확인
7. 완료 보고
```

- **CALC_LOGIC.md 안 읽고 계산 코드 수정 절대 금지**
- 새 할인 규칙 추가 시 CALC_LOGIC.md도 함께 업데이트
- 총납입 탭, 요약 탭, 명세서, 브리핑 등 가격 표시 영역 수정 시에도 CALC_LOGIC.md 참조

## BarCompare 총금액 규칙 (세션 24 추가)

- **totalRent = pricing.totalRentPayable 사용 필수** (단순 `monthly × months` 곱셈 금지)
- **totalDiff = totalRent - currentTotalRent** (월차액 × 개월수가 아님 — 반값 개월이 다를 수 있음)
- 다른 6개 비교 모달(Size/Period/Mattress/Frame/Care/PriceExplorer)은 이미 정상
- 새 비교 UI 추가 시 반드시 `pricing.totalRentPayable` 사용

## 카트 모드 상세 명세서 규칙 (세션 24 추가)

- 카트 모드(`_useCart`)에서 상세 명세서 렌더링 시 `ccp.items` + `ccp.calculatedExtras` 둘 다 표시 필수
- 추가제품 없으면 빈 배열이므로 자동 스킵됨
- 에디터 모드(`!_useCart`)에서는 `cp.calculatedExtras` 사용

## 도움팁 HintBadge 규칙 (세션 26 추가, 세션 28 변경)

- `HintBadge` 컴포넌트는 `showHints` state가 true일 때만 렌더링
- 말풍선은 `ReactDOM.createPortal`로 `document.body`에 렌더링 (overflow 잘림 방지)
- 배지 위치가 화면 상단(top < 200px)이면 아래로, 그 외엔 위로 말풍선 표시
- `e.stopPropagation()` 필수 — 부모 버튼 동작 방지
- **자동 닫힘 제거 (세션 28)** — 탭으로만 열고 닫힘 (❓ 재탭 또는 말풍선 탭)
- 기본값: **ON** (localStorage `berex_show_hints` 없으면 true)
- 토글: 더보기(ToolboxModal) 하단 "도움팁" 스위치
- FESTA BENEFIT 슬라이드에서는 `show={true}` (showHints 무관, 항상 표시)

## FESTA BENEFIT 워터폴 규칙 (세션 28 추가, 세션 29 핫픽 통합)

### 슬라이드 순서 (두괄식)
- 인트로 → **도넛(isDonutStep)** → **절감율(isSummaryStep)** → **핫픽(isHotPickStep)** → 카드(isCardStep) → 세부(역순)
- `steps` 배열 빌드 후 재정렬 로직으로 구현 — steps.length 변경 주의

### 핫픽 슬라이드 (세션 29 추가)
- `wfHpPeriod` state: 슬라이드 내 선택 약정 (워터폴 닫으면 null 리셋)
- 케어 4종 버튼: `setActiveCare` + `setUserTouched` 호출 → **메인 state 직접 변경**
- 결합할인 토글: `setIsCrossDiscount` 호출 → **메인 state 직접 변경**
- 약정 카드: **선택만** (`setWfHpPeriod`), 하단 "적용" 버튼으로 `handlePeriodChange` 호출
- 비용 차이 설명: 7/9년 선택 시 5년 대비 AS 연장/방문관리 추가/탑퍼 연장/기간 차이 자동 표시
- `getDetailedPricingByCare` 읽기 전용 호출 (계산 함수 수정 없음)

### 짧은다리 = 파운데이션만 (세션 29 수정)
- `_dIsFd = _dFrameKey === 'foundation'` (도넛 슬라이드)
- 코지/우디/볼륨/루나는 짧은다리 불가 — 도넛에서 짧은다리 줄 숨김

### 카드할인 연회비 차감
- `sumCardNet = sumCardD - (cardFeeYear × period)` — 순할인액
- 도넛/절감율/카드 슬라이드 모두 순할인액 기준
- 5년 초과 약정: 프로모 기간/이후 기간 상세 표시

### QuoteModal z-index
- 기존 `z-[6000]` → **`z-[9000]`** (워터폴 z-8000 위에 표시)
- 워터폴에서 제휴카드 팝업 열 때 가려지지 않도록

### 장바구니 BENEFIT 버튼 (세션 30 변경)
- 장바구니 하단 버튼 **모든 탭**에서 "⚡ BENEFIT" 표시
- 클릭 시 `onClose` → `setWfStep(0); setIsWaterfallOpen(true)`
- 기존 브리핑(FAQ)은 메인 화면 "⚡ 브리핑" 버튼으로만 접근

### 추가 제품(환경가전) 워터폴 반영 (세션 30 추가)
- `_wfExtras`: `calculatedExtras`에서 `price > 0` 필터링
- `extraRent2` → `rentS2`에 합산 (워터폴 총 렌탈)
- 도넛 세그먼트에 추가 제품 각각 표시 (이름/금액/비율)
- 도넛 컬러풀 7색 확장 (`donutColorPoolExt`)
- 핫픽 step은 기존에 `extraProducts` 전달하여 이미 반영됨

### 도넛 할인 상세 내역 (세션 30 추가)
- 장바구니 상세명세서와 **동일한 할인 항목** 도넛 슬라이드에 표시
- `ccp.items[]`의 `mBC`, `mLE` 필드 사용 (스프레드로 포함됨)
- 항목: 자동이체 / 현장할인 / VIP 약정할인 / 루네어 특별할인 / 페스타 15% / 페스타 반값
- 케어 옵션에 따라 자동 표시/숨김

### 도넛 비용 명세서 정합성 (세션 35 수정) ★★★
- 도넛 세그먼트 val = `mBase`/`fBase` 기준 (할인 **전** 정상가)
  - `_mRentForDonut = cp.mBase * qty * months` (할인 전 매트리스)
  - `_fRentForDonut = cp.fBase * qty * months` (할인 전 프레임)
- `donutTotal = totalRentPayable` (실제 최종 납입액)
- **정합 검증**: 세그먼트 합(donutTotalRaw) - 할인 합 = donutTotal
- 할인 항목: 자동이체 + 현장 + VIP + 루네어특별(mLE) + 패키지 + 반값 + 카드
- 비용 명세서: 세그먼트 범례 + 정상가 합계 + 할인 상세 + 총 할인 → 하나의 카드로 통합
- `careInc2` 사용 (couponV2 제외) — 서프/스페셜에서 쿠폰 유령 차감 방지
- **`careTot2` 사용 금지** — 도넛/비교 슬라이드에서 `careInc2`만 사용

## 배포 규칙 (세션 36 변경)

- **배포 URL**: `https://coway-estimate.pages.dev` (Cloudflare Pages)
- **배포 폴더**: `/Users/minmacbook/Desktop/V5 festa/deploy/` (index.html + manifest.json + sw.js)
- **배포 방법**: Cloudflare 대시보드 → Workers & Pages → coway-estimate → Create deployment → deploy 폴더 드래그&드롭
- **OG 메타태그**: 메인/deploy 모두 포함 (BEREX)
- **이전 URL**: Netlify `silver-baklava-9adc62.netlify.app` (크레딧 소진, 사용 중단)

### ★★★ deploy 업데이트 필수 절차 (cp 금지!)

```
index.html 수정 후 deploy 업데이트 방법:

  ✅ 올바른 방법:
    export PATH="/tmp/node-v20.18.1-darwin-arm64/bin:$PATH"
    cd ~/Desktop/"V5 festa" && sh build.sh

  ❌ 절대 금지:
    cp index.html deploy/index.html    ← Babel 3MB 포함된 원본이 배포됨

  왜?
    - index.html = Babel 인라인(text/babel) → 브라우저가 3MB Babel 다운 + 실시간 컴파일
    - build.sh = JSX 사전변환 + Babel standalone 제거 → 빠른 로딩
    - cp로 복사하면 로딩이 극도로 느려짐 (모바일에서 특히 심각)

  Node.js 경로:
    /tmp/node-v20.18.1-darwin-arm64/bin/node
    (재부팅 시 /tmp 삭제될 수 있음 → 재설치 필요)
```

## 경쟁사 비교표 규칙 (세션 34 추가)

- `data/competitorMap.json` 수정만으로 경쟁사 가격/모델 변경 가능 (index.html 수정 불필요)
- 새 필드 추가 시 `calcCompetitorCosts()` (L1256) + 렌더링 코드 수정 필요
- `COMPETITOR_MAP`은 lazy load + cache-busting (`cache:'no-cache'` + timestamp)
- **루트 `competitorMap.json`과 `data/competitorMap.json` 반드시 동기화** (서버 캐시 대응)
- deploy 시 `deploy/data/competitorMap.json`도 복사 필수
- 경쟁사 슬라이드 순서: 도넛 → 절감율 → **경쟁사** → 핫픽 → 카드 → 세부
- 비교표 스와이프 잠금: `onTouchStart/Move/End stopPropagation` (슬라이드 이동 방지)
- 확대 카드: `wfCompExpand` state → 풀 너비 + 좌우 스와이프 전환
- 등급 매칭: `getCompetitorTier()` → cowayModels 배열에서 매트리스명 포함 여부로 판단

## 삭제된 팝업 목록 (세션 26)

- 레벨 선택, 튜토리얼, 핫픽 퀴즈, 업데이트 로그 — 모두 삭제됨
- `userLevel`, `tutActive`, `tutIs`, `quizActive`, `showUpdateLog` 등 관련 state/함수/상수 전부 제거
- 앱 진입: 홈케어닥터 등록(첫 실행) → 바로 메인 화면

## 작업 시작 전 필수

```
DESIGN_GUIDE.md + STRUCTURE.md + DEV_RULES.md + CALC_LOGIC.md
네 파일 모두 읽고 시작해줘.
```
