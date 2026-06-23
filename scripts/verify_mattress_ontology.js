const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function sectionBetween(start, end, label) {
  const startIndex = html.indexOf(start);
  if (startIndex === -1) throw new Error(`Missing ontology section start: ${label}`);
  const endIndex = html.indexOf(end, startIndex);
  if (endIndex === -1) throw new Error(`Missing ontology section end: ${label}`);
  return html.slice(startIndex, endIndex);
}

function readModelKeys(section) {
  return new Set([...section.matchAll(/^\s*([a-zA-Z][a-zA-Z0-9]*):\s*\{\s*name:/gm)].map(match => match[1]));
}

function readMapKeys(section) {
  return new Set([...section.matchAll(/([a-zA-Z][a-zA-Z0-9]*)\s*:/g)].map(match => match[1]));
}

function readListedModels(section) {
  return new Set([...section.matchAll(/models:\s*\[([^\]]*)\]/g)]
    .flatMap(match => [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1])));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const mattressData = sectionBetween('mattresses: {', 'frames: {', 'PRODUCT_DATA.mattresses');
const productKeys = readModelKeys(mattressData);

const mattressCategories = sectionBetween('const MATTRESS_CATEGORIES = {', 'const MATTRESS_STRUCTURE = {', 'MATTRESS_CATEGORIES');
const mattressStructure = sectionBetween('const MATTRESS_STRUCTURE = {', 'const CARE_OPTIONS = {', 'MATTRESS_STRUCTURE');
const categoryKeys = readListedModels(mattressCategories);
const structureKeys = readListedModels(mattressStructure);

const missingFromCategory = [...productKeys].filter(key => !categoryKeys.has(key));
const missingFromStructure = [...productKeys].filter(key => !structureKeys.has(key));
const unknownCategoryKeys = [...categoryKeys].filter(key => !productKeys.has(key));
const unknownStructureKeys = [...structureKeys].filter(key => !productKeys.has(key));

assert(missingFromCategory.length === 0, `MATTRESS_CATEGORIES 누락: ${missingFromCategory.join(', ')}`);
assert(missingFromStructure.length === 0, `MATTRESS_STRUCTURE 누락: ${missingFromStructure.join(', ')}`);
assert(unknownCategoryKeys.length === 0, `MATTRESS_CATEGORIES 미등록 상품 참조: ${unknownCategoryKeys.join(', ')}`);
assert(unknownStructureKeys.length === 0, `MATTRESS_STRUCTURE 미등록 상품 참조: ${unknownStructureKeys.join(', ')}`);

const topperPrices = readMapKeys(sectionBetween('const TOPPER_PRICES = {', 'const TOPPER_MONTHLY_COST = {', 'TOPPER_PRICES'));
const topperMonthlyCosts = readMapKeys(sectionBetween('const TOPPER_MONTHLY_COST = {', 'const TOPPER_EXCHANGE_MONTHS = {', 'TOPPER_MONTHLY_COST'));
const topperTypeLabels = readMapKeys(sectionBetween('const TOPPER_TYPE_LABELS = {', 'const EARLY_EXCHANGE_PENALTY_RATE', 'TOPPER_TYPE_LABELS'));
const modelAddFees = readMapKeys(sectionBetween('const MODEL_ADD_FEES = {', 'const NO_TOPPER_MODELS', 'MODEL_ADD_FEES'));

const smartKeys = ['smarts6', 'smarts8'];
smartKeys.forEach(key => {
  assert(productKeys.has(key), `스마트 매트리스 상품 데이터 누락: ${key}`);
  assert(categoryKeys.has(key), `스마트 매트리스 카테고리 누락: ${key}`);
  assert(structureKeys.has(key), `스마트 매트리스 구조 분류 누락: ${key}`);
  assert(topperPrices.has(key), `스마트 매트리스 커버 가격 누락: ${key}`);
  assert(topperMonthlyCosts.has(key), `스마트 매트리스 월 커버 비용 누락: ${key}`);
  assert(topperTypeLabels.has(key), `스마트 매트리스 커버 라벨 누락: ${key}`);
  assert(modelAddFees.has(key), `스마트 매트리스 관리유형 추가금 누락: ${key}`);
});

[
  "'스마트':     { models: ['smarts8', 'smarts6']",
  "'커버':        { models: ['elite', 'smarts8', 'smarts6', 'compactfoam']",
].forEach(snippet => {
  assert(html.includes(snippet), `스마트 매트리스 온톨로지 연결 누락: ${snippet}`);
});

console.log('매트리스 온톨로지 검증 통과');
