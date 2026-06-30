# 7월 프로모션 온톨로지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 7월 프로모션을 1개 렌탈 결합할인 5%, 2개 이상 렌탈 `7월 15%(2개이상)` 정책으로 전환하고 반값/동시할인 계산과 문구를 제거한다.

**Architecture:** Keep the existing single-file React app structure. Update `getRentalBenefitDecision` as the single source of truth, keep downstream monthly calculation formulas intact, and let `halfMonths=0` remove half-benefit totals naturally. Update verification scripts before production code so the policy change is test-driven.

**Tech Stack:** Inline React/Babel in `index.html`, Node.js verification scripts, Markdown docs.

---

### Task 1: Policy Verification

**Files:**
- Modify: `scripts/verify_promo_policy.js`
- Modify: `index.html`

- [x] **Step 1: Write the failing 7월 policy test**

Replace the non-rerental assertions in `scripts/verify_promo_policy.js` with cases expecting `halfMonths=0`, `0.15` for 2+ rentals, and labels `결합할인 5%` / `7월 15%(2개이상)`.

- [x] **Step 2: Run the policy test and verify RED**

Run: `node scripts/verify_promo_policy.js`

Expected: FAIL because current `getRentalBenefitDecision` returns `10% + 반값`.

- [x] **Step 3: Implement minimal policy change**

In `index.html`, update `RENTAL_POLICY_VERSION`, `getRentalBenefitDecision`, and `_getDetailedPricingByCareImpl` so `hasExistingCoway` comes from `isCross` only.

- [x] **Step 4: Run the policy test and verify GREEN**

Run: `node scripts/verify_promo_policy.js`

Expected: PASS with `promo policy checks passed`.

### Task 2: UI Copy Verification

**Files:**
- Modify: `scripts/verify_promo_notice_ui.js`
- Modify: `index.html`

- [x] **Step 1: Write the failing UI copy test**

Update `scripts/verify_promo_notice_ui.js` to require `7월 15%(2개이상)` and forbid the old 6월/반값/10%+반값 notice strings.

- [x] **Step 2: Run the UI copy test and verify RED**

Run: `node scripts/verify_promo_notice_ui.js`

Expected: FAIL while old strings remain in `index.html`.

- [x] **Step 3: Update UI copy**

Replace user-facing 6월 동시+반값 copy with 7월 15% copy in dashboard badge, notice modal, progress tier copy, discount detail labels, and 2+ rental hints.

- [x] **Step 4: Run the UI copy test and verify GREEN**

Run: `node scripts/verify_promo_notice_ui.js`

Expected: PASS with `promo notice UI checks passed`.

### Task 3: Documentation and Full Verification

**Files:**
- Modify: `CALC_LOGIC.md`
- Modify: `DEV_RULES.md`

- [x] **Step 1: Update calculation docs**

Revise discount policy sections so they describe 7월 15%(2개이상), 결합할인 5%, and no half-benefit months.

- [x] **Step 2: Run full automated tests**

Run: `npm test`

Expected: all verification scripts pass.

- [ ] **Step 3: Build deploy output**

Run: `sh build.sh`

Expected: build completes and updates `deploy/` if the repo build script produces it.

Status: blocked in this environment because `node_modules` is absent and `npm ci` was rejected by approval review due third-party install-script risk.

- [ ] **Step 4: Manual smoke check**

Open a local preview if available and verify one-rental and two-rental states visually. If browser preview cannot run in the environment, report that limitation and include automated evidence.
