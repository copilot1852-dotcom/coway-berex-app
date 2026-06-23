const fs = require('fs');

const source = fs.readFileSync('index.html', 'utf8');

function extractCardBlock(cardId) {
  const pattern = new RegExp(`\\{ id:'${cardId}'[\\s\\S]*?\\}\\], period:(\\d+|0), tel:'([^']*)'`, 'm');
  const match = source.match(pattern);
  if (!match) {
    throw new Error(`Could not find card data for ${cardId}`);
  }
  return match[0];
}

function extractTiers(cardId) {
  const block = extractCardBlock(cardId);
  return [...block.matchAll(/\{spend:(\d+), base:(\d+), promo:(\d+), total:(\d+)\}/g)].map(match => ({
    spend: Number(match[1]),
    base: Number(match[2]),
    promo: Number(match[3]),
    total: Number(match[4])
  }));
}

function assertTier(cardId, expected) {
  const tiers = extractTiers(cardId);
  for (const exp of expected) {
    const actual = tiers.find(tier => tier.spend === exp.spend);
    if (!actual) {
      throw new Error(`${cardId} missing ${exp.spend}만원 tier`);
    }
    for (const key of ['base', 'promo', 'total']) {
      if (actual[key] !== exp[key]) {
        throw new Error(`${cardId} ${exp.spend}만원 ${key}: expected ${exp[key]}, got ${actual[key]}`);
      }
    }
    if (actual.base + actual.promo !== actual.total) {
      throw new Error(`${cardId} ${exp.spend}만원 total must equal base + promo`);
    }
  }
}

function assertTel(cardId, expectedTel) {
  const block = extractCardBlock(cardId);
  const match = block.match(/tel:'([^']*)'/);
  const actualTel = match ? match[1] : '';
  if (actualTel !== expectedTel) {
    throw new Error(`${cardId} tel: expected ${expectedTel}, got ${actualTel}`);
  }
}

assertTier('shinhan', [
  { spend: 30, base: 13000, promo: 11000, total: 24000 },
  { spend: 70, base: 17000, promo: 7000, total: 24000 },
  { spend: 150, base: 30000, promo: 0, total: 30000 }
]);

assertTier('loca', [
  { spend: 30, base: 13000, promo: 2000, total: 15000 },
  { spend: 70, base: 16000, promo: 1000, total: 17000 },
  { spend: 150, base: 25000, promo: 0, total: 25000 }
]);

assertTel('woori', '1800-0859');

console.log('card promo data checks passed');
