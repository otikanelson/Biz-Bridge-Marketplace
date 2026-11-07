# BizBridge Motion System

A consistent, accessible, and performant animation system for the BizBridge marketplace.

## Core Principles

1. **Performance First**: Only animate `transform` and `opacity` (GPU-accelerated)
2. **Accessibility**: Respect `prefers-reduced-motion` - zero movement for users who need it
3. **Subtlety**: Animations enhance, never distract or block interaction
4. **Consistency**: Shared timing tokens and variants prevent animation chaos
5. **Progressive Enhancement**: Content is readable immediately, animations add polish

## Technology Stack

- **framer-motion** with `LazyMotion` + `domAnimation` for minimal bundle impact
- **MotionConfig** with `reducedMotion="user"` at app root
- Custom hooks and wrapper components for common patterns

## Motion Tokens

### Durations
```js
fast:   150ms  // Micro-interactions, hovers, focus states
base:   250ms  // Default for most transitions
slow:   400ms  // Page transitions, complex reveals
```

### Easing
```js
easeOutExpo: cubic-bezier(0.22, 1, 0.36, 1)  // All animations use this
```

### Variants (framer-motion)
Exported from `src/utils/motion.js`:
- `fadeIn` - Simple opacity fade
- `fadeUp` - Fade + 8px upward slide
- `scaleIn` - Scale from 0.96 to 1 with fade
- `slideFromLeft` - Horizontal slide + fade (for step navigation)
- `slideFromRight` - Horizontal slide + fade (for step navigation)
- `staggerContainer` - Parent for staggered children (80ms delay)

### CSS Keyframes
Defined in `src/styles/motion.css`:
- `fade-in` - Opacity 0 to 1
- `slide-up` - Transform + fade from below
- `scale-in` - Scale + fade from 96%
- `shimmer` - Loading shimmer sweep
- `shake` - Horizontal shake for errors
- `pop` - Quick scale bounce for success
- `float` - Gentle up/down for empty states (infinite, reduced-motion off)

## Component Patterns

### Reveal on Scroll
```jsx
<Reveal delay={0.1} stagger={0.08}>
  <h2>Content fades up when scrolled into view</h2>
</Reveal>
```

### Page Transitions
```jsx
<AnimatePresence mode="wait">
  <m.div key={location.pathname} variants={fadeUp}>
    <Routes>...</Routes>
  </m.div>
</AnimatePresence>
```

### Interactive Elements
- **Hover**: lift 4px with shadow transition (200ms)
- **Press**: scale to 0.97 (150ms)
- **Focus**: ring expands smoothly (200ms)

### Loading States
- Use skeleton loaders with shimmer, never full-page spinners on lists
- In-button spinners replace label without changing width
- Route changes show thin top progress bar

### Status Changes
- Badges and status text crossfade (250ms)
- Success states show animated check icon before proceeding

### Modals & Dialogs
- Backdrop fades (250ms)
- Panel scales from 0.96 with fade (250ms)
- Exit animation completes before unmount

## Rules

### What to Animate
✅ Opacity changes  
✅ Transform (translate, scale, rotate)  
✅ Colors and borders  
✅ Accordion height (via framer's `animate: "height"`)  

### What NOT to Animate
❌ Width, height (except accordions)  
❌ Top, left, right, bottom  
❌ Margin, padding  
❌ Font size  

### Duration Limits
- Minimum: 150ms (anything faster feels glitchy)
- Maximum: 400ms (anything slower feels sluggish)
- No infinite animations except loading indicators and one float on empty states

### Performance Targets
- No layout shift (CLS = 0)
- No animation blocks interaction
- Works smoothly on low-end Android phones
- Bundle increase < 40KB gzipped
- Skip animations on lists > 12 items (or virtualise)

## Reduced Motion Support

Users with `prefers-reduced-motion: reduce` get:
- ✅ Instant content display
- ✅ Simple opacity fades only
- ✅ No movement, no scale, no slide
- ✅ No count-up animations
- ✅ Instant accordions

Implemented via:
```jsx
<MotionConfig reducedMotion="user">
```

And in CSS:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Usage Examples

### Cards
```jsx
<m.div
  variants={fadeUp}
  whileHover={{ y: -4 }}
  whileTap={{ scale: 0.98 }}
>
  <ServiceCard />
</m.div>
```

### Form Errors
```jsx
<AnimatePresence>
  {error && (
    <m.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="error-message shake"
    >
      {error}
    </m.div>
  )}
</AnimatePresence>
```

### Multi-Step Forms
```jsx
<AnimatePresence mode="wait" custom={direction}>
  <m.div
    key={currentStep}
    variants={direction > 0 ? slideFromRight : slideFromLeft}
  >
    <StepContent />
  </m.div>
</AnimatePresence>
```

## Testing Checklist

- [ ] Enable "Reduce motion" in OS - verify zero movement
- [ ] Test on throttled CPU (6x slowdown) - no jank
- [ ] Check bundle size impact < 40KB gzipped
- [ ] Verify no layout shift (CLS = 0)
- [ ] Focus states remain visible during animations
- [ ] Keyboard navigation works smoothly
- [ ] Touch gestures feel responsive (< 100ms feedback)

## Future Considerations

- View transitions API when browser support improves
- Haptic feedback on mobile for key interactions
- Sound effects toggle for accessibility (currently none)
