# 세션 34 핸드오프 — 빌드 파이프라인 + PWA + UI 대규모 개선

> 작성: 2026-03-31
> 파일: `/Users/minmacbook/Desktop/V5 festa/index.html`
> 배포: `deploy/` 폴더 → Cloudflare 업로드

---

## 1. 프로젝트 개요
- **앱 이름**: 비렉스 공식 가격 가이드 v5
- **기술 스택**: 단일 HTML (React 18 + Babel 인라인), Tailwind CSS (CDN)
- **목적**: 코웨이 홈케어닥터가 고객 현장에서 매트리스 렌탈 견적을 보여주는 영업 도구
- **배포 방식**: `sh build.sh` → `deploy/` 폴더 생성 → Cloudflare 업로드

---

## 2. 파일/폴더 구조

```
V5 festa/
├── index.html              ← 원본 (JSX, 개발용)
├── build.sh                ← 빌드 스크립트 (JSX→JS 변환)
├── deploy/                 ← 배포 폴더 (빌드 결과물)
│   ├── index.html          ← 트랜스파일된 JS 버전
│   ├── data/               ← 경쟁사 데이터
│   ├── manifest.json       ← PWA 매니페스트
│   ├── sw.js               ← 서비스워커
│   ├── icon-192.png        ← PWA 아이콘
│   └── icon-512.png        ← PWA 아이콘
├── data/                   ← 원본 데이터
├── manifest.json           ← PWA (display: standalone)
├── sw.js                   ← 서비스워커 (network-first)
├── icon-192.png / icon-512.png
├── .claude/launch.json     ← 프리뷰 서버 설정
├── node_modules/           ← @babel/cli, sharp 등
├── DEV_RULES.md / STRUCTURE.md / DESIGN_GUIDE.md / CALC_LOGIC.md
└── HANDOFF_SESSION34.md    ← 이 파일
```

---

## 3. 완료된 작업 목록

### 3-1. 빌드 파이프라인 구축
- **build.sh** 생성: JSX → React.createElement 사전 변환
  - `./node_modules/.bin/babel --presets @babel/preset-react`
  - Babel standalone 스크립트 태그 삭제 (~1.2MB 네트워크 절약)
  - data/, manifest.json, sw.js, icon-*.png 자동 복사
- **작업 순서 확립**: 원본 수정 → `sh build.sh` → deploy/ 프리뷰
- **프리뷰 서버**: `.claude/launch.json`에 `deploy` 서버 추가 (port 8082)

### 3-2. PWA 설정
- **manifest.json**: `display: standalone`, 실제 PNG 아이콘
- **아이콘**: icon-192.png (5KB), icon-512.png (17KB) — 초록 BEREX
- **서비스워커**: network-first + cache fallback
- 안드로이드 standalone 모드 3요소 충족

### 3-3. FESTA BENEFIT 슬라이드 순서 변경
- 변경: donut → summary → **hotpick** → **compSlide** → detail

### 3-4. FESTA BENEFIT 풀스크린
- `maxHeight:95vh` 바텀시트 → `top:0; bottom:0` 풀스크린
- safe-area-inset-top 적용

### 3-5. 슬라이드 글자크기 연동
- 슬라이드 `--fs-scale`: 최소 100%, 최대 120% (앱 150%일 때)

### 3-6. 메인 대시보드 카드 통합
- 빈 상태 + 채워진 상태 2개 카드 → 1개 통합 (화면 튀지 않음)
- 4분할(총납입/절약/하루/투자) 항상 4칸 고정

### 3-7. 초기 글자크기: 100% → 130%

### 3-8. 하단바: 6개 → 5개 (즐겨찾기 → 더보기로 이동)

### 3-9. 컨설팅 리포트에 유튜브 영상 추가
- 건강 조건별 추천 영상 매핑 (재생목록 23개 기준)
- 노션 페이지 동기화 완료

### 3-10. BEST PICK 리디자인
- 1순위 카드 + 대안 2·3순위 + 전체 N개 토글
- 높이 매칭 + 조건 가점 점수 정렬
- 추천 이유 동적 생성, "이 제품으로 견적 보기" 버튼

### 3-11. 뒤로가기 방지
- 모바일: confirm 팝업, 탭 닫기: beforeunload 경고

### 3-12. 경쟁사 비교 슬라이드 중앙 정렬

### 3-13. 하단 버튼바 오버플로 수정 (flex:1 균등, 라벨 축약)

### 3-14. 전체 화면 너비 100% (max-width:480px 제거)

### 3-15. BEST PICK 높이 표시 버그 수정 (이중 /10 제거)

---

## 4. 수정된 파일

| 파일 | 변경 |
|---|---|
| `index.html` | 대시보드 통합, BEST PICK 리디자인, 유튜브, 뒤로가기, 480px 제거, 슬라이드 풀스크린, 하단바, 글자크기 130%, 버튼 수정 |
| `build.sh` | 신규 — JSX→JS 빌드 |
| `manifest.json` | PWA standalone + PNG 아이콘 |
| `icon-*.png` | 신규 — PWA 아이콘 |
| `.claude/launch.json` | deploy 서버 추가 |

---

## 5. 미완성 / 확인 필요

1. 다크 모드 전체 검수 미실시
2. 글자크기 150% 전체 레이아웃 검수
3. BEST PICK 점수 로직 가중치 튜닝
4. 유튜브 재생목록 변경 시 코드 URL 수동 업데이트 필요

---

## 6. 다음 작업

- 다크 모드 전체 검수
- 글자크기 150% 레이아웃 검수
- Cloudflare 배포 후 실기기 테스트
- BEST PICK 추천 가중치 튜닝

---

## 7. 주의 사항

### 빌드 필수 순서
```
1. 원본 index.html 수정
2. sh build.sh 실행
3. deploy/index.html로 프리뷰 (deploy 서버, port 8082)
4. deploy/ → Cloudflare 업로드
```

### 계산 로직 보호
- 기준 케이스: 퀸/5년/루네어/코지/토탈 → 59,320원
- `_getDetailedPricingByCareImpl` (L4217) = 모든 가격 계산 근원

### 프리뷰
- **항상 deploy/index.html** (원본은 Babel 느림)
- 모바일 기준: 375×812
