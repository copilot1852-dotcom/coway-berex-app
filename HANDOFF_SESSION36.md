# 세션 36 핸드오프 문서

## 1. 프로젝트 개요
- **앱 이름**: 비렉스 공식 가격 가이드 v5 (코웨이 매트리스 렌탈 견적 앱)
- **기술 스택**: 단일 HTML 파일 (React 18 + Babel 인라인), PWA
- **경로**: `/Users/minmacbook/Desktop/V5 festa/index.html`
- **빌드**: `sh build.sh` → `deploy/` 폴더 (JSX→JS 사전 변환, Babel standalone 제거)
- **배포**: deploy/ → Cloudflare Pages (`https://coway-estimate.pages.dev`)

## 2. 파일 구조
```
/Users/minmacbook/Desktop/V5 festa/
├── index.html           ← 메인 소스 (~940KB)
├── index1.html          ← 세션 35 시작 백업
├── index2.html          ← 세션 36 시작 백업
├── index3.html          ← Notion 스타일 적용 전 백업
├── index4.html          ← 장바구니 담기 변경 전 백업
├── build.sh             ← 빌드 스크립트
├── deploy/              ← 빌드 결과물 (배포용)
├── data/competitorMap.json
├── serve.py / start-server.sh ← 로컬 서버 (미사용)
├── mockup-main.html     ← Notion 스타일 메인화면 시안
├── mockup-notion.html   ← Notion 스타일 슬라이드 시안
├── DESIGN_PROMPT.md     ← 디자인 변환 지시어 (다른 프로젝트 전달용)
├── CALC_LOGIC.md        ← 계산 로직 명세서 ★ 필독
├── DEV_RULES.md         ← 개발 규칙 ★ 필독
├── DESIGN_GUIDE.md      ← 디자인 가이드 (Notion 스타일로 전면 교체)
├── STRUCTURE.md         ← 앱 구조도
├── PROGRESS.md          ← 작업 히스토리
└── HANDOFF_SESSION36.md ← 이 문서
```

## 3. 세션 36 완료된 작업

### 3-1. "방문관리 페스타 할인" 임의 생성 항목 삭제
- `_dCareDiscM`, `_dCareDiscTotal` 변수 삭제
- `steps.push`에서 `careDiscM`, `careDiscTotal` 필드 제거
- 렌더링 블록에서 "방문관리 페스타 할인" 행 삭제
- 총 할인 합산에서 `(cur.careDiscTotal||0)` 제거
- 잔류 참조 0건 확인
- 정합성 검증: 삭제 후에도 세그먼트 합 - 할인 합 = donutTotal 정상 일치

### 3-2. 도넛 슬라이드 — 제품 요약 라인 추가
- 도넛 차트 아래에 `모디 + 코지 · 퀸 · 5년 · 토탈 · 2대` 형식 표시
- `careName`, `totalUnits` 필드를 steps.push에 추가
- 1대일 때 대수 생략

### 3-3. Notion 디자인 스타일 전면 적용
- **Light Mode 색상**: #03C75A(초록) → #2eaadc(Notion 블루), 텍스트 #111→#37352f, 보더 #D9EFE3→#e9e9e7 등
- **Dark Mode 색상**: #0A0A0A→#191919, #161616→#202020 등
- **Border-radius**: 100px/16px/12px → 4px 일괄 변경 (CSS 클래스 + inline 438개소)
- **Box-shadow**: 제거 (hard-shadow, hard-shadow-sm → none)
- **하드코딩 색상**: #03C75A 6개소 → #2eaadc 변경, GREEN_STEPS 배열 변경
- DESIGN_GUIDE.md 전면 교체 (Notion 스타일 기준)
- 목업 파일 생성: mockup-main.html, mockup-notion.html
- DESIGN_PROMPT.md 생성 (다른 프로젝트 전달용 지시어)

### 3-4. 4월 카드 할인 데이터 업데이트
- **현대 M3**: promo 15,000/20,000 → 10,000/10,000, period 6 → 36개월
- **우리 II**: base 10,000/15,000/20,000 → 13,000/17,000/23,000, promo 12,000/9,000/6,000 → 9,000/7,000/7,000, tier 70만/120만 → 80만/150만
- **KB국민 II**: promo 6,000 → 10,000, period 60 → 36개월
- 신한/NH/하나/LOCA: 이미 최신 (tier 구간만 변경됨)
- 삼성/IBK: 변경 없음
- CALC_LOGIC.md 카드 데이터 테이블 업데이트

### 3-5. M담기/F담기 → 장바구니 담기 통합
- 2개 버튼 → 1개 버튼으로 통합
- 버튼 텍스트 동적 변경: 매트리스만 → "매트리스 담기", 프레임만 → "프레임 담기", 둘 다 → "세트 담기", 미선택 → "장바구니 담기"
- `addComboToCart()` 활용 (userTouched 기반 자동 판별)
- 미선택 시 토스트 안내

### 3-6. BENEFIT → 혜택보기 변경
- 메인 화면 버튼, 장바구니 내부 버튼, 더보기 메뉴 3곳 변경
- 워터폴 모달 타이틀("FESTA BENEFIT")은 유지

### 3-7. 짧은다리/높이 표시 버그 수정
- 높이 섹션: 프레임 미선택 시 짧은다리 계산 건너뛰기 (`_hasF` 체크 추가)
- 도넛 슬라이드: 프레임 미선택 시 "엘리트 26cm + 29cm" → "엘리트 26cm" 표시

### 3-8. 서비스프리 표기 통일
- CARE_OPTIONS name: '서프' → '서비스프리', shortName: '서프' 추가
- 메인 칩 버튼: `shortName || name` → "서프" 표시
- 다른 모든 화면: `name` → "서비스프리" 표시
- COMP_CARE_MAP: '서프' → '서비스프리'

### 3-9. 프리뷰 환경 구축
- Node.js 설치: `/tmp/node-v20.18.1-darwin-arm64/bin/node`
- Preview 도구 샌드박스 우회: deploy → `/tmp/festa-deploy/` 실제 복사 + ruby WEBrick 서버
- SW 캐시 문제 해결: `/tmp/festa-deploy/sw.js` 제거로 캐시 방지
- launch.json: ruby WEBrick 기반으로 변경

### 3-10. deploy 빌드 절차 확립
- DEV_RULES.md에 `cp 금지, build.sh 필수` 명시
- 코드 수정 후 자동으로 build.sh 실행 + deploy 업데이트
- Node.js PATH: `export PATH="/tmp/node-v20.18.1-darwin-arm64/bin:$PATH"`

## 4. 수정된 파일 목록

| 파일 | 변경 내용 |
|------|---------|
| index.html | careDisc 삭제, Notion 스타일 적용, 카드 데이터 업데이트, 장바구니 담기 통합, 혜택보기 변경, 높이 버그 수정, 서비스프리 통일 |
| DESIGN_GUIDE.md | Notion 스타일로 전면 교체 |
| CALC_LOGIC.md | 카드 데이터 테이블 업데이트 (2026-04) |
| DEV_RULES.md | deploy 빌드 절차 추가, 프리뷰 서버 설정 추가 |
| deploy/index.html | build.sh로 빌드됨 |
| .claude/launch.json | ruby WEBrick 기반으로 변경 |
| mockup-main.html | Notion 스타일 메인화면 시안 (신규) |
| mockup-notion.html | Notion 스타일 슬라이드 시안 (신규) |
| DESIGN_PROMPT.md | 디자인 변환 지시어 (신규) |

## 5. 미완성 / 남은 작업

### 모디 정상 렌탈료 불일치 (보류)
- 도넛 매트리스 세그먼트: `(mBase-aFee)*months - _careRawTotal(6,000×months)`
- 비교 바 rawVal: `(mBase-aFee)*months - careInc2(5,100×months)`
- 차이 = 900원/월 × 대수 × 개월
- 사용자에게 보고 완료, 방향 미결정

### smarts8 mSE=9000 도넛 표시 이슈 (세션 35에서 보류)

## 6. 디자인 시스템 (Notion 스타일)

### 핵심 컬러
```
브랜드: #2eaadc (Notion 블루)
할인: #eb5757 (Notion 레드)
본문: #37352f / 보조: #787774 / 라벨: #9b9a97
배경: #FFFFFF / 카드: #f7f6f3 / 테두리: #e9e9e7
다크: 배경 #191919 / 카드 #202020 / 테두리 #2f2f2f
```

### 형태
```
border-radius: 4px (모든 카드/버튼/칩)
box-shadow: none
구분: 1px solid var(--color-border)
pill 형태 금지, 라운드 카드 금지
```

## 7. 주의사항

### 절대 금지
- 가격/할인 항목 임의 생성
- `cp index.html deploy/index.html` (반드시 build.sh 사용)
- 계산 엔진 함수 임의 수정
- #03C75A(구 초록) 사용
- pill(100px), 라운드(10px+), 그림자 사용

### 필수 절차
- 4개 파일 필독: DEV_RULES.md + CALC_LOGIC.md + STRUCTURE.md + DESIGN_GUIDE.md
- 빌드: `export PATH="/tmp/node-v20.18.1-darwin-arm64/bin:$PATH" && sh build.sh`
- 프리뷰: `/tmp/festa-deploy/`에 복사 후 ruby WEBrick (port 8080)
- 기준 케이스: 퀸/5년/루네어/코지/토탈 → 59,320원

### 프리뷰 서버 설정
```json
// .claude/launch.json
{
  "name": "festa",
  "runtimeExecutable": "ruby",
  "runtimeArgs": ["-e", "require 'webrick';s=WEBrick::HTTPServer.new(Port:8080,DocumentRoot:'/tmp/festa-deploy');trap('INT'){s.shutdown};s.start"],
  "port": 8080
}
```
- 빌드 후 반드시: `rm -rf /tmp/festa-deploy && mkdir -p /tmp/festa-deploy && cp -r deploy/* /tmp/festa-deploy/ && rm -f /tmp/festa-deploy/sw.js`
- SW 캐시 방지: sw.js 제거 필수

## 8. 새 세션 시작 메시지

```
HANDOFF_SESSION36.md 읽고 이어서 작업해줘.
```
