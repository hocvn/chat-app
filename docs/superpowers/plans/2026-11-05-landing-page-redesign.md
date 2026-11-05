# Chattap Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Chattap’s generic landing page with the approved Common Room design while retaining the interactive chat demo and live theme picker.

**Architecture:** Keep the landing experience in `LandingPage.jsx`, which already owns the demo message state and theme-store integration. Extract only the static demo content and deterministic reply factory into a plain JavaScript module so Node’s built-in test runner can test the retained demo behavior without introducing a browser test dependency. Update the page composition and its navigation anchors without changing routes, stores, or backend APIs.

**Tech Stack:** React 19, React Router 7, Zustand 5, Tailwind CSS 3, DaisyUI 4, Lucide React, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-11-05-landing-page-redesign-design.md`

## Global Constraints

- Preserve the existing React, Tailwind CSS, DaisyUI, and Lucide stack; add no dependencies.
- Preserve accurate capabilities only: real-time one-to-one messaging, live presence, image sharing, profile customization, and 32 theme choices.
- Preserve working routes to `/signup`, `/login`, `/settings`, and in-page sections.
- Retain the interactive demo and the live DaisyUI theme picker.
- Do not introduce unverified statistics, performance claims, testimonials, pricing, or endorsements.
- Use the approved Common Room direction: warm neutral ground, dark ink, red primary action, editorial asymmetry, and restrained motion.

## Review Focus

- Empty or whitespace-only demo input must not append a message or schedule a simulated reply; test in Task 1.
- A non-empty demo message must receive the expected deterministic reply payload; test in Task 1.
- Every visible primary conversion action must route an unauthenticated visitor to `/signup`; inspect in Task 2’s browser verification.
- The live theme control must still call `setTheme` and visibly apply the selected DaisyUI theme; inspect in Task 2’s browser verification.
- At 390px wide, the hero, demo controls, and theme controls must remain readable, focusable, and free from horizontal overflow; inspect in Task 3.

---

### Task 1: Isolate and test interactive-demo content

**Files:**
- Create: `frontend/src/pages/landingPageContent.js`
- Create: `frontend/src/pages/landingPageContent.test.js`
- Modify: `frontend/src/pages/LandingPage.jsx:1-205`

**Interfaces:**
- Produces: `INITIAL_DEMO_MESSAGES: readonly DemoMessage[]` and `createDemoReply(id: number): DemoMessage` from `landingPageContent.js`.
- Consumes: `LandingPage` imports both exports and continues to own `demoMessages`, `demoInput`, and `isTyping` state.

- [ ] **Step 1: Write failing Node tests for the demo content module**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { INITIAL_DEMO_MESSAGES, createDemoReply } from "./landingPageContent.js";

test("provides an initial two-sided conversation", () => {
  assert.ok(INITIAL_DEMO_MESSAGES.some((message) => message.isMe));
  assert.ok(INITIAL_DEMO_MESSAGES.some((message) => !message.isMe));
});

test("creates a friendly reply for a sent demo message", () => {
  const reply = createDemoReply(42);
  assert.deepEqual({
    ...reply,
    avatar: undefined,
  }, {
    id: 42,
    sender: "Mira",
    isMe: false,
    text: "I’m here — make an account and keep the conversation going.",
    time: "Just now",
    avatar: undefined,
  });
  assert.equal(typeof reply.avatar, "string");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --test-name-pattern "demo"` from `frontend/`

Expected: FAIL because `landingPageContent.js` does not exist.

- [ ] **Step 3: Implement `INITIAL_DEMO_MESSAGES` and `createDemoReply(id)` in `frontend/src/pages/landingPageContent.js`**

Move the current seed messages into the module, revise their names and copy to fit the Common Room conversation, and return the exact reply payload asserted by the test. Keep the avatar values as existing local or HTTPS image strings.

- [ ] **Step 4: Update `LandingPage.jsx` to import the content module**

Replace its local initial-message constant and inline timeout reply object with the exported values. Preserve the existing empty-input guard and state update sequence.

- [ ] **Step 5: Run the focused test to verify it passes**

Run: `npm test -- --test-name-pattern "demo"` from `frontend/`

Expected: PASS with both demo-content tests passing.

- [ ] **Step 6: Commit the isolated demo content**

```bash
git add frontend/src/pages/LandingPage.jsx frontend/src/pages/landingPageContent.js frontend/src/pages/landingPageContent.test.js
git commit -m "test: cover landing demo content"
```

### Task 2: Build the Common Room landing surface

**Files:**
- Modify: `frontend/src/pages/LandingPage.jsx:1-829`
- Modify: `frontend/src/components/Navbar.jsx:1-103`
- Modify: `PLAN.md:1-15`

**Interfaces:**
- Consumes: `INITIAL_DEMO_MESSAGES` and `createDemoReply(id)` from Task 1; `theme` and `setTheme` from `useThemeStore`; `authUser` from `useAuthStore`.
- Produces: an unauthenticated landing route with stable anchors for the demo and theme sections.

- [ ] **Step 1: Remove the generic landing-page patterns**

Delete the ambient glow fields, stat badges, bento-feature grid, technology matrix, generic FAQ, generic badges, and gradient CTA treatment from `LandingPage.jsx`. Remove the matching Stack anchor from `Navbar.jsx`.

- [ ] **Step 2: Compose the Common Room hero and navigation**

Use the exact hero message `Make time for each other.` and supporting copy that identifies Chattap as real-time one-to-one chat. Place a prominent `Link` to `/signup` for unauthenticated visitors; retain the authenticated path to `/`. Build the hero as a responsive asymmetric text-and-thread layout, using warm neutral, ink, and red color roles rather than gradients.

- [ ] **Step 3: Rebuild the demo as the primary proof section**

Retain its message input, send behavior, typing state, and simulated response. Reframe it with sparse editorial labels and believable message fragments; keep `id="interactive-demo"` so existing navigation continues to work.

- [ ] **Step 4: Replace the feature grid with a concise editorial capability story**

Create three varied sections for presence, image sharing, and personal themes. Use message/thread material and short factual copy instead of feature cards, implementation jargon, or metric claims. Keep the themes control section at `id="themes"` and continue rendering the existing `POPULAR_THEMES` controls with their `setTheme(t)` handler.

- [ ] **Step 5: Rebuild the final conversion and footer**

Close with an account-creation invitation that routes to `/signup` when unauthenticated. Keep authentic application, account, and health-check links; remove marketing filler and duplicate promotional copy.

- [ ] **Step 6: Update `PLAN.md` to record the redesign work as in progress**

Add a dated redesign task beneath the completed earlier landing-page work. Do not change historical task completion state.

- [ ] **Step 7: Run static validation**

Run: `npm run lint && npm run build` from `frontend/`

Expected: both commands exit 0.

- [ ] **Step 8: Commit the visual redesign**

```bash
git add frontend/src/pages/LandingPage.jsx frontend/src/components/Navbar.jsx PLAN.md
git commit -m "feat: redesign landing page as common room"
```

### Task 3: Verify the rendered experience and document results

**Files:**
- Modify: `PLAN.md:1-15`

**Interfaces:**
- Consumes: the completed landing route from Task 2 at `/` while unauthenticated.
- Produces: recorded validation status for the redesign.

- [ ] **Step 1: Start the frontend development server**

Run: `npm run dev -- --host 0.0.0.0` from `frontend/`

Expected: Vite serves the app without startup errors.

- [ ] **Step 2: Inspect desktop and mobile renders in a real browser**

At 1440px and 390px widths, check that the hero communicates the product and account action immediately, that no content overflows horizontally, and that the Common Room visual system is consistently applied.

- [ ] **Step 3: Exercise the retained interactions**

Send a non-empty demo message and verify the reply appears; try whitespace-only input and verify nothing is appended; select a theme and verify the active theme updates; keyboard-tab through links, theme buttons, input, and send button to verify visible focus.

- [ ] **Step 4: Run final validation**

Run: `npm test && npm run lint && npm run build` from `frontend/`

Expected: all commands exit 0.

- [ ] **Step 5: Record verified results in `PLAN.md` and review the final diff**

Run: `git diff --check` and `git diff -- frontend/src/pages/LandingPage.jsx frontend/src/pages/landingPageContent.js frontend/src/pages/landingPageContent.test.js frontend/src/components/Navbar.jsx PLAN.md`

Expected: no whitespace errors and no unrelated changes or sensitive data.

- [ ] **Step 6: Commit validation documentation**

```bash
git add PLAN.md
git commit -m "docs: record landing redesign validation"
```

## Self-review

- **Spec coverage:** Tasks 1–2 preserve and reshape the interactive demo and theme picker, replace the existing generic visual language, retain valid navigation, and keep the work inside the existing stack. Task 3 verifies responsiveness, accessibility signals, and retained behavior.
- **Step scan:** Each implementation step names a single artifact or behavior, while validation steps name a concrete command or browser observation.
- **Type consistency:** Task 1 defines the only new module exports; Task 2 imports those exact export names.
- **Review focus:** Empty input, reply generation, conversion routing, theme state, and narrow-viewport behavior all have a named test or browser check in their owning task.
- **Proportion:** The plan specifies only the new module interface, exact required copy, retained anchor names, and verification behavior; it leaves ordinary JSX and Tailwind implementation details to the executor.
