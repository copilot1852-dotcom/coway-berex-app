const fs = require('fs');

const source = fs.readFileSync('index.html', 'utf8');

function assertIncludes(text, label) {
  if (!source.includes(text)) {
    throw new Error(`Missing UI text: ${label}`);
  }
}

assertIncludes('7월 15%(2개이상)', 'July two-plus rental discount label');
assertIncludes('7월 프로모션 안내', 'notice title');
assertIncludes('2026.07.01 업데이트', 'notice update date');
assertIncludes('2개 이상 렌탈 시 15% 할인을 적용합니다.', 'July promo notice copy');
assertIncludes('결합할인 5%', 'bundle toggle copy');
assertIncludes('모던 플러스 파운데이션 출시', 'modern foundation notice title');
assertIncludes('기존 파운데이션의 업그레이드 버전, 모던파데가 투매트리스 메뉴에 추가되었습니다.', 'modern foundation notice copy');
assertIncludes('250mm 낮아진 높이', 'modern foundation height notice');
assertIncludes('뉴트럴 베이지(BG) / 애쉬 브라운(BR)', 'modern foundation color notice');
assertIncludes('berex_june_notice_0605_modern_foundation', 'June modern foundation notice localStorage key');

function assertNotIncludes(text, label) {
  if (source.includes(text)) {
    throw new Error(`Unexpected UI text: ${label}`);
  }
}

assertNotIncludes('제휴카드 변경된 할인금액', 'affiliate card notice heading');
assertNotIncludes("name:'신한카드', range:'30만/70만 구간'", 'shinhan notice summary');
assertNotIncludes("name:'LOCA', range:'30만/70만 구간'", 'loca notice summary');
assertNotIncludes('berex_card_notice_0602_simple', 'old affiliate card notice localStorage key');
assertNotIncludes('6월 동시+반값', 'old June simultaneous plus half copy');
assertNotIncludes('6월 프로모션 안내', 'old June notice title');
assertNotIncludes('2대 이상 10% 할인과 약정별 반값 혜택을 함께 적용합니다.', 'old 10 percent plus half notice copy');
assertNotIncludes('10% + 반값 혜택 + 자동이체 1,000원', 'old two-plus rental hint');

console.log('promo notice UI checks passed');
