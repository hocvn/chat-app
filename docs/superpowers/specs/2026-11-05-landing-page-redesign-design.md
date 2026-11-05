# Chattap landing-page redesign

## Intent

Make the unauthenticated landing page feel like a real place for friends and small communities to start a private conversation—not a generated feature catalogue. The page should persuade a first-time visitor to create an account while retaining the interactive chat demo and live theme picker.

## Goals

- Replace the current gradient-heavy, bento-card aesthetic with an authored and memorable visual system.
- Lead with the human value of making time for people, then demonstrate the product in action.
- Make account creation the primary visitor action.
- Preserve working routes, authentication behavior, the chat simulation, and theme switching.
- Keep the page responsive and accessible.

## Non-goals

- No changes to the backend, chat behavior, or DaisyUI theme architecture.
- No fabricated testimonials, statistics, performance claims, or commercial proof.
- No redesign of authenticated application screens.

## Constraints

- Continue using the existing React, Tailwind CSS, DaisyUI, and Lucide stack.
- Preserve accurate product claims: real-time one-to-one messaging, live presence, image sharing, profile customization, and theme selection.
- Reuse the existing public assets where appropriate; do not require new external dependencies.

## Approaches considered

1. **The Intercom** — A direct, high-contrast communication system where the chat demo is a literal “open line.” It is clear and forceful, but its technical, architectural vocabulary risks making the app feel utilitarian rather than social.
2. **Contact Sheet** — A people-first entry focused on friends’ identities and availability. It humanizes the product but makes the primary messaging experience secondary.
3. **Common Room (chosen)** — A warm, spare editorial composition built from believable conversation fragments. The landing page reads as an invitation to make time for people, with the live demo acting as concrete proof and the theme picker as personal expression. This best aligns with the audience and sign-up goal without becoming a generic chat SaaS page.

## Experience direction

### Visual world

Use a warm paper-like neutral ground, dark ink typography, a confident red primary action, and a limited supporting palette. Build a purposeful asymmetrical editorial rhythm rather than stacking centered sections and uniform cards. Message snippets, presence dots, and thread details become the visual material; they must read as interface evidence, not decoration.

### First viewport

The nav is quiet and compact. The main statement, “Make time for each other,” sits in an oversized left-hand column with a direct sign-up action. A tilted but usable live message thread occupies the right side, immediately showing a real exchange and online status. The page should state that it is one-to-one real-time chat in the supporting copy without relying on jargon or unverified performance numbers.

### Content sequence

1. Opening invitation and account-creation action, paired with live conversation proof.
2. Interactive simulated chat demo, given room to feel like the product rather than a dashboard-in-a-card.
3. A concise capability story: presence, image sharing, and personal themes, using varied editorial layouts instead of a feature grid.
4. Theme picker framed as a “make it yours” moment.
5. A simple closing invitation to join and start a conversation.

### Interaction

The simulated chat retains message entry and response behavior. Theme selection remains live and keyboard-accessible. Motion is restrained: one deliberate thread/presence cue and clear interaction feedback, with no ambient pulses, floating glow, or repeated hover theatrics.

## Acceptance criteria

- `LandingPage.jsx` has a coherent Common Room design rather than the existing gradient, badge, bento-card, and tech-stack pattern.
- The landing page still provides working links to sign up, log in, settings, and in-page sections.
- The interactive demo accepts a message and renders its simulated reply.
- Selecting a theme still updates the active app theme.
- The page is usable at desktop and mobile widths and respects focus states and readable contrast.
- The frontend lint and production build pass.
