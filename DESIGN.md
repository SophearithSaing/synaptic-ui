---
name: Synaptic Academic
colors:
  surface: '#f7fafc'
  surface-dim: '#d7dadc'
  surface-bright: '#f7fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f6'
  surface-container: '#ebeef0'
  surface-container-high: '#e5e9eb'
  surface-container-highest: '#e0e3e5'
  on-surface: '#181c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f87'
  primary: '#00091b'
  on-primary: '#ffffff'
  primary-container: '#002045'
  on-primary-container: '#7089b3'
  inverse-primary: '#aec7f5'
  secondary: '#545f72'
  on-secondary: '#ffffff'
  secondary-container: '#d8e3fa'
  on-secondary-container: '#5a6578'
  tertiary: '#160400'
  on-tertiary: '#ffffff'
  tertiary-container: '#3c1400'
  on-tertiary-container: '#b97858'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f5'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2e476e'
  secondary-fixed: '#d8e3fa'
  secondary-fixed-dim: '#bcc7dd'
  on-secondary-fixed: '#111c2c'
  on-secondary-fixed-variant: '#3c4759'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb692'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#6c391e'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Source Serif 4
    fontSize: 42px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 26px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  unit: 8px
  margin-mobile: 16px
  gutter: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
  container-max: 1140px
---

## Brand & Style
Synaptic Academic is a platform designed for serious learning and technical mastery. The brand personality is **Academic, Structured, and Authoritative**, blending the traditional feel of a research institution with the efficiency of modern software engineering tools.

The visual style is **Modern-Institutional**, characterized by high-contrast primary colors against clean, low-saturation surfaces. It utilizes a structured grid, clear horizontal dividers, and a focus on typographic hierarchy rather than decorative flourishes. The design avoids shadows and heavy gradients in favor of **flat, border-defined containers** (Brutalist-lite) to maintain a focused and professional atmosphere suitable for complex subjects like distributed systems and backend engineering.

## Colors
The color palette is anchored by a deep navy **Primary** (#002045), used for critical branding, navigation highlights, and primary actions. This is paired with a systematic range of **Neutral Grays** that define the structural boundaries of the app.

- **Background & Surfaces:** The main background uses a cool, off-white (#f7fafc). Elevated content lives on pure white (#ffffff) containers to provide subtle contrast without relying on elevation shadows.
- **Outlines:** A consistent light gray (#c4c6cf) is used for borders and horizontal rules, reinforcing the academic "ledger" feel.
- **Semantic Text:** Body text remains close to black for maximum legibility, while metadata and secondary labels use a muted variant (#43474e).

## Typography
The system uses a triple-font approach to categorize information:
1. **Source Serif 4 (Headlines):** Provides an intellectual, traditional weight to titles and section headers.
2. **Inter (Interface & Body):** A clean, neutral sans-serif used for core content and general UI labels to ensure high readability.
3. **JetBrains Mono (Technical Labels):** Used for metadata, status indicators, and small tags to evoke a technical, developer-centric environment.

**Hierarchy Note:** Headlines should always utilize the Serif font to maintain brand character. Labels should be uppercase when using JetBrains Mono for a "tag" appearance.

## Layout & Spacing
The layout follows a **Fixed-Width Grid** model with a maximum container width of 1140px, centered on the screen. 

- **Vertical Rhythm:** Sections are separated by large gaps (`stack-lg`), while internal card content uses a 12px/24px rhythm. 
- **Grid:** On desktop, use a 12-column grid. Topic cards typically span 6 columns (2-up) for in-progress items and 4 columns (3-up) for catalog views.
- **Margins:** Mobile uses a tight 16px side margin, increasing to a 24px gutter on tablets and desktops.
- **Alignment:** All sections should begin with a Serif headline followed by a full-width horizontal divider (`border-b`).

## Elevation & Depth
This system is **Flat**. Hierarchy is achieved through color-blocking and borders rather than shadows.

- **Surfaces:** Use `surface-container-lowest` (#ffffff) for all interactive cards.
- **Borders:** All cards and sections must have a 1px solid border using `outline-variant`. 
- **State Change:** Interactive elements (like catalog cards) should transition their border color to `primary` on hover, rather than lifting or glowing.
- **Dividers:** Use horizontal rules to separate logical groups, effectively "flattening" the depth into a clean, ledger-like appearance.

## Shapes
The shape language is **Strictly Sharp**. To reinforce the academic and technical feel, all containers, buttons, and input fields use a **0px border-radius**. 

- **Progress Bars:** Should be flat and thin (2px height), spanning the full width of their container or card with 0px rounding.
- **Buttons:** Sharp corners emphasize the "system" feel.
- **Exceptions:** Icons may remain organic, but the containers surrounding them must remain rectangular.

## Components
- **Primary Buttons:** Solid `primary` background with `on-primary` (white) text. Sharp corners. Use `label-sm` (JetBrains Mono) for button text.
- **Secondary Buttons / Ghost Buttons:** 1px border using `outline` color. Text is `on-surface`.
- **Progress Cards:** Use `surface-container-lowest` with a 24px internal padding. Title in `body-lg`, progress percentage in `caption`.
- **Topic Catalog Cards:** Hover-sensitive cards that change border color to `primary`. Category labels should be `label-sm` and uppercase.
- **Navigation:** Top-bar links use `label-sm`. The active state is indicated by a 2px `primary` bottom border that aligns with the bottom of the header.
- **Icons:** Use the Material Symbols Outlined set, sized to 24px, with a stroke weight of 400.