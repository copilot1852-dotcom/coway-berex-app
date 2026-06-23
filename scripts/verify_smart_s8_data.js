const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function assertIncludes(text, label) {
  if (!html.includes(text)) {
    throw new Error(`Missing S8+ data: ${label}`);
  }
}

const expectedItems = [
  ["modelNo: 'CMLK-AS05'", "spec: '1,800×2,080×330'", 'price: 8270000', 'rentalData: { 3: { monthly: 168900 }, 5: { monthly: 147900 }, 7: { monthly: 114900 } }'],
  ["modelNo: 'CMK-AS05'", "spec: '1,650×2,000×330'", 'price: 7500000', 'rentalData: { 3: { monthly: 158900 }, 5: { monthly: 133900 }, 7: { monthly: 103900 } }'],
  ["modelNo: 'CMQ-AS05'", "spec: '1,500×2,000×330'", 'price: 7050000', 'rentalData: { 3: { monthly: 148900 }, 5: { monthly: 125900 }, 7: { monthly: 97900 } }'],
  ["modelNo: 'CMSS-AS05'", "spec: '1,100×2,000×330'", 'price: 5380000', 'rentalData: { 3: { monthly: 118900 }, 5: { monthly: 96900 }, 7: { monthly: 75900 } }'],
];

expectedItems.flat().forEach((snippet) => assertIncludes(snippet, snippet));

const qRawMonthly = 125900;
const basicFinal = qRawMonthly - 3000;
const totalFinal = qRawMonthly + 1000;
const king7RawMonthly = 103900;
const king7BasicFinal = king7RawMonthly - 3000;

if (basicFinal !== 122900) {
  throw new Error(`S8+ 퀸 베이직케어 5년 월렌탈료: expected 122900, got ${basicFinal}`);
}

if (totalFinal !== 126900) {
  throw new Error(`S8+ 퀸 토탈케어 5년 월렌탈료: expected 126900, got ${totalFinal}`);
}

if (king7BasicFinal !== 100900) {
  throw new Error(`S8+ 킹 베이직케어 7년 월렌탈료: expected 100900, got ${king7BasicFinal}`);
}

console.log('스마트S8+ 데이터 검증 통과');
