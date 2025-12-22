import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { gsap } from 'gsap';
import {
  CANVAS_CONFIG,
  COLORS,
  BOARD,
  OWL,
  FOOTER,
  PARTICLES,
  ANIMATIONS,
  getScaleFactor,
} from '../constants/sceneLayout';

interface SceneCanvasProps {
  onRoleSelect: (role: 'student' | 'grownup') => void;
  onStartClick: () => void;
  onFooterClick: (button: string) => void;
  isStartEnabled: boolean;
  selectedRole: 'student' | 'grownup' | null;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  onRoleSelect,
  onStartClick,
  onFooterClick,
  isStartEnabled,
  selectedRole,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const mainContainerRef = useRef<Container | null>(null);

  // Refs for callbacks to avoid re-initialization
  const callbacksRef = useRef({
    onRoleSelect,
    onStartClick,
    onFooterClick,
    isStartEnabled,
    selectedRole,
  });

  // Update callbacks ref when props change
  useEffect(() => {
    callbacksRef.current = {
      onRoleSelect,
      onStartClick,
      onFooterClick,
      isStartEnabled,
      selectedRole,
    };
  }, [onRoleSelect, onStartClick, onFooterClick, isStartEnabled, selectedRole]);

  // Initialize PixiJS once
  useEffect(() => {
    if (!canvasRef.current) return;

    let app: Application | null = null;
    let mounted = true;

    const initPixi = async () => {
      try {
        // Create Pixi Application
        app = new Application();

        await app.init({
          canvas: canvasRef.current!,
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundColor: COLORS.skyBlue,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });

        // Check if component is still mounted
        if (!mounted || !app.stage) return;

        appRef.current = app;

        // Calculate scale factor
        const scale = getScaleFactor(window.innerWidth, window.innerHeight);

        // Create main container
        const mainContainer = new Container();
        mainContainer.name = 'mainContainer';
        mainContainer.scale.set(scale);
        app.stage.addChild(mainContainer);
        mainContainerRef.current = mainContainer;

        // Build scene layers
        buildBackground(mainContainer);
        buildBoard(mainContainer, callbacksRef);
        buildOwl(mainContainer);
        buildFooter(mainContainer, callbacksRef);
        buildParticles(mainContainer);

        // Setup parallax
        setupParallax(mainContainer);
      } catch (error) {
        console.error('Failed to initialize PixiJS:', error);
      }
    };

    initPixi();

    // Handle resize
    const handleResize = () => {
      if (app && app.renderer && mainContainerRef.current) {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        const scale = getScaleFactor(window.innerWidth, window.innerHeight);
        mainContainerRef.current.scale.set(scale);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      if (app && app.renderer) {
        app.destroy(true, { children: true });
      }
      appRef.current = null;
      mainContainerRef.current = null;
    };
  }, []); // Empty dependency array - only initialize once

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
};

// ===== BACKGROUND =====
function buildBackground(container: Container) {
  const bgContainer = new Container();
  bgContainer.name = 'background';
  container.addChild(bgContainer);

  // Sky gradient
  const sky = new Graphics();
  sky.rect(0, 0, CANVAS_CONFIG.width, CANVAS_CONFIG.height);
  sky.fill({ color: COLORS.skyBlue });
  bgContainer.addChild(sky);

  // Left trees (foreground)
  for (let i = 0; i < 2; i++) {
    const tree = createTree();
    tree.x = 100 + i * 150;
    tree.y = 100;
    tree.scale.set(1.5);
    bgContainer.addChild(tree);
  }

  // Right trees (foreground)
  for (let i = 0; i < 2; i++) {
    const tree = createTree();
    tree.x = CANVAS_CONFIG.width - 300 + i * 150;
    tree.y = 100;
    tree.scale.set(1.5);
    bgContainer.addChild(tree);
  }

  // River/water
  const river = new Graphics();
  river.rect(0, CANVAS_CONFIG.height - 300, CANVAS_CONFIG.width, 300);
  river.fill({ color: COLORS.waterBlue, alpha: 0.3 });
  bgContainer.addChild(river);

  // Ground decorations
  addDecorations(bgContainer);
}

function createTree() {
  const tree = new Container();

  // Trunk
  const trunk = new Graphics();
  trunk.rect(-20, 0, 40, 150);
  trunk.fill({ color: 0x8b4513 });
  tree.addChild(trunk);

  // Foliage (using emojis via Text)
  const foliage = new Text({
    text: '🌳',
    style: {
      fontSize: 120,
    },
  });
  foliage.anchor.set(0.5, 1);
  foliage.y = -50;
  tree.addChild(foliage);

  return tree;
}

function addDecorations(container: Container) {
  const decorations = ['🌸', '🦋', '🪨', '🍄', '🌻', '🌺'];

  for (let i = 0; i < 20; i++) {
    const deco = new Text({
      text: decorations[Math.floor(Math.random() * decorations.length)],
      style: {
        fontSize: 30 + Math.random() * 30,
      },
    });
    deco.x = 100 + Math.random() * (CANVAS_CONFIG.width - 200);
    deco.y = CANVAS_CONFIG.height - 400 + Math.random() * 350;
    deco.alpha = 0.6 + Math.random() * 0.4;
    container.addChild(deco);
  }
}

// ===== WOODEN BOARD =====
function buildBoard(
  container: Container,
  callbacksRef: React.MutableRefObject<{
    onRoleSelect: (role: 'student' | 'grownup') => void;
    onStartClick: () => void;
    onFooterClick: (button: string) => void;
    isStartEnabled: boolean;
    selectedRole: 'student' | 'grownup' | null;
  }>
) {
  const boardContainer = new Container();
  boardContainer.name = 'board';
  boardContainer.x = BOARD.x;
  boardContainer.y = BOARD.y;
  container.addChild(boardContainer);

  // Main board background
  const board = new Graphics();
  board.roundRect(
    -BOARD.width / 2,
    -BOARD.height / 2,
    BOARD.width,
    BOARD.height,
    BOARD.borderRadius
  );
  board.fill({ color: COLORS.cream });
  board.stroke({ color: COLORS.woodBorder, width: BOARD.borderWidth });
  boardContainer.addChild(board);

  // Header sign
  const headerSign = createHeaderSign();
  headerSign.y = -BOARD.height / 2 + BOARD.header.offsetY;
  boardContainer.addChild(headerSign);

  // "Welcome!" text
  const welcomeText = new Text({
    text: 'Welcome!',
    style: new TextStyle({
      fontSize: BOARD.welcome.fontSize,
      fontFamily: BOARD.welcome.fontFamily,
      fontWeight: BOARD.welcome.fontWeight as any,
      fill: BOARD.welcome.color,
    }),
  });
  welcomeText.anchor.set(0.5);
  welcomeText.y = -BOARD.height / 2 + BOARD.welcome.y;
  boardContainer.addChild(welcomeText);

  // Role buttons (student, grownup)
  const studentButton = createRoleButton(
    'student',
    "I'm a Student",
    '🎒',
    callbacksRef.current.selectedRole === 'student'
  );
  studentButton.y = -BOARD.height / 2 + BOARD.buttons.studentY;
  studentButton.eventMode = 'static';
  studentButton.cursor = 'pointer';
  studentButton.on('pointerdown', () => callbacksRef.current.onRoleSelect('student'));
  addButtonEffects(studentButton);
  boardContainer.addChild(studentButton);

  const grownupButton = createRoleButton(
    'grownup',
    "I'm a Grown-Up",
    '📋',
    callbacksRef.current.selectedRole === 'grownup'
  );
  grownupButton.y = -BOARD.height / 2 + BOARD.buttons.grownUpY;
  grownupButton.eventMode = 'static';
  grownupButton.cursor = 'pointer';
  grownupButton.on('pointerdown', () => callbacksRef.current.onRoleSelect('grownup'));
  addButtonEffects(grownupButton);
  boardContainer.addChild(grownupButton);

  // Challenge panel
  const challengePanel = createChallengePanel(callbacksRef);
  challengePanel.y = -BOARD.height / 2 + BOARD.challenge.y;
  boardContainer.addChild(challengePanel);
}

function createHeaderSign() {
  const sign = new Container();

  // Sign background
  const bg = new Graphics();
  bg.roundRect(
    -BOARD.header.width / 2,
    -BOARD.header.height / 2,
    BOARD.header.width,
    BOARD.header.height,
    15
  );
  bg.fill({ color: COLORS.woodDark });
  bg.stroke({ color: COLORS.woodBorder, width: 4 });
  sign.addChild(bg);

  // Leaves decoration
  const leaves = new Text({
    text: '🍃',
    style: { fontSize: 50 },
  });
  leaves.anchor.set(0.5);
  leaves.y = -BOARD.header.height / 2 - 25;
  sign.addChild(leaves);

  // Title text
  const title = new Text({
    text: 'Reading Forest',
    style: new TextStyle({
      fontSize: BOARD.header.fontSize,
      fontFamily: BOARD.header.fontFamily,
      fontWeight: BOARD.header.fontWeight as any,
      fill: BOARD.header.color,
    }),
  });
  title.anchor.set(0.5);
  sign.addChild(title);

  return sign;
}

function createRoleButton(
  role: string,
  label: string,
  icon: string,
  isSelected: boolean
) {
  const button = new Container();
  button.name = role;

  const color = role === 'student' ? COLORS.greenButton : COLORS.orangeButton;
  const borderColor = role === 'student' ? COLORS.greenDark : COLORS.orangeDark;

  // Button background
  const bg = new Graphics();
  bg.roundRect(
    -BOARD.buttons.width / 2,
    -BOARD.buttons.height / 2,
    BOARD.buttons.width,
    BOARD.buttons.height,
    BOARD.buttons.borderRadius
  );
  bg.fill({ color: isSelected ? COLORS.yellow : color });
  bg.stroke({ color: borderColor, width: 4 });
  button.addChild(bg);

  // Icon
  const iconText = new Text({
    text: icon,
    style: { fontSize: BOARD.buttons.iconSize },
  });
  iconText.anchor.set(0.5);
  iconText.x = -BOARD.buttons.width / 2 + 80;
  button.addChild(iconText);

  // Label
  const labelText = new Text({
    text: label,
    style: new TextStyle({
      fontSize: BOARD.buttons.fontSize,
      fontFamily: 'Comic Sans MS, cursive',
      fontWeight: 'bold',
      fill: 0xffffff,
    }),
  });
  labelText.anchor.set(0.5);
  labelText.x = 50;
  button.addChild(labelText);

  // Star decoration
  const star = new Text({
    text: '⭐',
    style: { fontSize: 30 },
  });
  star.anchor.set(0.5);
  star.x = BOARD.buttons.width / 2 - 50;
  button.addChild(star);

  return button;
}

function createChallengePanel(
  callbacksRef: React.MutableRefObject<{
    onRoleSelect: (role: 'student' | 'grownup') => void;
    onStartClick: () => void;
    onFooterClick: (button: string) => void;
    isStartEnabled: boolean;
    selectedRole: 'student' | 'grownup' | null;
  }>
) {
  const panel = new Container();

  // Panel background
  const bg = new Graphics();
  bg.roundRect(
    -BOARD.challenge.width / 2,
    -BOARD.challenge.height / 2,
    BOARD.challenge.width,
    BOARD.challenge.height,
    BOARD.challenge.borderRadius
  );
  bg.fill({ color: 0xffffff });
  bg.stroke({ color: COLORS.woodDark, width: 3 });
  panel.addChild(bg);

  // Title
  const title = new Text({
    text: "Today's 🌱 Challenge 🎃",
    style: new TextStyle({
      fontSize: BOARD.challenge.titleFontSize,
      fontFamily: 'Comic Sans MS, cursive',
      fontWeight: 'bold',
      fill: COLORS.textBrown,
    }),
  });
  title.anchor.set(0.5);
  title.y = -BOARD.challenge.height / 2 + BOARD.challenge.titleY;
  panel.addChild(title);

  // Challenge image placeholder
  const imageBox = new Graphics();
  imageBox.roundRect(
    -BOARD.challenge.imageWidth / 2,
    -BOARD.challenge.imageHeight / 2,
    BOARD.challenge.imageWidth,
    BOARD.challenge.imageHeight,
    10
  );
  imageBox.fill({ color: 0xffe0b2 });
  imageBox.stroke({ color: COLORS.woodLight, width: 2 });
  imageBox.y = -BOARD.challenge.height / 2 + BOARD.challenge.imageY;
  panel.addChild(imageBox);

  // Castle emoji for Great Wall
  const castle = new Text({
    text: '🏯',
    style: { fontSize: 100 },
  });
  castle.anchor.set(0.5);
  castle.y = imageBox.y;
  panel.addChild(castle);

  // Caption
  const caption = new Text({
    text: 'Explore the Great Wall of China!',
    style: new TextStyle({
      fontSize: BOARD.challenge.captionFontSize,
      fontFamily: 'Comic Sans MS, cursive',
      fontWeight: 'bold',
      fill: COLORS.textDark,
    }),
  });
  caption.anchor.set(0.5);
  caption.y = -BOARD.challenge.height / 2 + BOARD.challenge.captionY;
  panel.addChild(caption);

  // Start button
  const startButton = createStartButton(callbacksRef.current.isStartEnabled);
  startButton.y = -BOARD.challenge.height / 2 + BOARD.challenge.startButton.y;
  startButton.eventMode = callbacksRef.current.isStartEnabled ? 'static' : 'none';
  startButton.cursor = callbacksRef.current.isStartEnabled ? 'pointer' : 'not-allowed';
  if (callbacksRef.current.isStartEnabled) {
    startButton.on('pointerdown', () => callbacksRef.current.onStartClick());
    addButtonEffects(startButton);
  }
  panel.addChild(startButton);

  return panel;
}

function createStartButton(enabled: boolean) {
  const button = new Container();

  const bg = new Graphics();
  bg.roundRect(
    -BOARD.challenge.startButton.width / 2,
    -BOARD.challenge.startButton.height / 2,
    BOARD.challenge.startButton.width,
    BOARD.challenge.startButton.height,
    BOARD.challenge.borderRadius
  );
  bg.fill({ color: enabled ? COLORS.greenButton : 0x999999 });
  bg.stroke({ color: enabled ? COLORS.greenDark : 0x666666, width: 4 });
  button.addChild(bg);

  const label = new Text({
    text: 'Start!',
    style: new TextStyle({
      fontSize: BOARD.challenge.startButton.fontSize,
      fontFamily: 'Comic Sans MS, cursive',
      fontWeight: 'bold',
      fill: 0xffffff,
    }),
  });
  label.anchor.set(0.5);
  button.addChild(label);

  button.alpha = enabled ? 1 : 0.5;

  return button;
}

// ===== OWL =====
function buildOwl(container: Container) {
  const owlContainer = new Container();
  owlContainer.name = 'owl';
  owlContainer.x = OWL.x;
  owlContainer.y = OWL.y;
  container.addChild(owlContainer);

  // Stump
  const stump = new Graphics();
  stump.circle(0, 0, OWL.stumpWidth / 2);
  stump.fill({ color: OWL.stumpColor });
  stump.stroke({ color: COLORS.woodBorder, width: 4 });
  owlContainer.addChild(stump);

  // Owl
  const owl = new Text({
    text: OWL.emoji,
    style: { fontSize: OWL.size },
  });
  owl.anchor.set(0.5);
  owl.y = -50;
  owlContainer.addChild(owl);

  // Idle animation
  gsap.to(owl, {
    y: owl.y - OWL.idleBounceDistance,
    duration: OWL.idleBounceSpeed,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

// ===== FOOTER =====
function buildFooter(
  container: Container,
  callbacksRef: React.MutableRefObject<{
    onRoleSelect: (role: 'student' | 'grownup') => void;
    onStartClick: () => void;
    onFooterClick: (button: string) => void;
    isStartEnabled: boolean;
    selectedRole: 'student' | 'grownup' | null;
  }>
) {
  const footerContainer = new Container();
  footerContainer.name = 'footer';
  container.addChild(footerContainer);

  FOOTER.buttons.forEach((btnConfig) => {
    const button = createFooterButton(btnConfig.label, btnConfig.width, btnConfig.height);
    button.x = btnConfig.x;
    button.y = FOOTER.y;
    button.eventMode = 'static';
    button.cursor = 'pointer';
    button.on('pointerdown', () => callbacksRef.current.onFooterClick(btnConfig.id));
    addButtonEffects(button);
    footerContainer.addChild(button);
  });
}

function createFooterButton(label: string, width: number, height: number) {
  const button = new Container();

  const bg = new Graphics();
  bg.roundRect(-width / 2, -height / 2, width, height, FOOTER.borderRadius);
  bg.fill({ color: COLORS.woodDark });
  bg.stroke({ color: COLORS.woodBorder, width: 3 });
  button.addChild(bg);

  const text = new Text({
    text: label,
    style: new TextStyle({
      fontSize: FOOTER.fontSize,
      fontFamily: FOOTER.fontFamily,
      fontWeight: FOOTER.fontWeight as any,
      fill: 0xffffff,
    }),
  });
  text.anchor.set(0.5);
  button.addChild(text);

  return button;
}

// ===== PARTICLES =====
function buildParticles(container: Container) {
  const particleContainer = new Container();
  particleContainer.name = 'particles';
  container.addChild(particleContainer);

  // Sparkles
  for (let i = 0; i < PARTICLES.sparkles.count; i++) {
    const sparkle = createSparkle();
    particleContainer.addChild(sparkle);
  }
}

function createSparkle() {
  const emojis = PARTICLES.sparkles.emojis;
  const sparkle = new Text({
    text: emojis[Math.floor(Math.random() * emojis.length)],
    style: {
      fontSize:
        PARTICLES.sparkles.minSize +
        Math.random() * (PARTICLES.sparkles.maxSize - PARTICLES.sparkles.minSize),
    },
  });

  sparkle.x = Math.random() * CANVAS_CONFIG.width;
  sparkle.y = Math.random() * CANVAS_CONFIG.height;
  sparkle.alpha = 0.3 + Math.random() * 0.4;

  // Float animation
  const duration =
    PARTICLES.sparkles.minLifetime +
    Math.random() * (PARTICLES.sparkles.maxLifetime - PARTICLES.sparkles.minLifetime);

  gsap.to(sparkle, {
    y: sparkle.y - 50 - Math.random() * 100,
    alpha: 0,
    duration: duration,
    repeat: -1,
    ease: 'sine.inOut',
  });

  return sparkle;
}

// ===== PARALLAX =====
function setupParallax(container: Container) {
  const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    const bg = container.getChildByName('background');
    if (bg) {
      gsap.to(bg, {
        x: x * ANIMATIONS.parallax.maxOffset * 0.3,
        y: y * ANIMATIONS.parallax.maxOffset * 0.3,
        duration: 1,
        ease: 'power2.out',
      });
    }
  };

  window.addEventListener('mousemove', handleMouseMove);
}

// ===== INTERACTION EFFECTS =====
function addButtonEffects(button: Container) {
  button.on('pointerenter', () => {
    gsap.to(button.scale, {
      x: ANIMATIONS.hover.scale,
      y: ANIMATIONS.hover.scale,
      duration: ANIMATIONS.hover.duration,
      ease: ANIMATIONS.hover.ease,
    });
  });

  button.on('pointerleave', () => {
    gsap.to(button.scale, {
      x: 1,
      y: 1,
      duration: ANIMATIONS.hover.duration,
      ease: ANIMATIONS.hover.ease,
    });
  });

  button.on('pointerdown', () => {
    gsap.to(button.scale, {
      x: ANIMATIONS.click.scale,
      y: ANIMATIONS.click.scale,
      duration: ANIMATIONS.click.duration,
      ease: ANIMATIONS.click.ease,
    });
  });

  button.on('pointerup', () => {
    gsap.to(button.scale, {
      x: 1,
      y: 1,
      duration: ANIMATIONS.click.duration,
      ease: ANIMATIONS.click.ease,
    });
  });
}
