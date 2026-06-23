#!/bin/bash
# preview.sh — 빌드 + deploy 복사 한 번에 (프리뷰 반영용)
# 사용법: bash preview.sh

set -e
cd "$(dirname "$0")"

echo "🔧 1/3 빌드 중..."
bash build.sh 2>&1 | tail -3

echo "📦 2/3 deploy → /tmp/festa-deploy/ 복사 중..."
mkdir -p /tmp/festa-deploy
cp -r deploy/* /tmp/festa-deploy/

echo "✅ 3/3 완료! 프리뷰 서버에 즉시 반영됨"
echo "   → 브라우저에서 새로고침하세요 (캐시 문제 시 ?v=$(date +%s) 추가)"
