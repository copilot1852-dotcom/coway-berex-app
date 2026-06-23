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

const constants = extract(
  /const PROMOTION_FREE_MONTHS = \{[\s\S]*?\};/,
  'PROMOTION_FREE_MONTHS'
);
const decisionFn = extract(
  /const getRentalBenefitDecision = \([\s\S]*?\n  \};/,
  'getRentalBenefitDecision'
);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${constants}\n${decisionFn}\nthis.getRentalBenefitDecision = getRentalBenefitDecision;`, sandbox);

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function checkDecision({ units, period, existing = false, expectedRate, expectedMonths }) {
  const result = sandbox.getRentalBenefitDecision({
    newUnitsCount: units,
    hasExistingCoway: existing,
    selectedPeriod: period,
    isRerental: false
  });
  assertEqual(result.discountRate, expectedRate, `${units} unit(s), ${period}y discountRate`);
  assertEqual(result.halfMonths, expectedMonths, `${units} unit(s), ${period}y halfMonths`);
  if (expectedMonths > 0 && !result.halfLabel.includes(`${expectedMonths}개월`)) {
    throw new Error(`${units} unit(s), ${period}y halfLabel should include ${expectedMonths}개월`);
  }
}

for (const [period, months] of [[5, 6], [7, 12], [9, 15]]) {
  checkDecision({ units: 1, period, expectedRate: 0, expectedMonths: months });
  checkDecision({ units: 1, period, existing: true, expectedRate: 0.05, expectedMonths: months });
  checkDecision({ units: 2, period, expectedRate: 0.10, expectedMonths: months });
  checkDecision({ units: 3, period, expectedRate: 0.10, expectedMonths: months });
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
