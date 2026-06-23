# Berex Festa Quote App

코웨이 비렉스 매트리스, 프레임, 힐링 제품 렌탈 견적을 계산하는 현장 상담용 웹앱입니다.

## 실행

```bash
npm install
bash build.sh
python3 serve.py 8080 deploy
```

브라우저에서 `http://localhost:8080`을 열어 확인합니다.

## 주요 파일

- `index.html`: 앱 본문
- `data/catalog/healing.json`: 힐링 제품 카탈로그
- `data/competitorMap.json`: 경쟁사 비교 데이터
- `scripts/verify_*.js`: 가격/프로모션 데이터 검증 스크립트
- `CALC_LOGIC.md`: 계산 로직 명세

## 검증

```bash
npm test
```
