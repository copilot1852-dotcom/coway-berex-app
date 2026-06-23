#!/bin/bash
# ─────────────────────────────────────────────
# 비렉스 가격 가이드 v5 — 빌드 스크립트
# JSX → React.createElement 사전 변환
# 사용법: sh build.sh
# ─────────────────────────────────────────────
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEPLOY_DIR="$PROJECT_DIR/deploy"
SRC="$PROJECT_DIR/index.html"

# ── 0. Node.js 확인 ──
if ! command -v node &>/dev/null; then
  echo "❌ Node.js가 설치되어 있지 않습니다."
  echo "   brew install node  또는  https://nodejs.org 에서 설치하세요."
  exit 1
fi

echo "🔧 빌드 시작..."

# ── 1. deploy 폴더 초기화 ──
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# ── 2. index.html 복사 ──
cp "$SRC" "$DEPLOY_DIR/index.html"

# ── 3. data/, manifest.json, sw.js 복사 ──
[ -d "$PROJECT_DIR/data" ] && cp -r "$PROJECT_DIR/data" "$DEPLOY_DIR/data"
[ -f "$PROJECT_DIR/manifest.json" ] && cp "$PROJECT_DIR/manifest.json" "$DEPLOY_DIR/manifest.json"
[ -f "$PROJECT_DIR/sw.js" ] && cp "$PROJECT_DIR/sw.js" "$DEPLOY_DIR/sw.js"
[ -f "$PROJECT_DIR/icon-192.png" ] && cp "$PROJECT_DIR/icon-192.png" "$DEPLOY_DIR/icon-192.png"
[ -f "$PROJECT_DIR/icon-512.png" ] && cp "$PROJECT_DIR/icon-512.png" "$DEPLOY_DIR/icon-512.png"

# ── 4. JSX 추출 → 변환 → 재삽입 ──
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# JSX 블록 추출 (script type="text/babel" 태그 사이의 내용)
node -e "
const fs = require('fs');
const html = fs.readFileSync('$DEPLOY_DIR/index.html', 'utf8');

// babel script 태그의 내용 추출
const regex = /<script\s+type=[\"']text\/babel[\"'][^>]*>([\s\S]*?)<\/script>/g;
let match;
let index = 0;
const blocks = [];

while ((match = regex.exec(html)) !== null) {
  const jsx = match[1];
  const filename = 'block_' + index + '.jsx';
  fs.writeFileSync('$TEMP_DIR/' + filename, jsx, 'utf8');
  blocks.push({
    fullMatch: match[0],
    openTag: match[0].substring(0, match[0].indexOf('>') + 1),
    filename: filename
  });
  index++;
}

fs.writeFileSync('$TEMP_DIR/blocks.json', JSON.stringify(blocks), 'utf8');
console.log('  JSX 블록 ' + blocks.length + '개 추출 완료');
"

BLOCK_COUNT=$(node -e "
const b = JSON.parse(require('fs').readFileSync('$TEMP_DIR/blocks.json','utf8'));
console.log(b.length);
")

if [ "$BLOCK_COUNT" = "0" ]; then
  echo "⚠️  JSX 블록을 찾을 수 없습니다. 원본을 그대로 사용합니다."
  echo "✅ 빌드 완료: $DEPLOY_DIR/"
  exit 0
fi

# 각 JSX 블록을 Babel로 변환
for jsx_file in "$TEMP_DIR"/block_*.jsx; do
  basename=$(basename "$jsx_file")
  js_file="$TEMP_DIR/${basename%.jsx}.js"

  "$PROJECT_DIR/node_modules/.bin/babel" --presets @babel/preset-react \
    --no-babelrc --filename "$basename" \
    "$jsx_file" -o "$js_file" 2>&1

  echo "  ✅ $basename → ${basename%.jsx}.js 변환 완료"
done

# 변환된 JS를 HTML에 재삽입
node -e "
const fs = require('fs');
let html = fs.readFileSync('$DEPLOY_DIR/index.html', 'utf8');
const blocks = JSON.parse(fs.readFileSync('$TEMP_DIR/blocks.json', 'utf8'));

for (let i = 0; i < blocks.length; i++) {
  const js = fs.readFileSync('$TEMP_DIR/block_' + i + '.js', 'utf8');
  const oldBlock = blocks[i].fullMatch;
  const newBlock = '<script type=\"text/javascript\">\n' + js + '\n</script>';
  html = html.replace(oldBlock, newBlock);
}

// Babel standalone 스크립트 태그 제거
html = html.replace(/<script[^>]*@babel\/standalone[^>]*><\/script>\s*/g, '');
// onerror 포함된 babel 태그도 제거
html = html.replace(/<script[^>]*babel\.min\.js[^>]*><\/script>\s*/g, '');

fs.writeFileSync('$DEPLOY_DIR/index.html', html, 'utf8');
console.log('  ✅ HTML 재조합 완료');
"

# ── 5. 결과 확인 ──
ORIG_SIZE=$(wc -c < "$SRC" | tr -d ' ')
DEPLOY_SIZE=$(wc -c < "$DEPLOY_DIR/index.html" | tr -d ' ')
echo ""
echo "📊 결과:"
echo "   원본:  $(( ORIG_SIZE / 1024 ))KB"
echo "   배포:  $(( DEPLOY_SIZE / 1024 ))KB"
echo "   Babel standalone 제거로 ~1.2MB 네트워크 절약"
echo ""
echo "✅ 빌드 완료: $DEPLOY_DIR/"
echo "   → deploy/ 폴더를 Cloudflare에 업로드하세요."
