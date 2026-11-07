---
inclusion: auto
name: animation-guidelines
description: Motion design system rules for consistent, accessible, performant animations across BizBridge
---

# Motion System Guidelines

When adding or modifying animations in the BizBridge frontend, follow these rules:

## Core Rules

1. **Only animate `transform` and `opacity`** - Never animate width, height, top, left, margin, or padding (except accordion height via framer-motion's auto feature)

2. **Use shared tokens** - Import from `src/utils/motion.js` or use Tailwind classes with motion tokens. Never invent new durations or easing curves.
   - `fast`: 150ms
   - `base`: 250ms (default)
   - `slow`: 400ms
   - Easing: `cubic-bezier(0.22, 1, 0.36, 1)`

3. **Respect reduced motion** - All animations MUST have a reduced-motion fallback:
   ```jsx
   <MotionConfig reducedMotion="user"> // Already at app root
   ```
   - No movement for users with `prefers-reduced-motion: reduce`
   - Simple opacity fades only, no slides/scales
   - Count-ups show final value instantly

4. **No layout shift** - Animations must not cause Cumulative Layout Shift. Reserve space for content before animating it in.

5. **Duration limits**: 150ms minimum, 400ms maximum. Anything outside this range feels wrong.

6. **No blocking** - Animations must never delay interaction or content readability.

## Common Patterns

### Reveal on scroll
```jsx
import { Reveal } from '../components/motion/Reveal';

<Reveal>
  <SectionContent />
</Reveal>
```

### Interactive cards
```jsx
import { m } from 'framer-motion';
import { fadeUp } from '../utils/motion';

<m.div variants={fadeUp} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
  <Card />
</m.div>
```

### Form errors
```jsx
<AnimatePresence>
  {error && (
    <m.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="animate-shake"
    >
      {error}
    </m.div>
  )}
</AnimatePresence>
```

### Modals
```jsx
<AnimatePresence>
  {isOpen && (
    <>
      <m.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <m.div variants={scaleIn}>
        <DialogContent />
      </m.div>
    </>
  )}
</AnimatePresence>
```

## Performance

- Animations must work smoothly on low-end Android phones
- Large lists (> 12 items): skip animation or virtualise
- No heavy blur effects on mobile
- Keep bundle increase < 40KB gzipped (use LazyMotion)

## Accessibility

- Focus states remain visible during animations
- Keyboard navigation never lags
- Screen readers announce state changes, not animations
- Infinite animations only for loading indicators

## See Full Documentation

Complete token reference, variants, and examples: `docs/motion.md`
