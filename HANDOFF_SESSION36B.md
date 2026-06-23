# 세션 36B 핸드오프 문서 (36 후반)

## 1. 이어서 할 미해결 이슈

### ★ 핫픽 슬라이드에서 페스타 15% 토글 가격 미반영
- **증상**: 핫픽 약정 시뮬레이션 슬라이드에서 페스타 15% 토글을 ON/OFF해도 약정 카드의 가격이 변하지 않음
- **원인**: `applyHotPick` 함수(L4545)가 워터폴 IIFE 안에서 호출되어 steps를 빌드할 때 `isAprilCombo` 값을 캡처하지만, 핫픽 슬라이드 내부에서 토글을 바꿔도 steps의 `hpResults` 데이터가 실시간 갱신 안 됨
- **메인 HERO 가격은 정상** — useMemo 의존성에 `isAprilCombo` 포함됨
- **해결 방향**:
  1. 핫픽 슬라이드의 토글 onClick에서 `applyHotPick` 재호출 트리거
  2. 또는 핫픽 결과를 steps 빌드가 아닌 렌더링 시점에서 실시간 계산
  3. 또는 `wfHpPeriod` state 변경으로 re-render 트리거 (하지만 steps 자체가 IIFE에서 빌드되므로 re-render만으로 충분할 수 있음 — 검증 필요)

### 모디 정상 렌탈료 불일치 (보류)
- 도넛: `(mBase-aFee)*months - _careRawTotal(6000×months)`
- 비교바: `(mBase-aFee)*months - careInc2(5100×months)`
- 차이 = 900원/월 × 대수 × 개월

### smarts8 mSE=9000 도넛 표시 이슈 (세션 35에서 보류)

## 2. 세션 36 후반 완료 작업

### UI 변경
- M담기/F담기 → **장바구니 담기** 1개 버튼 통합 (매트리스담기/프레임담기/세트담기 동적 텍스트)
- BENEFIT → **혜택보기** 변경 (메인/장바구니/더보기 3곳)
- **서비스프리 표기 통일** (메인칩만 "서프", 나머지 "서비스프리")
- **도넛 슬라이드 제품 요약 라인** (모디+코지·퀸·5년·토탈·2대)
- **도넛 슬라이드 정상 렌탈료 + 총 할인** 표시 (rawMonthly vs actualMonthly 차액)
- 짧은다리/높이 표시 버그 수정 (프레임 미선택 시)
- **토스트 알림 화면 중앙** + fadeInOut 애니메이션
- **홈 플로팅 버튼** (우측 중앙, 모달 열려있을 때만 표시)
- **스크롤 닫기 통일** (setupScrollClose 전역 헬퍼, 고무줄 애니메이션)
- 보관함/더보기/즐겨찾기 드래그 다운 닫기 제거 (홈 버튼으로 대체)
- **슬라이드 닫기 안내** "끝까지 올려서 닫기" (opacity 0.6, fontWeight 600)
- 더보기에서 핫픽 추천 버튼 삭제 (빈 셸)
- 더보기에 **가격 탐색기** 버튼 복구

### 계산/데이터 변경
- **4월 카드 할인 데이터** 업데이트 (현대M3/우리II/KB국민II)
- **페스타 15% 토글** 신규 (isAprilCombo state, totalUnitsCount +1, 중복금지)
- 페스타 15% 도움말: "4월 1개 이상 제품 렌탈 이력이 있는 고객만 ON하세요"
- 페스타 15% 토스트: 장바구니 연동 대수 표시
- 핫픽 슬라이드에 페스타 15% 토글 추가 (가격 미반영 — 미해결)
- **카드 공지 팝업** (3일간 자동, 오늘은 열지 않기)
- "페스타 할인" → "패키지 할인" / "총 할인" 명칭 변경

### 디자인
- **Notion 스타일 전면 적용** (색상/radius/그림자 일괄 변경)
- DESIGN_GUIDE.md Notion 스타일로 전면 교체
- 목업 파일 생성 (mockup-main.html, mockup-notion.html)
- DESIGN_PROMPT.md 생성 (다른 프로젝트 전달용)

### 인프라
- Node.js 설치 + build.sh 빌드 절차 확립
- Preview 환경 구축 (ruby WEBrick + /tmp/festa-deploy)
- setupScrollClose 전역 헬퍼 함수 (QuoteModal 등 외부 컴포넌트 접근 해결)
- 뒤로가기 닫기 버그 수정 (pushDummy 무한루프)

## 3. 주요 파일 변경

| 파일 | 변경 |
|------|------|
| index.html | 전체 UI + 계산 + 디자인 변경 |
| DESIGN_GUIDE.md | Notion 스타일 전면 교체 |
| CALC_LOGIC.md | 카드 데이터 업데이트 |
| DEV_RULES.md | deploy 빌드 절차 + 프리뷰 설정 |
| DESIGN_PROMPT.md | 신규 (디자인 변환 지시어) |
| mockup-*.html | 신규 (Notion 스타일 시안) |

## 4. 백업 파일
- index1.html: 세션 35 시작
- index2.html: 세션 36 시작
- index3.html: Notion 스타일 적용 전
- index4.html: 장바구니 담기 변경 전

## 5. 프리뷰 설정
```
빌드: export PATH="/tmp/node-v20.18.1-darwin-arm64/bin:$PATH" && sh build.sh
복사: rm -rf /tmp/festa-deploy && mkdir -p /tmp/festa-deploy && cp -r deploy/* /tmp/festa-deploy/ && rm -f /tmp/festa-deploy/sw.js
서버: ruby WEBrick (port 8080, /tmp/festa-deploy)
```

## 6. 새 세션 시작 메시지
```
HANDOFF_SESSION36B.md 읽고 이어서 작업해줘.
최우선: 핫픽 슬라이드 페스타 15% 토글 가격 미반영 수정.
```
