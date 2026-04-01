# Design System Strategy: Eco-Premium & Soft Layering

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **Eco-Premium Layering**. We are moving away from sharp, editorial, data-dense brutalism into a highly polished, consumer-grade experience (think Stripe or Linear mixed with a fresh, modern plant/nature aesthetic). 

The UI must feel organic, approachable, and highly refined. It utilizes overlapping layers, significant 16px-28px border radii, soft tinted drop shadows, and glassmorphism.

---

## 2. Color & Surface Philosophy

### The Refined Green Palette
- **Primary Accent:** `#22C55E` (Vibrant Green)
- **Secondary Accent:** `#4ADE80` (Bright Green)
- **Deep Accent:** `#16A34A` (Darker Green for text/active states)
- **Canvas Edge / Background:** `#F0FDF4` (Extremely light green tint, never pure white for the base)
- **Surface Container Lowest:** `#FFFFFF` (Pure white for foreground cards, usually with a shadow)

### Text Hierarchy
- **Primary Text:** `#111827` (Deep Gray - headers, primary data)
- **Secondary Text:** `#6B7280` (Muted Gray - metadata, timestamps)

### Status Semantic Colors
- **Severity High:** Soft Red (e.g., `#EF4444` background with `#FEF2F2` tint)
- **Severity Medium:** Amber (e.g., `#F59E0B` background with `#FFFBFB` tint)
- **Severity Low:** Accent Green (`#22C55E`)

### Core Rules for Depth & Glass
1. **Never use pure flat layouts.** Every major section or component must be a "Card" floating above the `#F0FDF4` canvas.
2. **Heavy Border Radius:** All cards, buttons, and images use `16px` to `28px` corner radiuses (`rounded-2xl` or `rounded-[28px]`). Sharp edges (`rounded-sm` or `0px`) are BANNED.
3. **Soft Elevation (Shadows):** Use diffused, tinted shadows (e.g., `box-shadow: 0 20px 40px -10px rgba(34, 197, 94, 0.08)`) to create lift without dirtying the UI with harsh black shadows.
4. **Glassmorphism:** Navigation bars, sticky elements, and floating action panels must use `backdrop-blur-xl` combined with an `80%` opaque white or `80%` primary background.

---

## 3. Component Stylings

### Typography
- We use clean, modern geometric/neo-grotesque sans-serif fonts (like Inter or Plus Jakarta Sans). 
- Font weights should be distinct: strict `700/800` for titles, `500` for buttons, and `400` for body. 

### Cards (The Core Element)
- All cards must have internal padding of at least `16px` or `20px` (`p-4` or `p-5`).
- Images inside cards must also be rounded (`rounded-xl` or `12px`).
- Include mini semantic elements: "Pill" shapes (`rounded-full`) for status indicators, timestamps in small muted gray text.

### Buttons & Pills
- **Primary Buttons:** Must use a gradient fill from `#4ADE80` to `#22C55E` (top-left to bottom-right). Always `rounded-full` or `rounded-xl`. 
- **Tags/Hashtags:** Soft background tint (e.g., `#F0FDF4` or `white` over an existing surface) with a very subtle 1px border.

### Micro-Interactions (Visual Prompts)
- Elements should appear to hover and react smoothly. When describing elements to the LLM agent, emphasize `transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20`.

---

## 4. Anti-Patterns (BANNED)
- NO sharp 1px grid-lines for overall layout structures (unlike the previous Ledger style).
- NO pure black backgrounds or hard dark-modes unless specifically requested.
- NO thick, opaque gray borders inside cards. Use depth and spacing instead.
- NO default HTML inputs. All inputs must be rounded, with floating labels or distinct icon-based padding.
