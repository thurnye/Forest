/**
 * Scene Layout Constants for PixiJS Welcome Page
 * All positions, sizes, and styling constants for pixel-perfect tuning
 */

// ===== CANVAS & STAGE =====
export const CANVAS_CONFIG = {
  width: 1920,
  height: 1080,
  backgroundColor: 0x87ceeb, // Sky blue
  antialias: true,
  resolution: window.devicePixelRatio || 1,
};

// ===== COLORS =====
export const COLORS = {
  // Wood textures
  woodDark: 0x8b4513,
  woodMedium: 0xa0522d,
  woodLight: 0xd2691e,
  woodBorder: 0x654321,

  // Backgrounds
  skyBlue: 0x87ceeb,
  grassGreen: 0x228b22,
  waterBlue: 0x4fc3f7,

  // UI Elements
  cream: 0xfff9e6,
  yellow: 0xffd700,
  greenButton: 0x4caf50,
  greenDark: 0x2e7d32,
  orangeButton: 0xff9800,
  orangeDark: 0xf57c00,

  // Text
  textBrown: 0x8b4513,
  textWhite: 0xffffff,
  textDark: 0x333333,
};

// ===== BOARD LAYOUT =====
export const BOARD = {
  // Main board container
  width: 900,
  height: 1000,
  x: 960, // Center of 1920px width
  y: 540, // Center of 1080px height
  borderRadius: 20,
  borderWidth: 6,
  padding: 40,

  // Header sign
  header: {
    width: 700,
    height: 120,
    offsetY: -80,
    fontSize: 64,
    fontFamily: 'Comic Sans MS, cursive',
    fontWeight: 'bold',
    color: COLORS.cream,
  },

  // Welcome text
  welcome: {
    fontSize: 56,
    fontFamily: 'Comic Sans MS, cursive',
    fontWeight: 'bold',
    color: COLORS.textBrown,
    y: 160,
  },

  // Name input
  input: {
    width: 800,
    height: 80,
    y: 250,
    borderRadius: 40,
    fontSize: 28,
    padding: 20,
    iconSize: 40,
  },

  // Role buttons
  buttons: {
    width: 800,
    height: 100,
    gap: 20,
    studentY: 370,
    grownUpY: 490,
    borderRadius: 20,
    fontSize: 32,
    iconSize: 50,
  },

  // Challenge panel
  challenge: {
    width: 800,
    height: 400,
    y: 640,
    borderRadius: 20,
    padding: 24,

    // Title
    titleFontSize: 32,
    titleY: 30,

    // Image preview
    imageWidth: 750,
    imageHeight: 200,
    imageY: 100,

    // Caption
    captionFontSize: 28,
    captionY: 320,

    // Start button
    startButton: {
      width: 300,
      height: 80,
      y: 380,
      fontSize: 32,
    },
  },
};

// ===== OWL CHARACTER =====
export const OWL = {
  x: 1500, // Right side
  y: 750, // Bottom right
  scale: 1.0,

  // Stump
  stumpWidth: 180,
  stumpHeight: 180,
  stumpColor: 0xd2691e,

  // Owl emoji/sprite
  size: 140,
  emoji: '🦉',

  // Animation
  idleBounceSpeed: 2, // seconds per bounce
  idleBounceDistance: 10, // pixels
  hoverScale: 1.1,
  clickScale: 0.95,
};

// ===== FOOTER BUTTONS =====
export const FOOTER = {
  y: 1000,
  buttons: [
    {
      id: 'parents',
      label: '📋 Parents Area',
      x: 400,
      width: 240,
      height: 70,
    },
    {
      id: 'help',
      label: '❓ Help',
      x: 680,
      width: 180,
      height: 70,
    },
    {
      id: 'settings',
      label: '⚙️ Settings',
      x: 900,
      width: 200,
      height: 70,
    },
    {
      id: 'extra-settings',
      label: '⚙️',
      x: 1140,
      width: 70,
      height: 70,
    },
  ],
  fontSize: 22,
  fontFamily: 'Comic Sans MS, cursive',
  fontWeight: 'bold',
  borderRadius: 15,
};

// ===== BACKGROUND LAYERS =====
export const BACKGROUND = {
  // Parallax layers (far to near)
  layers: [
    {
      id: 'sky',
      z: 0,
      parallaxFactor: 0, // No movement
      color: 0x87ceeb,
    },
    {
      id: 'far-mountains',
      z: 1,
      parallaxFactor: 0.1,
      y: 200,
    },
    {
      id: 'far-trees',
      z: 2,
      parallaxFactor: 0.2,
      y: 300,
    },
    {
      id: 'river',
      z: 3,
      parallaxFactor: 0.3,
      y: 500,
    },
    {
      id: 'near-trees',
      z: 4,
      parallaxFactor: 0.5,
      y: 0,
    },
    {
      id: 'foreground',
      z: 5,
      parallaxFactor: 0.7,
      y: 800,
    },
  ],

  // Trees
  trees: {
    leftCount: 3,
    rightCount: 3,
    scale: 1.2,
  },

  // Decorations
  decorations: {
    flowers: ['🌸', '🌼', '🌺', '🌻'],
    butterflies: ['🦋'],
    rocks: ['🪨'],
    mushrooms: ['🍄'],
    count: 15,
  },
};

// ===== PARTICLES =====
export const PARTICLES = {
  sparkles: {
    count: 30,
    emojis: ['✨', '⭐', '🌟', '💫'],
    minSize: 20,
    maxSize: 40,
    minSpeed: 0.5,
    maxSpeed: 2,
    minLifetime: 3,
    maxLifetime: 8,
  },

  leaves: {
    count: 15,
    emoji: '🍃',
    minSize: 25,
    maxSize: 35,
    minSpeed: 0.3,
    maxSpeed: 1.5,
    swayAmount: 20,
  },
};

// ===== ANIMATIONS =====
export const ANIMATIONS = {
  // Hover effects
  hover: {
    scale: 1.05,
    duration: 0.2,
    ease: 'power2.out',
  },

  // Click effects
  click: {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.in',
  },

  // Button glow
  glow: {
    alpha: 0.3,
    duration: 1.5,
    ease: 'sine.inOut',
  },

  // Parallax
  parallax: {
    maxOffset: 50, // pixels
    smoothing: 0.1, // lerp factor
  },
};

// ===== RESPONSIVE BREAKPOINTS =====
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1920,
};

// ===== SCALE FACTORS BY DEVICE =====
export const getScaleFactor = (width: number, height: number) => {
  const scaleX = width / CANVAS_CONFIG.width;
  const scaleY = height / CANVAS_CONFIG.height;
  return Math.min(scaleX, scaleY);
};
