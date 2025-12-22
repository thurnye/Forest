# PixiJS Welcome Page - Reading Forest

## Overview

This is an interactive, game-like welcome page built with **PixiJS** (WebGL) for the Reading Forest application. It features parallax effects, particle systems, interactive animations, and a storybook forest aesthetic.

## Features

### ✨ Visual Features
- **Forest background scene** with trees, rivers, rocks, flowers, and decorations
- **Wooden board UI** with Reading Forest header sign
- **Interactive owl character** with idle animations on a stump
- **Particle system** with floating sparkles and leaves
- **Parallax effect** that responds to mouse movement
- **Smooth animations** powered by GSAP

### 🎮 Interactive Elements
- **Name input field** (HTML overlay for accessibility)
- **Role selection buttons**:
  - "I'm a Student" (green with backpack icon)
  - "I'm a Grown-Up" (orange with clipboard icon)
- **Today's Challenge panel** with Great Wall of China
- **Start button** (enabled when name is entered and role is selected)
- **Footer buttons**: Parents Area, Help, Settings
- **Modal overlays** for each footer button

### 🎨 Effects & Animations
- **Hover effects**: Scale up + glow on all buttons
- **Click effects**: Scale down feedback
- **Idle animations**: Owl bouncing, sparkles floating
- **Parallax**: Background layers move with mouse
- **Selection states**: Yellow highlight for selected role
- **Loading animation**: Bouncing owl when starting

## File Structure

```
src/features/pixi-welcome/
├── constants/
│   └── sceneLayout.ts       # All layout constants and configuration
├── components/
│   ├── SceneCanvas.tsx      # Main PixiJS scene renderer
│   └── HTMLOverlay.tsx      # HTML overlay for input and modals
├── pages/
│   └── PixiWelcomePage.tsx  # Main page component
└── README.md                # This file
```

## Installation & Usage

### Dependencies
The following packages are required (already installed):
- `pixi.js` - Main PixiJS library
- `@pixi/react` - React bindings for PixiJS
- `gsap` - Animation library

### Running the Page
The PixiWelcomePage is automatically shown at the root route `/`.

```bash
npm run dev
```

Navigate to `http://localhost:5173/` to see the welcome page.

## Pixel-Perfect Tuning Guide

All visual constants are centralized in `constants/sceneLayout.ts`. Adjust these values to match the reference screenshot exactly:

### Canvas & Stage
```typescript
CANVAS_CONFIG = {
  width: 1920,        // Design width
  height: 1080,       // Design height
  backgroundColor: 0x87ceeb,  // Sky blue
}
```

### Board Layout
```typescript
BOARD = {
  width: 900,         // Main board width
  height: 1000,       // Main board height
  x: 960,            // Center X position
  y: 540,            // Center Y position
  borderRadius: 20,   // Rounded corners
  borderWidth: 6,     // Border thickness
  padding: 40,        // Internal padding
}
```

### Header Sign
```typescript
header: {
  width: 700,
  height: 120,
  offsetY: -80,      // Position above board
  fontSize: 64,
  fontFamily: 'Comic Sans MS, cursive',
  color: COLORS.cream,
}
```

### Role Buttons
```typescript
buttons: {
  width: 800,
  height: 100,
  gap: 20,
  studentY: 370,     // Student button Y position
  grownUpY: 490,     // Grown-up button Y position
  fontSize: 32,
  iconSize: 50,
}
```

### Owl Character
```typescript
OWL = {
  x: 1500,           // Right side position
  y: 750,            // Bottom right
  size: 140,         // Emoji size
  idleBounceSpeed: 2,      // Bounce animation duration
  idleBounceDistance: 10,  // Bounce height
}
```

### Particles
```typescript
PARTICLES = {
  sparkles: {
    count: 30,       // Number of sparkles
    minSize: 20,
    maxSize: 40,
    minSpeed: 0.5,
    maxSpeed: 2,
  }
}
```

### Colors
```typescript
COLORS = {
  woodDark: 0x8b4513,
  woodMedium: 0xa0522d,
  cream: 0xfff9e6,
  greenButton: 0x4caf50,
  orangeButton: 0xff9800,
  // ... more colors
}
```

## Component Architecture

### SceneCanvas.tsx
The main PixiJS renderer that builds the entire scene:
- **buildBackground()** - Creates forest scenery with trees and decorations
- **buildBoard()** - Creates the wooden board UI container
- **buildOwl()** - Adds the owl character with animations
- **buildFooter()** - Creates footer navigation buttons
- **buildParticles()** - Spawns floating sparkles
- **setupParallax()** - Implements mouse-based parallax effect
- **addButtonEffects()** - Adds hover/click interactions

### HTMLOverlay.tsx
Accessible HTML layer on top of PixiJS:
- **Name input field** - Positioned to match the board design
- **Modal dialogs** - Parents Area, Help, Settings modals
- **Styled with MUI** - But matches the forest aesthetic

### PixiWelcomePage.tsx
Main page component that orchestrates:
- State management (name, role, modals)
- Event handling (role selection, start click, footer clicks)
- Routing logic (navigate to student or parent routes)
- Loading state with owl animation

## Customization

### Changing Assets
To replace emoji placeholders with real images:

1. Add image assets to `src/assets/`
2. Import them in `SceneCanvas.tsx`:
   ```typescript
   import owlImage from '@/assets/owl.png';
   import treeImage from '@/assets/tree.png';
   ```
3. Use `Sprite` instead of `Text` for images:
   ```typescript
   import { Sprite, Texture } from 'pixi.js';

   const owl = Sprite.from(owlImage);
   owl.anchor.set(0.5);
   ```

### Adjusting Responsiveness
The scene automatically scales to fit different screen sizes using `getScaleFactor()`.

To adjust scaling behavior, modify in `SceneCanvas.tsx`:
```typescript
const scale = getScaleFactor(dimensions.width, dimensions.height);
mainContainer.scale.set(scale);
```

### Adding New Animations
Use GSAP for smooth animations:

```typescript
gsap.to(element, {
  y: element.y - 50,
  rotation: Math.PI * 2,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut',
});
```

### Modifying Parallax
Adjust parallax strength in `sceneLayout.ts`:
```typescript
ANIMATIONS = {
  parallax: {
    maxOffset: 50,    // Increase for stronger effect
    smoothing: 0.1,   // Lower for faster response
  }
}
```

## Performance Tips

1. **Reduce particle count** for mobile devices
2. **Disable parallax** on low-end devices
3. **Use sprite sheets** instead of individual images
4. **Limit GSAP animations** to essential elements only
5. **Optimize text rendering** by caching static text as textures

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (macOS/iOS)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires WebGL support (available in all modern browsers).

## Troubleshooting

### Canvas not rendering
- Check browser console for WebGL errors
- Verify `pixi.js` is installed correctly
- Ensure canvas ref is attached

### Animations not working
- Verify GSAP is installed
- Check that `gsap.to()` calls have valid targets
- Ensure elements are added to the stage before animating

### Buttons not clickable
- Set `eventMode: 'static'` on interactive containers
- Ensure `cursor: 'pointer'` is set
- Check z-index layering (HTML overlay should not block)

### Layout doesn't match screenshot
- Adjust constants in `sceneLayout.ts`
- Use browser DevTools to inspect positions
- Test on reference screen size (1920x1080)

## Future Enhancements

- [ ] Add sound effects (using Howler.js)
- [ ] Replace emojis with custom illustrated assets
- [ ] Add more complex particle effects
- [ ] Implement device tilt on mobile for parallax
- [ ] Add accessibility keyboard navigation
- [ ] Optimize for lower-end devices
- [ ] Add loading screen for asset preloading

## Credits

Built with:
- [PixiJS](https://pixijs.com/) - WebGL rendering
- [GSAP](https://greensock.com/gsap/) - Animations
- [React](https://react.dev/) - UI framework
- [Material-UI](https://mui.com/) - Accessible HTML components
