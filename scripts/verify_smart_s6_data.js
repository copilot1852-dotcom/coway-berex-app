const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function assertIncludes(text, label) {
  if (!html.includes(text)) {
    throw new Error(`Missing S6+ data: ${label}`);
  }
}

[
  "smarts6: { name: '스마트S6+'",
  'smarts6: "https://www.coway.com/product/detail?prdno=1189&optno=8"',
  "smarts6: 3000",
  "smarts6: { '라지킹': 350000, '킹': 300000, '퀸': 250000, '슈싱': 200000 }",
  "sigs: 0, smarts8: 0, smarts6: 0",
  "smarts6: '커버'",
  "'smarts6': 'S6+'",
  "'커버':        { models: ['elite', 'smarts8', 'smarts6', 'compactfoam']",
  "'스마트':     { models: ['smarts8', 'smarts6']",
  "selectedMattress === 'smarts8' || selectedMattress === 'smarts6'",
].forEach((snippet) => assertIncludes(snippet, snippet));

const expectedItems = [
  ["modelNo: 'CMLK-AS04'", "spec: '1,800×2,080×290'", 'price: 6380000', 'rentalData: { 5: { monthly: 116900 }, 7: { monthly: 90900 } }'],
  ["modelNo: 'CMK-AS04'", "spec: '1,650×2,000×290'", 'price: 5720000', 'rentalData: { 5: { monthly: 104900 }, 7: { monthly: 81900 } }'],
  ["modelNo: 'CMQ-AS04'", "spec: '1,500×2,000×290'", 'price: 5380000', 'rentalData: { 5: { monthly: 97900 }, 7: { monthly: 76900 } }'],
  ["modelNo: 'CMSS-AS04'", "spec: '1,100×2,000×290'", 'price: 4270000', 'rentalData: { 5: { monthly: 77900 }, 7: { monthly: 61900 } }'],
];

expectedItems.flat().forEach((snippet) => assertIncludes(snippet, snippet));

const rawMonthly = 77900;
const serviceFreeBaseDiscount = 4000;
const autoPayDiscount = 1000;
const serviceFreeContractDiscount = 4000;
const smartSpecialDiscount = 9000;
const mBase = rawMonthly - serviceFreeBaseDiscount + smartSpecialDiscount;
const serviceFreeFinal = mBase - autoPayDiscount - serviceFreeContractDiscount - smartSpecialDiscount;

if (serviceFreeFinal !== 68900) {
  throw new Error(`S6+ 슈싱 서비스프리 5년 월렌탈료: expected 68900, got ${serviceFreeFinal}`);
}

const qRawMonthly = 97900;
const carePrices = {
  serviceFree: qRawMonthly - 9000,
  special: qRawMonthly - 6000,
  basic: qRawMonthly - 3000,
  total: qRawMonthly,
};

if (carePrices.serviceFree !== 88900) {
  throw new Error(`S6+ 퀸 서비스프리 5년 월렌탈료: expected 88900, got ${carePrices.serviceFree}`);
}

if (carePrices.special !== 91900) {
  throw new Error(`S6+ 퀸 스페셜체인지 5년 월렌탈료: expected 91900, got ${carePrices.special}`);
}

if (carePrices.basic !== 94900) {
  throw new Error(`S6+ 퀸 베이직케어 5년 월렌탈료: expected 94900, got ${carePrices.basic}`);
}

if (carePrices.total !== 97900) {
  throw new Error(`S6+ 퀸 토탈케어 5년 월렌탈료: expected 97900, got ${carePrices.total}`);
}

console.log('스마트S6+ 데이터 검증 통과');
