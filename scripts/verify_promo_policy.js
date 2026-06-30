const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('index.html', 'utf8');

function extract(pattern, label) {
  const match = source.match(pattern);
  if (!match) {
    throw new Error(`Could not find ${label}`);
  }
  return match[0];
}

const decisionFn = extract(
  /const getRentalBenefitDecision = \([\s\S]*?\n  \};/,
  'getRentalBenefitDecision'
);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${decisionFn}\nthis.getRentalBenefitDecision = getRentalBenefitDecision;`, sandbox);

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function checkDecision({ units, period, existing = false, expectedRate, expectedMonths, expectedDiscountLabel, expectedBenefitLabel }) {
  const result = sandbox.getRentalBenefitDecision({
    newUnitsCount: units,
    hasExistingCoway: existing,
    selectedPeriod: period,
    isRerental: false
  });
  assertEqual(result.discountRate, expectedRate, `${units} unit(s), ${period}y discountRate`);
  assertEqual(result.halfMonths, expectedMonths, `${units} unit(s), ${period}y halfMonths`);
  assertEqual(result.halfLabel, '', `${units} unit(s), ${period}y halfLabel`);
  assertEqual(result.discountLabel, expectedDiscountLabel, `${units} unit(s), ${period}y discountLabel`);
  assertEqual(result.benefitLabel, expectedBenefitLabel, `${units} unit(s), ${period}y benefitLabel`);
}

for (const period of [3, 5, 7, 9]) {
  checkDecision({
    units: 1,
    period,
    expectedRate: 0,
    expectedMonths: 0,
    expectedDiscountLabel: '',
    expectedBenefitLabel: '기본 렌탈'
  });
  checkDecision({
    units: 1,
    period,
    existing: true,
    expectedRate: 0.05,
    expectedMonths: 0,
    expectedDiscountLabel: '결합할인 5%',
    expectedBenefitLabel: '결합할인 5%'
  });
  checkDecision({
    units: 2,
    period,
    expectedRate: 0.15,
    expectedMonths: 0,
    expectedDiscountLabel: '7월 15%(2개이상)',
    expectedBenefitLabel: '7월 15%(2개이상)'
  });
  checkDecision({
    units: 3,
    period,
    expectedRate: 0.15,
    expectedMonths: 0,
    expectedDiscountLabel: '7월 15%(2개이상)',
    expectedBenefitLabel: '7월 15%(2개이상)'
  });
}

const rerental = sandbox.getRentalBenefitDecision({
  newUnitsCount: 2,
  hasExistingCoway: false,
  selectedPeriod: 7,
  isRerental: true
});
assertEqual(rerental.halfMonths, 0, 'rerental halfMonths');
assertEqual(rerental.discountRate, 0, 'rerental discountRate');

console.log('promo policy checks passed');
