You are a senior frontend engineer and UI implementer. I have provided a screenshot image of the exact UI to build. You MUST match the UI exactly as shown in the image (pixel-perfect as close as possible): layout, spacing, sizing, typography, colors, shadows, gradients, icon placement, and the overall “storybook forest” style.

REQUIRED TECH STACK

React 18 + TypeScript (Vite)

PixiJS (WebGL) for the “kid world scene”

@pixi/react for React integration

Optional: GSAP for tweens, Howler for sound

Use MUI only if you need an accessible HTML input/modal overlay, but the design must still match the screenshot (do not use default MUI styling).

PRIMARY RULE

The screenshot is the source of truth.
Do not invent a different layout. Do not simplify. Do not “approximate with a generic form.” Build the same scene composition.

What to Build (based on screenshot)

Recreate this interactive login page:

Forest background scene (lush trees, river, rocks, flowers, sparkles)

Centered wooden board UI with:

Header wood sign: “Reading Forest”

“Welcome!”

Name input bar with placeholder: “Enter Your Name” + search icon on the left

Two large buttons:

Green: “I’m a Student” with backpack icon on the left + sparkle accents on right

Orange: “I’m a Grown-Up” with clipboard/pencil icon on the left + sparkle accents on right

“Today’s Challenge” panel with a small badge/icon near the title

Preview image and caption: “Explore the Great Wall of China!”

Large green “Start!” button at the bottom of the board

Right-side owl character sitting on a stump (cute, waving)

Bottom footer buttons on wood tabs:

“Parents Area” (lock icon)

“Help” (question icon)

“Settings” (gear icon)

plus an additional gear icon button at far right

Interactivity Requirements (game-like)
Scene movement

Implement parallax: background layers move subtly with mouse movement (desktop) and device tilt/drag fallback (mobile).

Sparkles/particles float gently.

Hover + click feedback

All buttons and interactive elements must:

glow slightly on hover

scale up slightly (≈ 1.02)

use hand cursor on hover

Click behaviors

Clicking I’m a Student:

selects role = student (show selected state exactly in the style of the UI)

triggers owl reaction (wave + bounce)

Clicking I’m a Grown-Up:

selects role = grown-up

triggers different owl reaction (blink + nod or bounce)

Start!:

disabled until name is entered AND role selected

on click: show a “loading” micro animation (button press + shimmer) then route to /student or /parent depending on role (use placeholder pages).

Footer:

Parents Area opens a modal overlay panel

Help opens a modal overlay panel

Settings opens a modal overlay panel

Idle animations

Owl: subtle breathing/bobbing idle loop

Leaves near header: gentle sway

Sparkles: slow drift

Rendering Strategy (must follow)

Use PixiJS for the scene:

Background layers: far/mid/near

Board container (center)

Owl container (right)

Particle/sparkles container

Use HTML overlay ONLY for:

The name input field (for accessibility + mobile keyboard reliability)

Modal dialogs (Parents / Help / Settings)

Everything else should be visually integrated with Pixi so it still feels like a game.

Responsiveness

Must preserve the screenshot composition at common sizes (mobile, tablet, desktop).

Use a “cover” approach: scale the Pixi stage to fill while keeping the board centered.

Owl stays anchored to the right of the board.

Assets

I am not providing layered design files. You must:

Either (A) recreate UI shapes using Pixi Graphics + textures

Or (B) slice the screenshot into reusable assets (ONLY if necessary) and document how to replace with real layered assets later.

Structure your code so I can drop in real art assets later without refactoring:

assets/ folder

sceneLayout.ts constants for all positions/sizes

SceneCanvas.tsx renders Pixi layers based on layout constants

Deliverables

A complete working React + TS + Vite project with all code.

Folder structure + code for:

SceneCanvas (Pixi scene)

LoginOverlay (HTML input and modals)

Event bridge between Pixi and React state

Routing to placeholder pages

Installation + run instructions

A pixel-perfect tuning guide: list the constants to tweak (board position, scales, font sizes, padding, button sizes) to match the screenshot exactly.

Quality Bar

Must compile and run immediately.

Must match the screenshot visually.

Must feel interactive and polished.

No generic UI. No default MUI look.

Now build it.