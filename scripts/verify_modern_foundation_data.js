const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const requiredSnippets = [
  "modernFoundation: { name: '모던파데'",
  'modernFoundation: "https://www.coway.com/product/detail?prdno=1435&optno=1"',
  "'투매트리스':  ['foundation', 'modernFoundation', 'woody', 'cozy', 'volume', 'luna']",
  "'modernFoundation': '모던파데'",
  "modelNo: 'CFLK-F05'",
  "modelNo: 'CFK-F05'",
  "modelNo: 'CFQ-F05'",
  "modelNo: 'CFSS-F05'",
  "spec: '1,800×2,080×250'",
  "spec: '1,650×2,000×250'",
  "spec: '1,500×2,000×250'",
  "spec: '1,100×2,000×250'",
  "price: 1090000",
  "price: 1020000",
  "price: 950000",
  "price: 880000",
  "rentalData: { 5: { monthly: 22900 }, 7: { monthly: 20900 }, 9: { monthly: 18900 } }",
  "rentalData: { 5: { monthly: 21900 }, 7: { monthly: 19900 }, 9: { monthly: 17900 } }",
  "rentalData: { 5: { monthly: 20900 }, 7: { monthly: 18900 }, 9: { monthly: 16900 } }",
  "rentalData: { 5: { monthly: 19900 }, 7: { monthly: 17900 }, 9: { monthly: 15900 } }",
  "reRental: { 5: 20600, 7: 18800, 9: 17000 }",
  "reRental: { 5: 19700, 7: 17900, 9: 16100 }",
  "reRental: { 5: 18800, 7: 17000, 9: 15200 }",
  "reRental: { 5: 17900, 7: 16100, 9: 14300 }",
];

const missing = requiredSnippets.filter((snippet) => !html.includes(snippet));

if (missing.length) {
  console.error('모던파데 데이터 검증 실패:');
  missing.forEach((snippet) => console.error(`- ${snippet}`));
  process.exit(1);
}

console.log('모던파데 데이터 검증 통과');
