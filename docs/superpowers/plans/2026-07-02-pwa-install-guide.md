# PWA Install Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a PWA install guide to the deployed static app.

**Architecture:** Keep the feature outside the existing React bundle to avoid touching the large generated app code. A small fixed banner in `deploy/index.html` owns native install prompt capture, manual fallback instructions, and session-only dismissal.

**Tech Stack:** Static HTML, CSS, browser PWA events, Node.js verification script.

---

### Task 1: Static Verification

**Files:**
- Create: `scripts/verify_pwa_install_prompt.js`
- Modify: `package.json`

- [ ] **Step 1: Write the failing test**

Create a Node.js script that reads `deploy/index.html` and checks for `pwa-install-guide`, `pwa-install-button`, `beforeinstallprompt`, `appinstalled`, `prompt()`, and manual install instructions.

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify_pwa_install_prompt.js`

Expected: FAIL because the install guide is not present yet.

### Task 2: Install Guide UI

**Files:**
- Modify: `deploy/index.html`

- [ ] **Step 1: Add CSS and DOM**

Insert a fixed bottom install guide with install and close buttons. Keep it hidden by default.

- [ ] **Step 2: Add browser event logic**

Listen for `beforeinstallprompt`, show the native install button when available, show manual instructions when unavailable, hide in standalone mode, and hide after `appinstalled`.

- [ ] **Step 3: Run verification**

Run: `node scripts/verify_pwa_install_prompt.js`

Expected: PASS.
