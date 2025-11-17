# 🎨 Design System Reference

## Quick Color Guide

### Primary Colors
```
Sky Blue (Primary)
  Light:    #e0f2fe  (backgrounds)
  Main:     #0ea5e9  (buttons, highlights)
  Dark:     #0284c7  (hover states)

Slate Gray (Neutral)
  Light:    #f1f5f9  (backgrounds)
  Main:     #64748b  (body text)
  Dark:     #1e293b  (headings)
```

### Status Colors
```
✅ Success Green:    #22c55e (completed, good)
⚠️  Warning Orange:   #f59e0b (pending, needs attention)
❌ Error Red:        #ef4444 (failed, delete)
ℹ️  Info Blue:       #3b82f6 (information, help)
```

## Typography

### Font Sizes
```
Headings:
  h1: 36px (page title)
  h2: 30px (section title)
  h3: 24px (subsection)
  h4: 20px (card title)

Body Text:
  Large: 18px (important info)
  Base:  16px (normal text)
  Small: 14px (helper text)
  Tiny:  12px (labels, hints)
```

### Font Weights
```
Light:      300  (secondary text)
Normal:     400  (body text)
Medium:     500  (labels, labels)
Semibold:   600  (emphasis, buttons)
Bold:       700  (headings)
```

## Spacing (8px Grid)

```
xs:   4px   (tight spacing)
sm:   8px   (default padding)
md:  16px   (card padding)
lg:  24px   (section spacing)
xl:  32px   (major sections)
2xl: 40px   (page spacing)
3xl: 48px   (large gaps)
4xl: 64px   (section dividers)
```

## Component Sizing

```
Button Height:      40px
Input Height:       38px
Header Height:      64px
Sidebar Width:      256px
Icon (small):       16px
Icon (normal):      20px
Icon (large):       24px
```

## Border Radius

```
Full:       100% (circular)
Large:      12px (large cards)
Medium:     8px  (inputs, buttons)
Small:      4px  (small elements)
None:       0px  (square)
```

## Shadows

```
None:       no shadow
XS:         subtle (1px shadow)
Small:      light (2px shadow)
Base:       normal (6px shadow)
Medium:     pronounced (15px shadow)
Large:      strong (25px shadow)
```

## Common Patterns

### Button Variants

**Primary Button** (main actions)
```
Background: #0ea5e9 (sky-500)
Text:       white
Hover:      #0284c7 (sky-600)
Padding:    12px 16px
Border Radius: 8px
```

**Secondary Button** (alternate actions)
```
Background: #f1f5f9 (slate-100)
Text:       #475569 (slate-600)
Hover:      #e2e8f0 (slate-200)
Padding:    12px 16px
Border Radius: 8px
```

**Ghost Button** (minimal actions)
```
Background: transparent
Text:       #475569 (slate-600)
Hover:      #f1f5f9 (slate-100)
Padding:    8px 12px
Border Radius: 6px
```

### Card Pattern
```
Background: white
Border:     1px solid #e2e8f0 (slate-200)
Shadow:     0 4px 6px rgba(0,0,0,0.1)
Padding:    24px
Border Radius: 8px
Margin:     16px bottom
```

### Input Pattern
```
Background: white
Border:     1px solid #cbd5e1 (slate-300)
Text Color: #1e293b (slate-800)
Placeholder: #94a3b8 (slate-400)
Padding:    12px
Height:     38px
Border Radius: 6px
Focus:      border-color: #0ea5e9, outline: none
```

### Responsive Breakpoints

```
Mobile:     0px - 639px     (single column)
Tablet:     640px - 1023px  (2 columns)
Desktop:    1024px+         (3+ columns)
Large:      1280px+         (full width)
XL:         1536px+         (max content width)
```

## Animation Timings

```
Fast:       150ms  (subtle interactions)
Normal:     250ms  (standard transitions)
Slow:       350ms  (important animations)
```

## Common Grid Patterns

```
One Column:     grid-cols-1
Two Columns:    grid-cols-2 (gap-4)
Three Columns:  grid-cols-3 (gap-6)

Responsive:
  Mobile:  grid-cols-1
  Tablet:  grid-cols-2
  Desktop: grid-cols-3
```

## Status Badge Colors

```
Assigned:   sky-100 background, sky-700 text
Submitted:  green-100 background, green-700 text
Checked:    blue-100 background, blue-700 text
Pending:    orange-100 background, orange-700 text
Completed:  green-100 background, green-700 text
```

## Navigation Styling

```
Active Link:
  Background: #e0f2fe (sky-100)
  Text:       #0369a1 (sky-700)
  Font:       600 (semibold)

Inactive Link:
  Text:       #475569 (slate-600)
  Hover:      #f1f5f9 (slate-100)

Current Page:
  Underline:  3px solid #0ea5e9 (sky-500)
  Weight:     600 (semibold)
```

---

## Implementation Examples

### Using the Design System

**In Tailwind Classes:**
```tsx
// Button (primary)
className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 
           text-white font-semibold rounded-lg 
           transition-colors duration-250"

// Card
className="bg-white border border-slate-200 rounded-lg 
           shadow-md p-6 space-y-4"

// Responsive Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Text Hierarchy
className="text-3xl font-bold text-slate-800"  {/* Heading */}
className="text-base text-slate-700"           {/* Body */}
className="text-sm text-slate-600"             {/* Label */}
```

**In React Components:**
```tsx
import { DESIGN_SYSTEM } from "../constants";

// Access colors
const primaryColor = DESIGN_SYSTEM.colors.primary[500];

// Access sizes
const buttonHeight = DESIGN_SYSTEM.sizes.buttonHeight; // "2.5rem"

// Access spacing
const padding = DESIGN_SYSTEM.spacing.md; // "1rem"
```

---

**Design System Version**: 1.0  
**Last Updated**: November 17, 2025  
**Status**: Production Ready ✅
