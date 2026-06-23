# UI 전면 개편 진행 현황

## 작업일: 2026-03-21 ~ 04-04

## 완료된 작업 (세션 39 — 04-14, 페스타 D-day 자동전환 + UI 대규모 개선)

### 페스타 D-day 시스템
- 2026-04-29: 페스타 기간 연장으로 종료일 미정 상태 재활성화 (`FESTA_PROMOTION_ACTIVE=true`, `FESTA_END_DATE=null`)
- 2026-04-29: 고객 노출 라벨을 `프로모션`에서 `5월한정패키지`로 변경
- IS_FESTA 상수 (종료일이 있을 때 자동 판별, 종료일 미정이면 수동 활성 유지)
- 패키지 할인 15%→10% 자동 전환
- 반값 할인 자동 비활성화 (festaMonths=0)
- 할인 라벨 자동 전환 ("페스타 15%" → "패키지 10%")
- D-day 배지 (가격 옆 + 반값 카드)

### 반값 상세 카드
- 메인 화면: 처음 N개월 / 이후 금액 좌우 분할 표시
- 혜택보기 명세서: 반값 기간별 sub-line (처음/이후 월렌탈+총액)

### UI 정리
- 페스타 15% 토글 제거 → 결합 5% 한 줄 토글
- 최저 약정 배지 ("최저") + 힌트 텍스트 ("N년이 X원 더 저렴")
- 카드 공지 팝업 4월말 연장

### 계산 로직 수정
- 절약 계산식 통일: 정상가 합계 - 총납입 + 등록비면제
- 등록비 면제: 고정 10만 → 대수×10만원
- bestPeriodInfo useMemo 캐싱 (성능 최적화)

### 문서/출력물
- A4 인쇄용 가격표 (HTML + DOCX) — 매트/프레임/세트/반값 4섹션
- 5년 서프 세트 비교표 DOCX (6그룹 18조합)
- 아이패드 미니6 오프라인 빌드 (index-offline.html)

### 자동화
- preview.sh (빌드+복사 원커맨드)
- .claude/settings.json hook (Edit/Write 후 자동 실행)

---

## 완료된 작업 (세션 38 — 04-04, 힐링 카탈로그 + 4월설치 수량 + 렌탈실적 안내)

### 힐링 제품 카탈로그 시스템
- data/catalog/healing.json 신규 생성 (12KB, 11종: 코어셋2 + 마사지셋2 + 안마의자7)
- 힐링 데이터 로더 (loadHealingCatalog, getHealingPrice) + 앱 시작 시 lazy load
- 힐링 상태 변수 10개 + healingAsExtra/allExtras useMemo
- cp 가드 확장 (침대 없이 힐링만으로도 대시보드 가격 표시)
- 메인: 케어 아래 접기/펼치기 + "💆 힐링 제품 추가" 버튼
- 풀스크린 모달 2단계 (카테고리→제품 → 관리방법→약정→가격상세→추가)
- 선택 완료 시 메인 요약 카드 (제품명+옵션+가격+✕)
- 결합5%/패키지15%/반값 자동 연동 확인

### 4월설치 수량 입력
- isAprilCombo(bool, +1) → aprilCount(number, +N) 변환
- 엔진 3곳 + 캐시키 + dependency 전부 업데이트
- 토글 UI → − 수량 + 스테퍼 UI (메인+워터폴 양쪽)
- 결합5% | 4월설치 ? − 0 + 한 줄 컴팩트 배치

### 렌탈료 실적 포함 안내
- 카드 탭 확장 패널: 상세 박스 (렌탈료/필요실적/추가필요/실적충족)
- 총납입/요약/워터폴 카드 섹션: _creditMsg 한 줄 안내

### 파일 크기
- index.html: 906KB → 926KB (+20KB)
- 백업: index4.html (작업 전 원본)

## 완료된 작업 (세션 36 — 04-03, Notion 스타일 + 카드 업데이트 + UI 개선)

- "방문관리 페스타 할인" 임의 생성 항목 삭제 + 정합성 검증 완료
- Notion 디자인 스타일 전면 적용 (색상/radius/그림자 일괄 변경)
- 4월 카드 할인 데이터 업데이트 (현대M3/우리II/KB국민II)
- M담기/F담기 → 장바구니 담기 1개 버튼으로 통합
- BENEFIT → 혜택보기 변경
- 도넛 슬라이드 제품 요약 라인 추가
- 짧은다리/높이 표시 버그 수정 (프레임 미선택 시)
- 서비스프리 표기 통일 (메인만 서프, 나머지 서비스프리)
- DESIGN_GUIDE.md Notion 스타일로 전면 교체
- 프리뷰 환경 구축 (Node.js + ruby WEBrick + SW 캐시 해결)
- deploy 빌드 절차 확립 (cp 금지, build.sh 필수)

## 완료된 작업 (세션 35 — 04-02, 도넛 정상가 표시 개선+계산 로직 검증)

### 계산 엔진 — 코웨이 공식앱 대조 검증 ★★★
- 카탈로그 PDF 원가 = 토탈케어 + 자동이체 적용 후 = mFinal(토탈) 확인
- 모디 슈싱 4케어(서프/스페셜/베이직/토탈) 공식앱 스크린샷과 코드 계산 100% 일치
- 하이브리드4 전 사이즈/약정 카탈로그 대조 완료

### mLE = 5000 루네어 특별할인 추가
- `if (selectedMattress === 'lunaire') mLE = 5000` (L4242)
- 원래 구조만 있고 값 할당 누락 → 추가
- mFinal 변동 없음 (표시용, mBase +5000 / prePkg -5000 상쇄)

### 도넛 슬라이드1 — 비용 명세서 개선
- 세그먼트+할인 상세 → 하나의 통합 카드로 합침
- 정상가 합계 행 추가
- donutTotal = totalRentPayable (실제 최종 납입액)
- 세그먼트 기준: mBase(할인 전 정상가, 공식앱 취소선과 일치)
- 탑퍼: aFee × months (할인 전 원가), 방문관리: 6,000 × months (할인 전 원가)
- 카드 할인 상세(기간별/연회비) 복원

### 슬라이드2 — 정상렌탈료 3단 비교 바
- 일시불 / 정상 렌탈료 / 할인 후 3줄 비교 추가
- 일시불 대비 %, 정상가 대비 % 분리 표시

### MD 파일 대규모 업데이트
- CALC_LOGIC.md: §14 도넛 표시 로직, §15 카탈로그 원가 대조, 할인 표시 전략
- DEV_RULES.md: ★★★ 임의 생성 금지, ★★★ 손계산 검증 필수
- 메모리: feedback_no_arbitrary_pricing.md, feedback_verify_before_code.md, feedback_deploy_sync.md

### ⚠️ 미완료 — "방문관리 페스타 할인" 삭제 필요
- 임의 생성된 할인 항목. 다음 세션에서 최우선 삭제

## 완료된 작업 (세션 34 — 03-31, 경쟁사비교표+결합계산기삭제+위저드자동선택)

### 결합계산기 삭제
- SmartHub 내 결합할인 계산기 전체 제거 (state 6줄 + UI ~170줄)
- 계산 로직 영향 없음 (독립 state)

### 컨설팅 위저드 Step 6 자동 선택
- 위저드 완료 시 권장 높이 범위 내 최적 조합 자동 선택
- `✗` 표시 혼란 해결

### 경쟁사 비교표 신규 ★★★
- BENEFIT 워터폴에 "5년 총비용 경쟁사 비교" 슬라이드 추가
- data/competitorMap.json (v1.5) lazy load
- 3컬럼 한 화면 (코웨이/시몬스/에이스) + 카드 탭 확대 + 스와이프 전환
- 정가 기준, 매트/프레임 분리, 토퍼 교체 비용 포함
- 침대 높이 3사 비교 표시
- MDF 태그, 본넬 기반 태그, 모델명 링크, footnotes 6개
- 스와이프 잠금 (슬라이드 이동 방지)
- 절감 배너: "코웨이가 시몬스 대비 약 175만원 절감"

## 완료된 작업 (세션 33 — 03-30, 워터폴반값정합성+카드순할인+비교표)

### 워터폴 반값 할인 정합성 정리 ★★★
- 도넛 세그먼트 val: mRent2(반값 후) → _mRentRaw(반값 전)으로 변경
- donutTotal = donutTotalRaw - _wfPromo (반값 차감)
- 범례 월렌탈료 × months = 세그먼트 val 정합 확인

### couponV2 유령 제거
- 서프/스페셜 케어에서 딥클리닝 쿠폰 가치가 매트리스 세그먼트에서 사라지는 버그
- careTot2 → careInc2 (도넛 세그먼트 + 비교 슬라이드 rS.m/rS.care)

### 카드할인 순할인액 표시
- 도넛 카드할인 헤더: donutCardDGross(총할인) → donutCardD(순할인=총-연회비)
- 전체 할인 합계도 순할인 기준

### 절감율 슬라이드 리디자인 시도 → 롤백
- 카드형+롤리팝 차트 시도 → 사용자 피드백으로 바 차트 스타일 복원
- CSS keyframes (lollipopGrow/lollipopFade) 코드에 잔류 (미사용)
- isSummaryStep 추가 필드 잔류 (향후 리디자인 시 활용 가능)

### 비교표 생성 (노션+워드)
- 투매트리스 프레임 5종 일시불 vs 15% 렌탈 비교표
- 매트리스 10종 일시불 vs 15% 렌탈 비교표 (서프 기준 prePkg=rawMonthly-9000)
- 노션 2페이지 + docx 2파일 생성

## 완료된 작업 (세션 32 — 03-30, 메인UI리디자인+워터폴수정+배포이전)

### 워터폴 UX 개선
- 드래그 닫기/배경 클릭 닫기 제거 (X버튼+닫기 버튼만)
- 좌우 탭 → 스와이프 + ◀▶ 화살표 버튼
- 인트로 슬라이드 숨김 (바로 도넛부터 시작)
- 반값 할인 총납입 반영 (mRent2/fRent2에 _mPromo/_fPromo 차감)
- 도넛 월 납부액: cp.totalMonthly 사용
- 도넛 범례에 월 렌탈료 추가
- 워터폴 글자크기 --fs-scale:1 고정

### 메인 UI 리디자인
- 카테고리 필터 2줄 삭제
- 4개+더보기 방식 (사이즈/매트/프레임)
- flex:1 균등 배분 + 더보기 우측 정렬
- 펼침 상태: gap:6px, padding:12px
- 접기 버튼 녹색 강조
- 결합할인 5% 토글 항상 표시 (한 줄)
- HERO 영역 축소 (MONTHLY 라벨 숨김, 패딩/글자 축소)
- 📊 아이콘 녹색 원형 배경

### 명칭 변경
- 케어: 서비스프리→서프, 스페셜체인지→스페셜, 순서→토탈/서프/스페셜/베이직
- 매트: 하이브리드4→하4, 프레임: 파운데이션→파데
- 브리핑→BENEFIT, OG: BIREX→BEREX

### 삭제/정리
- 메인 도움말(HintBadge) 10개 삭제
- 비교창 실전 팁(PopupTipAccordion) 5곳 삭제
- FAQ 모달 비활성화 (BENEFIT 워터폴로 대체)
- 목업 파일 4개 삭제

### 배포 이전
- Netlify → Cloudflare Pages (`coway-estimate.pages.dev`)
- 글자크기 max 150% 확장

## 완료된 작업 (세션 31 — 03-30, 검수+배포)

### 세션 30 수정사항 유실 확인 → 유실 없음
- index.html(10566줄) = 페스타앱 V7(3.29).html 동일
- BENEFIT 버튼, _wfExtras, extraRent2, 도넛 할인 상세, _bvMattQty 모두 포함 확인

### 휴대 디바이스 최적화 점검
- 가로 오버플로우 없음, 터치 영역 OK (선택 칩 32px은 의도적)
- 콘솔 에러 0건, 스크롤 정상

### 주야간 모드 디자인 가이드 점검
- 라이트/다크 모드: 메인/장바구니/워터폴/도넛/카드탭/명세서 정상
- 하드코딩 색상: 13건 #fff (항상-어두운 컴포넌트), 5건 #111 (accent 배경) — 허용 범위
- 기준 케이스: 59,320원 정상 통과

### 카톡 배포용 Netlify 배포
- deploy 폴더 생성 (index.html + manifest.json + sw.js)
- OG 메타태그 추가 (deploy/index.html에만)
- Netlify Drop 배포: `https://silver-baklava-9adc62.netlify.app`

## 백업
- `index_backup_20260330_s33.html` — 세션 33 작업 전 백업
- `index99.html` — 세션 26 작업 전 백업 (안정성점검+팝업삭제+도움팁 전)
- `index98.html` — 세션 25 작업 전 백업 (세일즈팁 삭제+버그수정 전)
- `index97.html` — 세션 24 작업 전 백업 (명세서+BarCompare 수정 전)
- `index96.html` — 세션 23 작업 전 백업 (총납입 탭 수정 전)
- `index95.html` — 세션 22 최종 백업 (재렌탈 계산기 추가 전)
- `index94.html` — 세션 22 중간 백업 (스플래시+manifest 전)
- `index93.html` — 세션 22 스플래시 화면 전 백업
- `index92.html` — 세션 21 최종 백업 (풀스크린+위저드개선+워터폴차트)
- `index91.html` — 세션 20 최종 백업
- `index90.html` — 세션 19 최종 백업 (pill 롱프레스 + HERO 비교 텍스트 수정)
- `index89.html` — 세션 19 중간 백업 (미사용 코드 정리)
- `index88.html` — 세션 18 최종 백업 (장바구니 불일치 안내창 + HERO 링크 버튼)
- `index87.html` — 세션 18 중간 백업 (장바구니 불일치 안내창만)
- `index86.html` — 세션 17 최종 백업 (사이즈 비교 0원 버그 해결)
- `index85.html` — 세션 16 최종 백업 (atomic handler + barCompare 메인연동)
- `index80.html` — 세션 15 최종 백업
- `index78.html` — 세션 14 최종 백업 (즐겨찾기 비교 삭제 전)
- `index77.html` — 세션 14 버그 수정 전
- `index76.html` — 세션 14 HERO UI 작업 전
- `index75.html` — 세션 14 토글/초기화 전
- `index74.html` — 세션 14 SSoT 리팩토링 전

## 완료된 작업 (세션 27 — 03-28, 설문 구조 편집기 신규 제작)

### 설문 구조 분석
- 맞춤 추천 · 높이 진단 (consultStep 1~6) 전체 로직 분석
- `맞춤추천_높이진단_구조도.opml` — MindNode 구조도 생성
- `survey_flow.opml` — 전체 설문 플로우 구조도

### 설문 구조 편집기 (`survey-editor.html`) 신규 제작
- Step 1~6 전체 설문 항목 시각적 편집 (원클릭 토글, 숫자 입력)
- 케어 자동설정: 4종 라디오 토글 (서비스프리/스페셜/베이직/토탈)
- 높이 보정: 시나리오별 숫자 입력 (침대있음/처음구매)
- 추천 매트리스·프레임: 전체 목록에서 원클릭 선택/해제
- 제외 모델: 빨간 토글로 제외할 모델 지정
- 제품 조합 미리보기: 높이 설정 시 실제 매트리스+프레임 조합 표시
- 고객 침대 높이 입력: 예시 높이 기준 조합 미리보기
- ◉/⊘ 숨김 토글: 삭제 대신 보이기/숨기기
- 추천값 비교: `추천 ✓` / `추천값과 다름` 배지 + 원클릭 복원
- 폰트 크기 조절: A-/A+ (80%~160%, zoom 기반)
- 주간/야간 모드: 다크/라이트 테마 토글
- JSON 내보내기: 편집 결과를 Claude에게 전달하여 코드 반영

## 완료된 작업 (세션 26 — 03-27, 안정성점검 + 4팝업삭제 + 도움팁 + 가이드)

### 앱 안정성 점검
- localStorage 전체 try/catch 방어 (saveFavs, saveCustomTags, proposals 등)
- Promise.all .catch() 누락 수정
- SalesFaq 잔존 참조 정리 (온보딩 "치트키" 텍스트, 하단네비 배지)

### 4개 팝업 삭제
- 레벨 선택 (userLevel, handleLevelSelect, TUTORIAL_STEPS)
- 튜토리얼 (tutActive, tutIs, tutorialStep, CSS .tut-spotlight)
- 핫픽 퀴즈 (quizState 11개 state, quizQuestions, useEffect 4개)
- 업데이트 로그 (showUpdateLog, UPDATE_LOG_VERSION)
- 앱 진입: 홈케어닥터 등록(첫실행) → 바로 메인 화면

### 도움팁 기능 (HintBadge)
- HintBadge 컴포넌트 — 초록 ? 배지, 클릭 시 근처 말풍선 팝업
- 16개 힌트 배치 (다크모드, 재렌탈탭, 워터폴, 비교, 롱프레스, M/F담기, 맞춤추천, 브리핑, 리포트, 핫픽, 이미지창고, 재렌탈계산기, 글자크기, 맞춤추천탭, 즐겨찾기사진)
- 더보기 > 도움팁 ON/OFF 토글 (기본 ON, localStorage 저장)

### 카톡 배포용 사용 가이드
- guide.html 신규 생성 (4페이지 카드형)

## 완료된 작업 (세션 25 — 03-27, 전수검증 + 세일즈팁 삭제 + 버그수정)

### 보관함 세일즈 팁 탭 전체 삭제
- SalesFaq 컴포넌트 + 탭 정의 + 렌더링 + SmartHub 링크 버튼 삭제
- 보관함 탭: 맞춤 추천 / 저장 견적 (2개만 남음)

### SmartHub 히든젬 Math.round → Math.floor 수정
- `Math.round(p.totalMonthly/30)` → `Math.floor(p.totalMonthly/DAYS_IN_MONTH)`

### 하드코딩 색상 #00C73C → var(--color-accent) 수정 (5곳)
- 결합할인 토글, 컨설팅 버튼 등 accent 색상 통일

### 전수검증 완료
- 라이트/다크 모드 프리뷰 14개 항목 검증 통과
- 코드 정적 분석: monthly×months 0건, safeGetPricing 준수, 런타임 에러 0건

## 완료된 작업 (세션 24 — 03-27, 명세서 추가제품 + BarCompare 반값 + 전수검증)

### 카트 모드 상세 명세서 추가제품 누락 수정
- 총납입탭에서 추가한 추가제품이 요약탭 상세명세서에 표시되지 않던 버그 수정
- ccp.calculatedExtras 렌더링 블록 추가 (L2363 뒤)

### BarCompare 모달 총금액 반값할인 미반영 수정
- `totalRent = monthly × months` → `totalRent = pricing.totalRentPayable` (L10305)
- `totalDiff` 계산도 totalRent 기반으로 변경 (L10307)
- 전수조사 결과: BarCompare 1곳만 문제, 나머지 6개 비교 모달 정상

### 전수검증 (17개 항목)
- 위저드 → 장바구니 → 모든 연동 영역 프리뷰 직접 확인
- 장바구니(요약/총납입), 대시보드, 미니대시, 비교 모달 5종, 제휴카드, 핫픽, 브리핑, 즐겨찾기
- **계산 오류 0건**

## 완료된 작업 (세션 23 — 03-27, 총납입 탭 검수/수정)

### 총납입 탭 계산 오류 수정 (3건)
1. **빈 추가제품 대수 포함 버그** [심각] — 가격 0인 추가제품이 totalUnitsCount에 포함되어 할인율/반값 잘못 적용. 3곳 수정 (L4223, L4402, L4503)
2. **할인 라벨 표기** [경미] — "페스타 15%" → "패키지 15%" (L2621)
3. **finalPrice 음수 방어** [잠재] — 매트리스/프레임/추가제품 3곳에 Math.max(0, ...) 추가 (L4259, L4279, L4314)

### 20가지 케이스 검증 완료
- 프리뷰 직접 확인: 기준 케이스(59,320), 3대+정수기(95,550), 빈 폼 무시
- 수동 계산 대조: 16개 추가 케이스 (1대/2대/3~5대, 결합, 재렌탈, 엣지)
- 보고서: `REPORT_총납입탭_검수.md`

### CALC_LOGIC.md 업데이트
- 음수 방어 해결 반영, 빈 추가제품 대수 제외 규칙 추가

---

## 완료된 작업 (세션 22 — 03-27, 검수 전용)

### 워터폴 차트 계산 로직 교차 검증 — 이상 없음
- 바텀시트(L7278~7335)와 브리핑(L7505~7622) 두 곳의 lS/rS 구조 동일
- steps 배열(프레임→매트리스→탑퍼→케어) 순서·절약액 계산 공식 일치
- 차이: 브리핑에만 color 배열, msg 텍스트 추가 (UI 관련, 수치 무관)

### iOS 풀스크린 메타태그 — 코드 정상, 실기기 테스트 미완
- 메타태그 5종 정상 적용 (viewport-fit=cover, apple-mobile-web-app-capable 등)
- 헤더: padding-top: env(safe-area-inset-top) 적용
- 하단: env(safe-area-inset-bottom) 적용
- 프리뷰에서는 iOS 전용 동작 검증 불가 → 실기기 필요

### pill 롱프레스 — 코드 정상, 실기기 테스트 미완
- 500ms 롱프레스 → window.open 로직 정상
- 스크롤 보호(10px), pillClickGuard 이중 발화 방지 구현 확인
- 잠재 리스크: iOS React synthetic touchEnd에서 user activation 미인정 시 팝업 차단 가능

### 브리핑 스와이프 범위 — 정상
- 브리핑은 CSS scroll-snap 기반 (별도 스크롤 컨테이너)
- 위저드 스와이프 차단(configStep==='height' && consultStep < 6)은 메인 touchEnd에만 적용
- 브리핑 모달은 위저드 상태와 무관하게 항상 정상 동작 확인
- 프리뷰에서 슬라이드 이동 + 도트 인디케이터 정상 반응 확인

### 기준 케이스 검증 — 통과
- 퀸/5년/루네어/코지/토탈 → 59,320원 정확 일치
- 미니 대시보드: 총납입 356만, 절약 92만(21%), 하루 1,977원

### 스플래시 화면 신규
- 기존 로딩(스피너) → COWAY 로고(#45B1E8) + pulse 애니메이션 + 3-dot 로딩
- "BEREX PRICE GUIDE" 서브텍스트, 앱 로딩 완료 시 0.5초 fade-out

### PWA manifest + Service Worker
- manifest.json (display:standalone) + sw.js (최소 fetch passthrough) 추가
- Android Chrome 홈화면 추가 시 주소창 제거 대응
- iOS는 Safari 홈화면 추가만 전체화면 가능 (Chrome 미지원)

### 재렌탈 계산기 (더보기 > 새 도구)
- 환경가전 월 렌탈료 입력 → 재렌탈 할인 결과 즉시 안내
- 입력: 월렌탈료 + 약정(3/5/6/7/9년) + 대수(1/2대+) + 결합할인
- 출력: HERO 평균 월납부 + 할인% + 구간별 금액 + 3열 비교 테이블
- 독립 인라인 계산 (_getDetailedPricingByCareImpl 미호출)
- 10가지 케이스 검증 완료, 메인 앱 연관성 오류 없음

## 완료된 작업 (세션 21 — 03-27)

### 풀스크린 웹앱 모드 설정
- `viewport-fit=cover`, `apple-mobile-web-app-capable`, `mobile-web-app-capable` 메타태그 추가
- 상단 헤더 `env(safe-area-inset-top)` 패딩 적용 (노치 대응)

### 보관함 → 진단 버튼 → 컨설팅 위저드 연결
- `handleDiagnoseFromArchive` 함수: 보관함 데이터 복원 후 SurveyModal 대신 컨설팅 위저드 진입
- atomic handler로 매트리스/프레임/사이즈/약정/케어 복원

### 위저드 스텝 순서 변경
- 투/단매트리스 선택(Step 4→Step 5)을 마지막으로 이동
- 케어 설문(Step 5→Step 4)을 앞으로 이동
- 브레드크럼 pill 순서 매칭

### 위저드 스와이프 탭 전환 차단
- `consultStep < 6` 동안 좌우 스와이프로 탭 전환 방지

### 워터폴 차트 바텀시트 (FESTA BENEFIT) 신규
- 미니 대시보드 클릭 → 워터폴 차트 바텀시트 오픈
- 스텝별 누적 절약액 시각화 (프레임→매트리스→탑퍼→케어)
- 각 항목 일시불/렌탈 상세 비교 라인 표시
- 드래그 다운 닫기, 좌우 탭 제스처 전환

### 브리핑 슬라이드 워터폴 차트 교체
- 기존 막대형 차트 → 워터폴 차트로 전면 교체
- 항목별 절약 바 + 상세 내역(일시불/렌탈 비교) 통합

## 완료된 작업 (세션 19 — 03-26)

### 미사용 코드 정리
- `productLinkPopup` state + 모달 UI 제거 (세션 18 롱프레스 제거 시 잔존)
- `showLongPressGuide` state + dismiss 함수 제거

### pill 롱프레스 → 코웨이 홈페이지 열기
- touchend 기반 롱프레스 감지 (500ms, setTimeout 없음)
- 스크롤 보호 (10px 이동 시 취소), 멀티터치 무시
- pillClickGuard로 롱프레스 후 클릭 이중 발화 방지
- iOS 실기기 테스트 필요 (user activation 인정 여부)

### HERO 비교 텍스트 수정
- 이전: "재렌탈 58,090원 재렌탈 1,230원 저렴" (재렌탈 2회 표시, 혼란)
- 수정: "페스타 59,320원 재렌탈 1,230원 더 저렴" (현재 모드명 + 차액)

### 비교 카드 border-radius 확인 (수정 불필요)
- 모달 외곽 24px / 내부 카드 16px — 이미 통일, 디자인 가이드 범위 내

## 완료된 작업 (세션 18 — 03-26)

### 장바구니 옵션 불일치 안내창
- 기존 아이템과 사이즈/약정이 다를 때 "옵션이 다릅니다" 모달 표시
- "취소" / "그래도 담기" 선택 가능
- 마지막 담긴 아이템 기준 비교

### HERO 영역 제품 홈페이지 링크 버튼
- 매트리스/프레임 선택 시 MONTHLY 라벨 옆에 "루네어 ↗" "코지 ↗" 링크 표시
- `<a href target="_blank">` → 코웨이 공식 홈페이지 새 탭 이동
- stopPropagation으로 장바구니 모달 오픈 방지

### 롱프레스 코드 완전 제거
- iOS 팝업 차단 + React synthetic event 한계로 불안정
- HERO 링크 버튼으로 대체
- btn-press CSS에 user-select:none, touch-callout:none 유지

## 완료된 작업 (세션 17 — 03-26)

### 사이즈 비교 모달 0원 버그 해결
- 엘리트 선택 시 킹/라지킹/그레이트킹 카드에 0원 표시되던 버그 수정
- SIZES.map에서 `_correctMattress`/`_correctFrame` 보정 후 가격 계산
- 보정된 카드에 "○○ 기준" 안내 텍스트 표시

### 핸드오프16 기술 오류 정정
- handlePeriodChange 토스트: "미추가"로 기술되었으나 실제 이미 존재 확인
- barCompare 로컬 state: "죽은 코드"로 기술되었으나 바 차트 섹션에서 실사용 중 확인 → 제거 불가

## 완료된 작업 (세션 16 — 03-26)

### 도미노 cascade 근본 해결 — atomic state handler 도입
- `handleSizeChange`, `handlePeriodChange`, `handleMattressChange`, `handleFrameChange` 4개 함수 추가
- 내부에서 `_correctMattress`, `_correctFrame`으로 유효성 검사 후 한 번에 세팅
- 모든 비교 모달 + 메인 pill + configStep에서 handler 사용으로 교체
- 기존 useEffect는 안전망으로 유지

### barCompare 메인 state 직접 연동
- 로컬 state(`barComparePeriod/Care/Size`) → 메인 state(`activePeriod/Care/Size`) 직접 참조
- 비교 모달에서 약정/케어/제품 변경 → 메인 대시보드 실시간 반영
- M담기/F담기로 원스톱 장바구니 담기 가능

### M담기/F담기 버튼 barCompare 모달 하단 추가
- 매트리스 비교: M 담기 (sticky 하단)
- 프레임 비교: F 담기 (sticky 하단)
- 클릭 → addToCart → 모달 닫기 → 장바구니 반영

### MONTHLY 헤더 "· 콤보" 모드 표시 수정
- 매트리스+프레임 둘 다 선택 시 "· 콤보" 텍스트 누락 → 추가 완료

## 완료된 작업 (세션 15 — 03-26)

### 브리핑 전체 슬라이드 배경색 주야간 모드 연동
- 전체 배경 `#014D22` → `var(--color-background)`
- 모든 텍스트 하드코딩 → CSS 변수 (primary/secondary/tertiary)
- 인트로/비교차트/월납부내역/combined/숫자카드 전부 적용
- 라이트모드 흰배경 / 다크모드 검은배경 검증 완료

### 비교차트 막대 하단 정렬
- 일시불/렌탈 바 하단 기준선 동일하게 정렬
- 각 컬럼 `justifyContent:'flex-end'` + 실제 높이(lBarH/rBarH) 적용

### 케어 비교 모달 상세 비용 정보 추가
- 각 카드 하단에 방문관리 횟수/1회 비용, 탑퍼 교체 총비용, 세스코 비교 표시
- 방문관리 1회 20,400원 vs 세스코 72,000~82,000원 즉시 비교 가능

### 매트리스/프레임 비교 모달에 케어 선택 버튼 추가
- `renderPeriodSelector` 내 약정 버튼 아래에 케어 4종 버튼 추가
- `setActiveCare` + `setUserTouched` 호출 → 메인 대시보드 즉시 반영

### 비교 모달 카드 클릭 동작 변경
- 이전: 카드 클릭 → 선택 + 모달 닫힘
- 현재: 카드 클릭 → 선택만 적용, 모달은 X로 닫기

## 완료된 작업 (세션 14 — 03-25)

### SSoT 리팩토링 (state 잔류 버그 근본 해결)
- `getSafeCompareParams()` + `safeGetPricing()` 헬퍼 함수 추가
- 모든 비교창/브리핑이 `userTouched` 기반으로 동작
- 사이드 비교 패널, 독립 비교 모달 5종, 바 차트 비교 모달, 브리핑 FAQ 모두 적용

### "현재기준" 라벨 context 필터링
- `getCondensedOptions(context)` — 비교 유형에 따라 불필요 항목 제외
- `renderPeriodSelector(compareContext)` — 각 독립 모달에서 context 전달
- 바 차트 비교 모달에서 프레임 이름 하드코딩 제거

### 즐겨찾기 비교 기능 삭제
- UI 섹션 + compareFav state 완전 제거
- 즐겨찾기 저장/불러오기 기능은 유지

### 명세서 총납입 탭 추가
- QTABS에 `total` 탭 추가 → 추가 제품/반값할인 접근 가능

### 프레임 단독 브리핑 0원 버그 해결
- SSoT 적용으로 자동 해결 확인

---

## 백업 (이전 세션)
- `index_backup_20260321.html` — UI 개편 전 전체 백업 (롤백 가능)
- `index7.html` — 2차 개편 전 백업
- `index_backup_before_restructure.html` — 코웨이 플로우 재설계 전 백업

---

## 완료된 작업 (03-21 이전)

### 1. 디자인 시스템 교체
- CSS 변수 시스템 전면 교체 (모노크롬 + 빨강 포인트)
- 라이트모드: 순백(#FFFFFF) 배경, 검정(#111) 텍스트
- 다크모드: 딥블랙(#0A0A0A) 배경, 밝은회색(#F5F5F5) 텍스트
- 할인/절약 유일 포인트: #FF3B30 (라이트) / #FF453A (다크)

### 2. 하드코딩 색상 전수 제거
- 모든 하드코딩 색상 → CSS 변수로 전환 완료

### 3. 성능 최적화
- dvh → vh 폴백, 무한 애니메이션 → 3회 제한, prefers-reduced-motion 대응

### 4. 접근성 (WCAG AA)
- 다크모드 대비율 확보, 텍스트 가시성 개선

### 5. 타이포그래피
- Inter 폰트 추가 (숫자/영문), --font-number 변수

### 6. 코웨이 결제 플로우 하이브리드 재설계
- 장바구니 → 주문 확인 → 보관함 저장 플로우

### 7. 전체 화면 디자인 시스템 적용 (18개 화면 완료)

---

## 완료된 작업 (03-22 — 이번 세션)

### 8. 사이즈 버튼 클릭 시 화면 흔들림 수정
- **근본 원인**: cascading state update (useEffect → 연쇄 렌더링)
- **해결**: 사이즈 변경 시 매트리스/프레임 auto-selection을 같은 이벤트 핸들러에서 배치 처리
- border 1px↔2px 변화 → 고정 2px (투명 보더)
- transition: all → 개별 속성으로 분리
- 브라우저 포커스 아웃라인 제거 (outline: none, -webkit-tap-highlight-color)

### 9. 높이 탭 전면 리디자인
- **아이콘 변경**: move → ruler (높이 직관성)
- **침대 다이어그램**: 매트리스+프레임 적층 시각화 (높이별 비례 표현)
- **판정 메시지 제거**: sticky 헤더와 중복되는 판정 박스 삭제
- **매트리스별 높이 비교 추가**: 프레임별만 있던 것에 매트리스별 비교 목록 추가
- **짧은다리 반영**: shortLeg 상태가 매트리스 비교 목록에도 반영되도록 수정
- **프레임 높이 표기**: 프레임별 비교에서 프레임 자체 높이도 함께 표시

### 10. 프레임 분류 시스템
- **3가지 타입 분류**: 투매트리스(290mm) / 단매트리스(195mm) / 수납형(248mm→단매트리스에 포함)
- 각 프레임 데이터에 `type` 속성 추가: '투매트리스' / '단매트리스' / '저상형'
- 높이 탭에 투매트리스/단매트리스 선택 UI 추가
- 단매트리스 선택 시 기본 프레임을 마이프레임 사이드형으로 자동 변경

### 11. 컨설팅 위저드 (핵심 신규 기능)
- **목적**: 영업 현장에서 고객 맞춤 컨설팅을 단계별 루틴으로 제공
- **구조**: 5단계 스텝 위저드

#### Step 1: 해당 항목 체크리스트 (멀티셀렉트)
- 기존 "누가 사용하나요?" 카테고리 분류 폐지 → 조건 체크리스트로 변경
- □ 관절·척추 불편 (디스크·협착증·무릎)
- □ 아이 사용 (영유아~초등)
- □ 반려동물 (강아지·고양이)
- □ 환경성질환 (비염·아토피·천식)
- □ 해당 없음
- "해당 없음" 선택 시 다른 조건 모두 해제
- 각 조건의 높이 보정값이 독립적으로 합산됨

#### Step 2: 반려동물 상세 (Step 1에서 반려동물 체크 시만)
- 노견/관절 약한 반려동물인가요? → 예/아니오
- 청소 환경: 로봇청소기(밑 20cm) / 직접 청소(밑 10cm) / 최대한 낮게(저상 7cm)

#### Step 3: 현재 침대 높이
- 직접 입력 (숫자 input, onBlur 검증)
- "없어요/처음이에요" 스킵 옵션

#### Step 4: 높이 선호
- 좀 낮았으면 / 지금 딱 좋아요 / 좀 높았으면

#### Step 5: 프레임 타입
- 투매트리스 (숙면·편안함, 80% 추천) / 단매트리스 (지지력·안정감)
- 반려동물 노견 선택 시 → 단매트리스 기본 추천
- 조건별 안내 메시지 자동 표시

#### Step 결과: BEST PICK
- 모든 조건의 교집합으로 최적 매트리스 자동 추천
- 추천 케어 타입 함께 표시
- 추천 태그 표시 (관절 지지력, 위생(세탁), 살균 관리 등)

### 12. 추천 조합 모드
- 높이 비교에 **추천 ON/OFF** 토글 추가
- 추천 ON: 매트리스×프레임 조합을 한눈에 표시 + ✓/△/✗ 판정
- 추천 OFF: 기존 매트리스별/프레임별 개별 목록
- 추천 OFF 시 필터링 판정(✓/△/✗) 제거

### 13. 즐겨찾기 태그 시스템
- 즐겨찾기 저장 시 태그 선택 가능 (관절/아이/반려동물/환경질환)
- 컨설팅 결과와 태그 매칭 → MY PICK으로 노출
- 태그 토글 UI (멀티셀렉트)

### 14. 불필요 기능 삭제
- **세부 설정 영역 제거**: 고객 키(150~180cm) + 현재 침대(35~65cm 버튼) → 컨설팅 위저드가 대체
- **짧은다리 토글 카드 삭제**: 파운데이션 29→20cm 토글 → 컨설팅 위저드 청소환경 Step에서 자동 처리
- **저상형 토글 카드 삭제**: 마이프레임 20→7cm 토글 → 컨설팅 위저드에서 자동 처리
- gradeTip "짧은 다리로 변경하면..." 안내 제거

### 15. 제품 홈페이지 링크
- 매트리스/프레임 비교 목록에서 제품 꾸욱 누르기(long press) → 코웨이 홈페이지 링크 오픈
- PRODUCT_URLS 객체에 전체 매트리스 제품 URL 정의

---

## 완료된 작업 (03-23 — 세션 2)

### 16. 페스타/재렌탈 모드 전환
- **헤더 탭 교체**: [페스타/매트리스/프레임] → [페스타/재렌탈]
- **promoMode state** 추가 ('festa' | 'rerental')
- **viewMode** → 'combo' 상수 고정 (80+ 참조 안전 유지)
- **재렌탈 할인 계산 구현**:
  - 1개(기존제품 없음): 1~12개월 20%, 이후 10%
  - 1개(기존제품 있음): 1~12개월 20%, 이후 13% (10%+결합3%)
  - 2개+: 1~12개월 20%, 이후 16% (10%+동시3%+결합3%)
  - 반값: 없음
- **UI 라벨 동적 전환**: "페스타 15% 한정할인" ↔ "재렌탈 할인"
- **프로그레스 바**: 페스타(5단계) ↔ 재렌탈(2단계) 전환
- **HERO 카드 모드 뱃지**: "MONTHLY 페스타" ↔ "MONTHLY 재렌탈"
- **캐시키에 promoMode 포함**: 모드 전환 시 즉시 재계산
- 검증: 페스타 59,320원 / 재렌탈 58,090원 (퀸/5년/루네어/코지/토탈)

### 17. 장바구니 프로세스 개선
- **초기 상태**: mattressQty=0, frameQty=0 (빈 장바구니)
- **선택 = 미리보기**: 매트리스/프레임 클릭은 qty 변경 없음
- **자동 장바구니 전환**: 모든 옵션(사이즈+매트리스+기간+케어) 완료 시
  - 띠링! 효과음 + qty 자동 설정 + 장바구니 자동 열림
- **on 조건 수정**: `activeMattress===k && userTouched.mattress` (기본값 클릭 시 빈 장바구니 열리는 버그 수정)
- **"장바구니 담기" 버튼 제거**: 자동 전환되므로 불필요

### 18. 옵션변경 기능
- 장바구니(QuoteModal) 내 매트리스/프레임 카드에 "옵션변경" 버튼 추가
- 클릭 시 장바구니 닫히고 해당 configStep 탭으로 이동
- onMattressChange/onFrameChange 이중 모드: 인자 있으면 제품 변경, 없으면 탭 이동

### 19. configStep 탭 아이콘 개선
- 활성 탭: 녹색(#34C759) 원본 아이콘
- 완료 탭: 녹색 체크 아이콘 (check-circle) + 연한 녹색 라벨
- 미선택 탭: 회색 아이콘

### 20. 기타 수정
- 마이프레임 저상형: 10cm → 7cm (fH:bH-100 → fH:bH-130)
- 투매트리스/단매트리스 선택 버튼 시각적 구분 강화 (반전 색상)
- heightPref='lower' 시 단매트리스 기본 추천
- 브라우저 포커스 아웃라인 제거

---

## 완료된 작업 (03-23 — 세션 3)

### 21. 장바구니 배열 리팩토링 (대규모)
- **이전**: activeMattress 1개 + activeFrame 1개 (최대 2개, 콤보 고정)
- **이후**: `cartItems[]` 배열 기반, 매트리스/프레임 **완전 개별** 추가/삭제
- **cartItem shape**: `{ id, type:'mattress'|'frame', productKey, size, period, care, qty, promoMode, isCrossDiscount }`
- **헬퍼 함수**: addToCart, addComboToCart, removeFromCart, updateCartItem, editCartItem, clearCart
- **가격 엔진**: `overrideTotalUnits` 파라미터 추가 → 장바구니 전체 수량 기반 할인 티어 계산
- **calculateCartPricing**: 장바구니 아이템별 개별 가격 계산 + 전체 합산
- **cartCalculatedPrices useMemo**: 장바구니 합산 가격 자동 갱신
- **수동 버튼 방식**: gaugeComplete 시 자동 열림 제거 → "매트리스 담기" / "프레임 담기" 버튼
- **QuoteModal**: cartItems.map() 기반 렌더링, 개별 카드(M/F 뱃지, 가격, 할인, 수량스테퍼, 옵션변경, 삭제)
- **HERO 대시보드**: 장바구니 합산 가격 표시 + "장바구니 N" 빨간 뱃지
- **하단 네비**: 장바구니 아이콘 + 빨간 수량 뱃지
- **즐겨찾기/보관함**: cartItems 저장/로드 + 기존 형식 하위 호환
- **검증**: 퀸/5년/루네어/코지/토탈 59,320원 ✓, 3대 합산 94,080원 + 15%+3개월 반값 ✓
- **백업**: index51.html

### 22. 디자인 가이드 전면 적용
- **하드코딩 색상 제거**: #34C759 → var(--color-step-done), #FF3B30 → var(--color-discount)
- **CSS 변수 추가**: --color-step-done (라이트: #34C759, 다크: #30D158)
- **장바구니 카드 디자인**: border-radius 16px, pill 버튼, 디자인 가이드 준수

---

## 완료된 작업 (03-23 — 세션 4)

### 23. 장바구니 UX 전면 수정 (8개 핵심 버그)
- **P1**: editCartItem → 수정 모드 (editingCartItemId) — 아이템 제거 안 함
- **P2**: addMoreProducts → userTouched 유지 (gaugeComplete만 리셋)
- **P3**: discItems 장바구니 모드 대응 (ccp 기반 할인 내역)
- **P4+P8**: HERO 에디터 프리뷰 유지 + 장바구니 미니 배너
- **P5**: 하단 sticky bar 4가지 상태 (수정모드/빈장바구니/장바구니있음/미완료+장바구니)
- **P6**: addComboToCart ID 충돌 수정 (Math.random)
- **백업**: index52.html

### 24. 하단 네비 개편
- FAQ → 더보기 메뉴로 이동
- 글자크기(T) 탭 추가 (하단 네비 중앙, 슬라이더 토글)
- 더보기에서 침대 높이 맞춤 진단 + 결합할인 계산기 삭제
- 더보기에서 글씨 크기 삭제 (하단바에 이미 있음)
- 최종 더보기: FAQ 치트키 / 핫픽 추천 / 제품 이미지 창고

### 25. 선택 상태 시각 표시 일괄 수정
- **사이즈**: `isActive`→`on` (userTouched.size 필수) — 초기 퀸 미선택 표시
- **약정**: `activePeriod===p`→`pOn` (userTouched.period 필수)
- **케어**: `activeCare===opt.id`→`on && userTouched.care`
- 선택 색상: #00C73C (녹색) 통일
- gaugeComplete useEffect 의존성에 `gaugeComplete` 추가

### 26. 핫픽 추천 전면 수정 (5개 버그)
- 약정 카드 클릭 → hotPickConfirm.best 실시간 업데이트
- confirmHotPick → userTouched period+care 추가
- Main App 약정 카드 → userTouched 동기화
- 제품/카드 변경 → hotPickConfirm 자동 무효화
- 12조합(케어4×약정3) 전수 테스트 통과

### 27. 장바구니 기준 연동 (핫픽+즐겨찾기)
- **핫픽**: applyHotPick → 장바구니 아이템 기준 추천 (단품이면 단품)
- **즐겨찾기**: addFavorite → 장바구니 기반 데이터 저장
- **즐겨찾기 프리뷰**: generateFavMemo → 장바구니 기반 텍스트
- **프리뷰 서브타이틀**: 장바구니 모드에서 cartItems 기반
- **총 납입 레이블**: cartItems[0].period 사용
- **헤더**: cartItems 기반 서브타이틀

### 28. 결합할인 토글
- 장바구니 메인창(QuoteModal 요약탭)에 결합할인 토글 표시 (viewMode 제한 제거)
- 핫픽 바텀시트에도 결합할인 토글 추가
- onCrossDiscountChange → cartItems isCrossDiscount 동기화
- calculateCartPricing → crossDisc 파라미터 직접 사용 (item.isCrossDiscount 대신)

---

## 완료된 작업 (03-23 — 세션 5)

### 29. 결합할인 토글 버그 수정 (2건)
- **Bug 1: 토글 OFF인데 할인 반영됨**
  - **근본 원인**: `discountRate` 계산에서 `selectedMode === 'combo'` 조건이 항상 true (viewMode가 'combo' 상수 고정) → isCross 체크 도달 불가
  - **수정**: `selectedMode === 'combo' ||` 제거 → `totalUnitsCount >= 2`만 사용
  - 결과: 1대 → isCross OFF=0%, ON=5% / 2대+ → 항상 15%
- **Bug 2: 핫픽 결합할인 토글 작동 안 됨**
  - **근본 원인 1**: QuoteModal 내부에서 `setIsCrossDiscount`/`setCartItems` 직접 호출 — 이 함수들은 App state이며 QuoteModal에 props로 전달되지 않음 (undefined 참조)
  - **근본 원인 2**: setTimeout 150ms 후 applyHotPick 호출 → React state 비동기 문제
  - **수정**: `onCrossDiscountChange(next)` 사용 (props로 전달된 함수) + `applyHotPick(undefined, next)` 직접 전달 (setTimeout 제거)
- **검증**: 퀸/5년/루네어/코지/토탈 59,320원 ✓, 핫픽 토글 ON→OFF→ON 가격 변동 정상 ✓
- **백업**: index53.html

---

## 완료된 작업 (03-24 — 세션 6)

### 30. 케어옵션별 일시불 라벨 분기
- 서비스프리/베이직 → "케어비용 별도"
- 스페셜체인지(`special`) → "탑퍼비용 별도"
- 토탈 → "탑퍼+케어비용 별도"
- care ID 오타 수정: `specialChange` → `special`

### 31. "원원" 중복 전수 수정 (11건)
- `formatPrice()`가 이미 "원" 포함 → 뒤에 붙은 중복 "원" 모두 제거
- 비교 모달, 카드 섹션, 견적서 전체 해당

### 32. 대시보드 "투자 약N분" 칸 추가
- 하루 렌탈료 / 10,030원(2026 최저시급) × 60 = 근무 분
- 원페이지 하단 요약바 + 장바구니 대시보드 양쪽 적용

### 33. 장바구니 삭제 후 초기화
- `removeFromCart`: 마지막 아이템 삭제 시 `isQuoteOpen=false` + `resetSelections()`
- `clearCart`: 동일 처리
- `resetSelections()`: userTouched 리셋, gaugeComplete=false, qty=0

### 34. 컨설팅 위저드 케어 자동추천
- 환경질환/반려동물/아이 중 1개라도 → **토탈** 자동설정
- 온열기구만 → **스페셜체인지** 자동설정
- 관절만/없음 → 서비스프리 유지
- Step 1 "다음" 버튼 클릭 시 `setActiveCare()` 호출

### 35. BEST PICK 활성화 + 추천 범위 확대
- `{false && ...}` 제거 → 조건 기반 추천 카드 활성화
- 관절: 전체(10개), 반려동물: 4개(기존2), 아이: 4개(기존2), 환경질환: 전체
- 케어 텍스트: 자동설정된 activeCare 연동

### 36. Survey 설문 전면 개편 (6문항)
- 기존 4문항(yn) → 6문항(choice/multi/yn 혼합)
- Q1: 매트리스 사용기간 (1~3/4~6/7~9/10+)
- Q2: 만족도 (5단계)
- Q3: 아토피/비염 해당자 (multi: 본인/배우자/아이/해당없음)
- Q4: 수면 중 발한 (3단계)
- Q5: 함께 사용하는 사람 (multi: 혼자/배우자/자녀/반려동물)
- Q6: 관절 불편함 (yn)
- multi 타입 UI: 토글 선택 + "다음" 버튼
- 2열 그리드: 옵션 라벨 8자 이하 + 3개 이상일 때 자동 적용
- 케어 자동추천: 반려동물/아토피/자녀→토탈, 7년+사용→스페셜, 땀많음→루네어

### 37. 반려동물 저상형 추천 통합
- 건강/노견 무관 모두 저상형 프레임 추천
- Step 4 기본값: 반려동물 조건 시 단매트리스

### 38. 위저드 장바구니 담기 버튼
- Step 5 하단: [닫기] [담기] 버튼
- gaugeComplete=false 상태에서도 위저드 완료 시 자동 설정 후 addComboToCart
- height탭 + consultStep≥5일 때 우선 표시

### 39. 브리핑(FAQ치트키) 접근성 개선
- "진단 다시하기" 옆에 "⚡ 브리핑" 버튼 추가 (항상 표시)
- 더보기 메뉴의 "FAQ 치트키" → "브리핑" 이름 변경

### 40. 진단결과 다시보기
- 리포트 창 하단에 "👁 진단결과 다시보기" 버튼 추가
- 클릭 → consultStep=5, configStep='height' → Step 5 전체 결과 화면 바로 열림

### 41. JSX 구문 에러 수정
- 설문 UI 2열 그리드 교체 시 여분의 `</div>` 태그 → 앱 로딩 실패
- Babel transform 에러 확인 후 여분 태그 제거

### 백업: index53.html

---

## 완료된 작업 (03-24 — 세션 7)

### 42. 핫픽 바텀시트 약정/케어 변경 → 장바구니 동기화
- **근본 원인**: 바텀시트에서 약정 카드 클릭 시 `onPeriodChange`만 호출 → `activePeriod` state만 변경, `cartItems[].period`는 미반영
- **수정**: 약정 변경 시 `cartItems.forEach(ci => updateCartItem(ci.id, { period: r.period }))` 추가
- **수정**: 케어 변경 시 `cartItems.filter(ci => ci.type === 'mattress').forEach(ci => updateCartItem(ci.id, { care: c.id }))` 추가
- 검증: 핫픽에서 7년 선택 → 장바구니 카드 "퀸·7년·토탈" 즉시 반영 ✓

### 43. 핫픽 vs 장바구니 가격 4,000원 차이 해결
- **근본 원인**: `applyHotPick`이 `totalWithCard`(카드 할인 포함) 표시, `calculateCartPricing`은 카드 할인 미포함
- **수정**: 핫픽 총액을 `totalRentPayable` 기준(카드 할인 전)으로 표시, 카드 할인은 별도 줄 분리
- **수정**: 약정 카드 비교도 `totalRentPayable` 기준 통일, `cardDiscount` 별도 저장
- 검증: 핫픽 3,911,880원 = 장바구니 3,911,880원 ✓

### 44. 설문 → 위저드 conditions 연동
- `applySurveyResult()`에 `setConditions()` 추가
- 매핑: discomfort→joint, withWhom:child→child, withWhom:pet→pet, allergy→envHealth

### 45. 비교창 다크모드 디자인 가이드 전수조사 + 수정
- CareCompare: `#191919` → `var(--color-text-primary)`, `rgba(0,0,0,0.1)` → `var(--color-accent-soft)` (2건)
- 결합할인 UI: `#191919` × 5건 + `#F5F5F5` → CSS 변수 전환
- 핫픽 결과 배너: `#E5E5E5`, `#F8F8F8`, `#fff`, `#555555` → CSS 변수 전환

### 46. 모바일 최적화
- 미니대시 4분할 패딩: 28px → 16px, 구분선 마진: 12px → 6px
- 폰트 clamp: 4vw → 3.8vw
- 375px에서 "92만 (21%)" 완전 표시 확인

### 47. QA 점검 — P1 계산 로직 안전성 강화 (6건)
- `formatPrice()` NaN 방어: `isNaN(v) ? 0 : v` 가드
- 주문확인 화면 `cp`/`ccp` null 참조: `?.` + `?? 0` 폴백
- `calculateCartPricing`: productKey 없는 제품 → null 반환 + `.filter(Boolean)`
- `_getDetailedPricingByCareImpl`: rentalData 빈 객체/키 없음 안전화
- `extras.reduce()`: `(extras || [])` + `(p.qty || 0)` 방어
- PRODUCT_DATA items 접근: `?.items?.find()` 이중 옵셔널 체이닝

### 48. QA 점검 — 하드코딩 색상 CSS 변수 전환 (~25건)
- `#FFFFFF` → `var(--color-on-primary)`: accent 배경 위 텍스트 ~10건
- `#333333` → `var(--color-text-primary)`: 안전가이드 2건
- `#555555` → `var(--color-text-secondary)`: 안전가이드/체크박스/카드 6건
- `#888888` → `var(--color-text-tertiary)`: 아이콘 1건
- `#F5F5F5`/`#F8F8F8` → `var(--color-surface)`: 큐레이션 배경 3건
- `#FF3B30` → `var(--color-discount)`: 안전가이드 경고색 3건

### 백업: index54.html (세션 시작), index55.html (QA 전)

---

## 완료된 작업 (03-24 — 세션 8)

### 49. useMemo stale closure 수정 (3건)
- `getPriceReversal`, `getSingleReversal`, `getRealReversal` — 의존성 `[]` → `[promoMode]`
- 페스타↔재렌탈 전환 시 가격역전 데이터가 올바르게 재계산됨

### 50. startSurvey() UI 버튼 연결
- 더보기 메뉴에 "맞춤 케어 진단 — 6문항 설문 · 케어 자동 추천" 버튼 추가
- 클릭 → `startSurvey()` 호출 → 설문 모달 열림

### 51. 하드코딩 색상 CSS 변수 전환 (~20건)
- `#fff`/`#FFFFFF` → `var(--color-on-primary)`: accent 배경 위 텍스트 (6건)
- `#fff` → `var(--color-text-on-dark)`: 항상-어두운 배경 (가격탐색기, 비교차트, FAQ차트 등 11건)
- `#FFFFFF` → `var(--color-accent)`: 카드 보유 체크박스 border/bg (3건)
- `#FFFFFF` → `var(--color-on-primary)`: tierSel 카드 할인 금액 (1건)

### 52. 설문 필터링 — 추천 제품 표시
- 설문 결과 시 매트리스/프레임/케어 pill에 ⭐ 마크 표시
- 담기 버튼 위에 "설문 추천: [매트리스] + [프레임] · [케어]" 안내 배너 추가 (✕ 닫기 가능)

### 백업: index55.html (세션 시작), index56.html (세션 완료)

---

## 완료된 작업 (03-24 — 세션 9)

### 53. 계산 로직 전수 감사 (5단계 검증)
- 계산이 일어나는 모든 함수/경로/상태 흐름 전수 파악
- 핵심 계산 함수 3개: `_getDetailedPricingByCareImpl` (L4056), `calculatedPrices` useMemo (L4174), `calculateCartPricing` (L4240)
- 가격 표시 경로 6개: 메인 HERO, 장바구니 미니배너, 장바구니 모달, FAQ 모달, 핫픽 추천, 비교 모달
- 7건의 불일치 발견 → 6건 수정, 1건 미수정(사용자 승인 필요)

### 54. BUG-A 수정: calculateCartPricing extras 이중계산 (심각)
- **근본 원인**: `grandTotalMonthly`에 extras 월납이 포함된 채 `grandContractMonths`를 곱하고, 별도로 `extrasEpTotal`을 또 더함 → extras 총납입이 2번 합산
- **수정**: `bedOnlyMonthly`와 `extrasRentPayable`를 분리하여 `grandTotalRentPayable = bedRentPayable + extrasRentPayable`

### 55. BUG-B 수정: 장바구니 모드에서 cp.calculatedExtras 잘못된 소스 참조
- **근본 원인**: 약정이 다른 추가제품 표시 시 장바구니 모드에서도 `cp.calculatedExtras` (에디터 기준) 사용
- **수정**: `(_useCart ? ccp.calculatedExtras : cp.calculatedExtras)` 분기 처리

### 56. BUG-C 수정: 자동이체 할인 표시 오류
- **근본 원인**: `1000 * ((cp.mQty > 0 ? 1 : 0) + (cp.fQty > 0 ? 1 : 0))` — 수량이 아닌 제품 유무로 계산
- **수정**: `1000 * ((cp.mQty || 0) + (cp.fQty || 0))` — qty 기준으로 변경

### 57. BUG-D 수정: dailyPrice 반올림 불일치 (6건)
- **근본 원인**: 일부 화면은 `Math.floor`, 일부는 `Math.round` 사용 → 하루 금액 1원 차이
- **수정**: FAQ 섹션, FAQ 모달, PADE 스크립트 4건 — 모두 `Math.floor`로 통일

### 58. BUG-F 수정: 하드코딩 30 → DAYS_IN_MONTH 변수 통일
- `calculateCartPricing`의 `dailyPrice` 계산에서 하드코딩 `30` → `DAYS_IN_MONTH` 상수 사용

### 59. BUG-G 수정: FAQ 모달 카드할인 월평균 → 실제 cardDiscount 통일
- **근본 원인**: FAQ 모달에서 `cardMD = Math.round(calcCardTotalDiscount / months)` (총할인 평균) → 7년/9년 약정 시 실제 `cardDiscount`와 불일치
- **수정**: `cardMD = cardDiscount` (실제 월 할인 prop 직접 사용)

### 백업: index57.html (세션 시작)

---

## 완료된 작업 (03-24 — 세션 10)

### 60. Festa Benefit 문구 리뉴얼
- 상단 타이틀: "지금이 아니면 만날 수 없는 가격." → "오직 지금만 가능한, 가장 합리적인 선택"
- 화면1~4 msg 전부 교체 (저렴 → 가볍게/세이브/실속/합리적)
- 하단 서브: "옵션은 부담스럽나요?" → "옵션 추가가 망설여지시나요?"
- 백업: index58.html

### 61. 케어옵션별 동적 steps 구현
- 4단계 하드코딩 → `hasCareTP`/`hasCareBV` 기반 2~4단계 동적 생성
- 서비스프리 2단계 / 스페셜·베이직 3단계 / 토탈 4단계
- `_clampedStep` 으로 케어 전환 시 오버플로우 방지
- 백업: index59.html

### 62. 렌탈이 더 비싼 경우 처리
- saving 음수 시 "렌탈이 X원 더 높지만…" 분기 + % 빨간색 UP 표시
- 백업: index60.html

### 63. 모바일 UI 최적화
- msg/바/하단 폰트·간격 전체 축소 (375px 대응)
- 백업: index61.html

### 64. 정보 밀도 개선
- "오직 지금만 가능한…" → step 0에서만 노출, 하단 서브 블록 제거
- 백업: index62.html

### 65. 장바구니 하단 버튼 변경
- 주문하기(빨간) 삭제 → 보관함 | 즐찾 | 브리핑 (3버튼)
- QuoteModal에 `setIsFaqOpen`, `setFaqChartStep`, `setIsFavListOpen` props 전달
- SafeArea 대응, 모바일 잘림 방지
- 백업: index63.html, index64.html

### 검증: 퀸/5년/루네어/코지/토탈 → 59,320원/월 ✓

---

## 완료된 작업 (03-24 — 세션 11)

### 66. 전체 기능 QA 테스트 (코드 수정 없음)
- 프리뷰 서버 실행, 모바일(375×812)에서 직접 버튼 클릭 전수 테스트
- **메인 화면 옵션 선택**: 사이즈/약정/매트리스/프레임/케어 전체 ✓
- **즐겨찾기 저장→불러오기**: ☆→모달→저장(5→6)→⭐ 표시→다른 옵션에서 복원 ✓
- **즐겨찾기 버튼별 동작**: 수정/상세/불러오기/업데이트/삭제 전체 ✓
- **계산값 일관성**: 메인(59,320)=장바구니(59,320)=M+F합계(34,760+24,560) ✓
- **장바구니 스크롤/잘림**: 상단~하단 정상, 3버튼 잘림 없음 ✓
- **FAQ/브리핑**: 11개 슬라이드, FESTA BENEFIT 4단계 프로그레스바 ✓
- **다크/라이트 모드**: 전환 정상, 가독성 양호 ✓
- **발견된 버그**: 없음

### 검증: 퀸/5년/루네어/코지/토탈 → 59,320원/월 ✓

### 67. 비교창 다크모드 가독성 수정 (3건)
- **`.tag-yellow` 클래스**: `background: --color-kakao-yellow` + `color: --color-primary` → `--color-accent` + `--color-on-primary`
  - 다크모드에서 흰배경+흰텍스트 → 안 보이는 문제 해결
  - 영향: 케어비교/사이즈비교/약정비교의 "현재기준" 태그, "실전 상담 TALK" 태그
- **`renderPeriodSelector` 약정 버튼**: 선택 상태 `--color-primary` → `--color-accent`
  - BarCompare(매트리스/프레임 비교)와 스타일 통일
- **케어비교 "현재선택" 태그**: `--color-primary` → `--color-accent`
- 백업: index65.html

### 검증: 퀸/5년/루네어/코지/토탈 → 59,320원/월 ✓ (계산 함수 미변경)

---

## 완료된 작업 (03-25 — 세션 13)

### 68. 색상 시스템 전면 교체: 모노크롬 → 네이버페이 그린
- 메인 accent: `#000000` → `#03C75A` (네이버페이 그린)
- 모든 버튼/칩/선택상태/활성탭 초록 통일
- 할인 빨강 `#FF3B30` 유지
- Surface/Border도 연한 초록 계열로 변경
- 다크모드: Accent Light `rgba(3,199,90,0.15)`

### 69. UI 가독성 개선 (WCAG AA)
- 렌탈 vs 일시불 카드: 연한 초록 배경 → 흰색 (대비 확보)
- 하단 탭바: 선택 아이콘/텍스트 → `var(--color-accent)` 초록
- BEST PICK 카드: 밝은 초록 배경 위 흰 텍스트 → `#111111` 검정 (대비율 2.8→7.5:1)
- 컨설팅 위저드 선택 카드: 검정 배경 → 초록 배경 + 검정 텍스트

### 70. FAQ 브리핑 슬라이드 초록 계열 적용
- 비교 차트 렌탈 바: 회색 → `#03C75A` 초록
- 숫자 카드 배경: 검정 → 진한 초록(`#014D22`)
- 아이콘 슬라이드: 초록 컬러

### 71. 맞춤 케어 진단 → 컨설팅 위저드 통합
- 하단바 별도 메뉴 제거
- 위저드 설문 마지막 단계에 케어 진단 5문항 통합
- 장바구니 계산 로직 충돌 해결

### 72. 컨설팅 리포트에 케어 설문 답변 표시
- `summaryItems`에 `surveyAnswers` 5개 답변 조건부 추가
- 매트리스 사용기간, 만족도, 아토피·비염, 수면 중 땀, 함께 사용

### 73. 반값할인 2대 세트 롤백
- 2대에 반값 적용 시도 → 원래 설계대로 롤백 (2대+=반값 없음)

### 74. 브리핑 비교차트 데이터 소스 분석
- 일시불: 정가(lM2+lF2) + 세스코(cescoT2) + 탑퍼(tpLump2)
- 렌탈: mFinal×개월(mRent2) + fFinal×개월(fRent2) — 반값/카드 미포함
- % DOWN = (일시불-렌탈)/일시불×100
- 사용자 결정 대기: 반값/카드 차트 반영 여부

### 검증: 퀸/5년/루네어/코지/토탈 → 59,320원/월 ✓
### 백업: index70.html (세션 13 완료)

---

## 미해결 / 다음 세션에서 진행

### BUG-E: ccp.totalSaving 케어비용 미포함 (미수정 — 승인 필요)
- `calculatedPrices.realSavings` = (일시불 + 케어비용) - 총납입
- `cartCalculatedPrices.totalSaving` = 일시불가만 - 총납입
- 수정하려면 calculateCartPricing에서 각 cart item의 케어별 directCareCost 계산 필요

### 제품 이미지 갤러리
- 인프라만 구현(IndexedDB), UI 미완성

### 잔여 하드코딩 색상 (의도적 유지)
- 녹색(#00C73C) 배경 위 `#FFFFFF`: 다크모드에서도 흰 글자 필수 → 유지
- 카드 브랜드 색상(CARD_PROMO_DATA): 예외 허용 → 유지
- `{false && ...}` 비활성 코드 블록: 실행 안 됨 → 무시
- 토글 스위치 knob `#fff`: 물리적 흰색 원 → 유지
- 항상-어두운 모달 배경(`#1E1E1E`, `#0F0F0F`): 의도적 → 유지

---

## 현재 적용된 디자인 원칙

### 3초 룰
고객이 화면을 보고 3초 안에 핵심 숫자(월 납부액, 할인)를 파악할 수 있어야 함

### 정보 계층
1. **핵심** — 월 납부액 (가장 크고 얇은 숫자, 중앙)
2. **상세** — 총납입/절약/하루 (3분할 요약)
3. **부가** — 할인 내역, 상세 항목 (작은 텍스트)

### 네이버페이 그린 컬러 원칙 (세션 13 변경)
- 메인 accent: `#03C75A` (네이버페이 그린)
- 할인 포인트: `#FF3B30` (빨강 유지)
- 밝은 초록 배경 위: `#111111` 검정 텍스트 (WCAG AA)
- 진한 초록/검정 배경 위: `#FFFFFF` 흰색
- 카드사 브랜드 색상만 예외 허용

### 타이포 원칙
- 금액: 얇고 크게 (font-weight 200~300)
- 라벨: 작고 가볍게 (11px, weight 400)
- 숫자: Inter/SF Pro (--font-number)

### 여백 원칙
- 섹션 간: 40px, 항목 간: 16px, 내부 패딩: 28px

---

## 핵심 기획 결정사항 (새 대화에서 참고)

### 컨설팅 위저드 설계 철학
1. **카테고리 분류 폐지** — "아이/일반/관절케어"로 사람을 분류하지 않음. 조건 체크리스트로 변경 (멀티셀렉트)
2. **조건 독립 합산** — 관절+아이+반려동물 동시 해당 가능, 각 보정값 독립 합산
3. **BEST PICK = 교집합** — 모든 선택 조건의 교집합으로 최적 제품 추천
4. **반려동물 중요** — 노견 슬개골, 세탁 가능 커버(엘리트), 탑퍼 교체(더블체인지), 로봇청소기 밑 높이
5. **환경성질환** — 비염/아토피/천식 → 베이직/토탈케어 추천 (4개월 방문 살균)
6. **프레임 80% 투매트리스** — 영업 현실 반영, 투매트리스 기본 추천
7. **파운데이션 중심 영업** — 저렴 + 높이 조절 가능 = 핵심 판매 제품

### 추천 매트리스 매핑
- 관절·척추: 엘리트(단단함), 하이브리드4(7존스프링), 루네어(7존스프링), 모디(컨투어7존폼)
- 아이: 엘리트(세탁커버), 더블체인지(탑퍼교체)
- 반려동물: 엘리트(세탁커버), 더블체인지(탑퍼교체)
- 환경성질환: 케어 추천만 (베이직/토탈/스페셜체인지)

### 추천 케어 매핑
- 관절·척추: 토탈
- 아이: 베이직, 토탈, 스페셜체인지
- 반려동물: 베이직, 토탈, 스페셜체인지
- 환경성질환: 베이직, 토탈, 스페셜체인지

---

## 세션 12 완료 작업 (03-25)

### 1. 다크/라이트 모드 전수 점검 + 하드코딩 색상 교체 (13건)
- CSS 애니메이션/버튼/네비 하드코딩 `#FFFFFF`, `#111111`, `#FF3B30` 등 → CSS 변수 교체
- 퀴즈 정답 색상 버그 수정 (항상-어두운 영역에서 검은 텍스트 → `var(--color-text-on-dark)`)
- Tailwind `bg-[#F5F5F5]` → `var(--color-surface)`
- 세이프티가드 `#D1FAE5` → `var(--color-safe-bg)`
- 케어/사이즈 토글 ON 텍스트 `#FFFFFF` → `var(--color-text-on-dark)` (전체 치환)
- 아이패드 바깥 배경 다크모드 대응 추가

### 2. CSS 변수 가독성 개선 (디자인 가이드 반영)
- Light: text-secondary `#555555`→`#444444`, text-tertiary `0.35`→`0.55`, text-disabled `0.30`→`0.40`
- Dark: text-secondary `0.70`→`0.85`, text-tertiary `0.45`→`0.65`, text-disabled `0.40`→`0.55`

### 3. FAQ 브리핑 UI 전면 개선
- FESTA BENEFIT 차트: 헤드라인 3줄 분리(금액 26px 강조), 바 고정 높이(320px), 바닥선 일치
- 차트 탭 방향: 좌측35%=뒤로, 우측65%=앞으로
- 가격 요약 카드: 숫자 34px→52px, 화면 균등 분배
- 단일 숫자 카드: 숫자 52px→56px, 질문 13px→16px
- 프로그레스바 3px→5px, 인디케이터 크기 증가
- 라벨 대비 개선: rgba(0.4)→rgba(0.55)

### 검증
- 기준 케이스 59,320원 일치 (계산 로직 미변경)
- 라이트/다크 모드 전환 프리뷰 확인 완료
- FAQ 브리핑 전체 슬라이드 스와이프 확인 완료

---

## 참조 파일
- `DESIGN_GUIDE.md` — 전체 디자인 시스템 정의
- `STRUCTURE.md` — 앱 구조/기술 문서
- `index_backup_20260321.html` — UI 개편 전 롤백용 백업
- `index_backup_before_restructure.html` — 코웨이 플로우 재설계 전 백업
- `index_backup_cart_migration.html` — 장바구니 방식 전환 전 백업
- `index_backup_before_cart_refactor.html` — 장바구니 배열 리팩토링 전 백업 (최신)
- `index50.html` — 최신 히스토리 백업

## 할인 계산 공식 (현재 적용 중)

### 페스타 모드
| 수량 | 할인 | 반값 |
|---|---|---|
| 1개 | 5% (기존제품 보유 토글) | 없음 |
| 2개 | 15% | 없음 |
| 3개 | 15% | 반값 3개월 |
| 4개 | 15% | 반값 4개월 |
| 5개+ | 15% | 반값 5개월 |

### 재렌탈 모드
| 조건 | 1~12개월 | 13개월~ |
|---|---|---|
| 1개 (기존제품 없음) | 20% | 10% |
| 1개 (기존제품 있음) | 20% | 13% (10%+결합3%) |
| 2개+ | 20% | 16% (10%+동시3%+결합3%) |
| 반값 | 없음 | — |
