# v0.dev & Lovable Prompts - Dashboard Financeiro

**Versão:** 1.0.0
**Data:** 2026-02-20
**Objetivo:** Generate complete Dashboard UI with AI tools

---

## 📋 Prompt 1: Dashboard Layout & Header

**Platform:** v0.dev or Lovable
**Type:** Full-page component
**Output:** Complete dashboard shell with header

```
Create a professional financial dashboard component with the following:

HEADER:
- Fixed sticky header with dark background (#1A1D23)
- Logo on left (icon: 📊)
- Period selector in middle: Dropdown buttons [Mensal ▼] [Trimestral ▼] [Semestral ▼] [Anual ▼]
- Right side: Resincronizar button (🔄), Theme toggle (🌙/☀️), Settings button (⚙️)

LAYOUT:
- Dark mode as default (background: #1A1D23)
- Full-width container with max-width: 1200px
- Padding: 24px
- Responsive: Stack on mobile, flex on desktop

STYLING:
- Font: Inter, sans-serif
- Colors: Use gradient accents where possible
- Dark theme only for now
- Smooth transitions on all interactions

Include:
- Header component (sticky)
- Main content area ready for sections
- Dark theme CSS variables
- Responsive design for mobile/tablet/desktop

Framework: React + TypeScript + Tailwind CSS
No external UI library required
```

---

## 📋 Prompt 2: KPI Cards (4 Cards with Gradients)

**Platform:** v0.dev or Lovable
**Type:** Component
**Output:** 4 KPI cards with gradient backgrounds

```
Create 4 KPI cards component for financial dashboard:

CARDS:
1. Receitas (Income)
   - Gradient: #00FF88 → #00D4FF
   - Value: R$ 35.000
   - Variation: ↑ +5% vs mês anterior
   - Projected: Proj: R$ 40.000
   - Realization: 87.5% ✓

2. Despesas (Expenses)
   - Gradient: #FF4757 → #FF6B9D
   - Value: R$ 8.500
   - Variation: ↑ +2% vs mês anterior
   - Projected: Proj: R$ 8.000
   - Realization: 106% ✗

3. Saldo (Balance)
   - Gradient: #3B82F6 → #BD3AF5
   - Value: R$ 26.500
   - Variation: ↑ +8% vs mês anterior
   - Projected: Proj: R$ 32.000
   - Realization: 82.8% ~

4. % Poupança (Savings Rate) - SPECIAL
   - Gradient: #00FF88 → #06B6D4
   - Value: 75.7%
   - Variation: ↑ +3.2% vs mês anterior
   - Extra: "META ANUAL: 70% | Você está: 5.7% ACIMA! 🎉"
   - Add pulse animation with glow effect

STYLING:
- Grid layout: 4 columns on desktop, 2 on tablet, 1 on mobile
- Border: 1.5px gradient (matching card gradient @ 30% opacity)
- Border-radius: 12px
- Padding: 16px
- Box-shadow: subtle glow effect (0 0 20px rgba(color, 0.1))
- For Poupança: Extra glow shadow and pulse animation

ELEMENTS PER CARD:
- Icon: 16x16px (colored)
- Label: 12px, subtle color
- Main value: 32px, bold
- Variation badge: color-coded (green/red arrow)
- Projected row: subtle text
- % Realization: color-coded (green/yellow/red)

COLORS (realization):
- > 100%: #00FF88 (green)
- 80-99%: #FFD700 (yellow)
- < 80%: #FF4757 (red)

ANIMATIONS:
- On load: Fade in + slide up (200ms, staggered 50ms)
- On hover: Brighten gradient 10%, increase shadow

Responsive:
- Desktop (>1024px): 4-column grid
- Tablet (640-1024px): 2-column grid or 3+1
- Mobile (<640px): 1-column stacked

Framework: React + TypeScript + Tailwind CSS
```

---

## 📋 Prompt 3: Donut Charts (Expenses & Income)

**Platform:** v0.dev or Lovable
**Type:** Component (using Recharts)
**Output:** 2 interactive donut charts

```
Create 2 donut charts component for financial dashboard using Recharts:

CHART 1: Despesas por Categoria
- Title: "Despesas por Categoria"
- Size: 320x320px
- Colors (MUST be distinct):
  • Alimentação: #FF4757 (red)
  • Moradia: #BD3AF5 (purple)
  • Transporte: #FF9500 (orange)
  • Saúde: #00D4FF (cyan)
  • Lazer: #FFD700 (gold)
  • Outros: #A78BFA (light purple)

- Sample data:
  [
    { name: "Alimentação", value: 35 },
    { name: "Moradia", value: 20 },
    { name: "Transporte", value: 15 },
    { name: "Saúde", value: 10 },
    { name: "Lazer", value: 20 }
  ]

CHART 2: Receitas por Categoria
- Title: "Receitas por Categoria"
- Size: 320x320px
- Colors (MUST be distinct):
  • Salário: #00FF88 (green neon)
  • Freelance: #00D4FF (cyan)
  • Outros: #FFD700 (gold)

- Sample data:
  [
    { name: "Salário", value: 94.3 },
    { name: "Freelance", value: 5.7 }
  ]

CHART CONFIGURATION:
- Outer radius: 100px
- Inner radius: 60px
- Stroke width: 8px
- Legend: vertical, right-aligned
- Labels: outside the donut, format "Category: XX%"
- Label color: #F1F5F9
- Label font: 12px, weight 500

INTERACTIONS:
- Hover slice: Brighten 15%
- Tooltip: Show "Category\nR$ XXXX (XX%)"
- Smooth animation on load

LAYOUT:
- 2 charts side-by-side on desktop
- Stacked on tablet/mobile
- Centered, with spacing

STYLING:
- No grid
- Dark backgrounds (#2D323D)
- Border-radius: 12px on container
- Padding: 16px

Framework: React + Recharts + TypeScript + Tailwind CSS
```

---

## 📋 Prompt 4: Bar Chart - Saldo Evolution

**Platform:** v0.dev or Lovable
**Type:** Component (using Recharts)
**Output:** Vertical bar chart

```
Create vertical bar chart for "Evolução do Saldo" (balance evolution):

TITLE: "Evolução do Saldo"
SIZE: Full width container, height: 280px

DATA (for monthly view):
- X-axis: Days 01-31
- Y-axis: R$ values (0 to 40000)
- Sample bars showing increasing trend

BAR STYLING:
- Color: Gradient #06B6D4 → #0891B2 → #164E63 (top to bottom)
- Radius: [4, 4, 0, 0] (top rounded)
- Fill opacity: 0.8
- No stroke

AXES:
- X-axis: Days (01, 07, 13, 19, 25, 31)
- X-axis font: 12px, color: #94A3B8
- Y-axis: R$ values (format: "R$ XXXX")
- Y-axis font: 12px, color: #94A3B8
- Y-axis width: 60px

GRID:
- Horizontal grid lines: Yes, color: rgba(148, 163, 184, 0.1)
- Vertical grid lines: No
- Grid opacity: subtle

MARGIN:
- top: 20px
- right: 30px
- bottom: 20px
- left: 60px

INTERACTIONS:
- Hover bar: Show tooltip "Day XX: R$ XXXX"
- Tooltip background: #2D323D
- Tooltip border: 1px solid #4A515E
- Animation on load: Draw bars (500ms)

CONTAINER:
- Background: Card BG (#2D323D)
- Border-radius: 12px
- Padding: 16px
- Border: 1px solid #4A515E

RESPONSIVE:
- Desktop: Full width, height 280px
- Tablet: Scrollable horizontal if needed, height 200px
- Mobile: Scrollable horizontal, height 180px, reduced font sizes

Framework: React + Recharts + TypeScript + Tailwind CSS
No custom SVG needed - use Recharts BarChart
```

---

## 📋 Prompt 5: Top 5 Tables

**Platform:** v0.dev or Lovable
**Type:** Component
**Output:** 2 side-by-side tables

```
Create Top 5 Expenses & Income tables component:

LAYOUT:
- 2 tables side-by-side on desktop
- Stacked on tablet/mobile
- Spacing between: 16px

TABLE 1: TOP 5 GASTOS (Expenses)
Title: "🔴 TOP 5 GASTOS"

Rows:
1. Aluguel | R$ 1.500 | Moradia • 01 Oct
2. Alimentação | R$ 800 | Alimentação • 02 Oct
3. Transporte | R$ 450 | Transporte • 03 Oct
4. Internet | R$ 250 | Internet • 04 Oct
5. Streaming | R$ 180 | Streaming • 05 Oct

TABLE 2: TOP 5 ENTRADAS (Income)
Title: "🟢 TOP 5 ENTRADAS"

Rows:
1. Salário | R$ 30.000 | Salário • 01 Oct
2. Freelance | R$ 5.000 | Freelance • 15 Oct
3. Bônus | R$ - | Bônus • -
4. - | R$ - | -
5. - | R$ - | -

STYLING PER ROW:
- Border-left: 3px gradient (expenses: red→pink, income: green→cyan)
- Padding: 12px
- Margin-bottom: 8px
- Background: Card BG (#2D323D)
- Border-radius: 8px
- Font: 14px, weight 400

EXPENSES BORDER COLOR:
- Gradient: #FF4757 → #FF6B9D (red to pink)

INCOME BORDER COLOR:
- Gradient: #00FF88 → #00D4FF (green to cyan)

COLUMNS:
- Rank (auto-numbered)
- Name (bold)
- Amount (right-aligned, bold)
- Icon/Category (trailing)

RESPONSIVE:
- Desktop (>1024px): 2 tables side-by-side
- Tablet (640-1024px): Stacked, full-width
- Mobile (<640px): Stacked, scroll-x enabled

INTERACTIONS:
- Hover row: Slightly brighten background
- Smooth transition: 300ms

Framework: React + TypeScript + Tailwind CSS
```

---

## 📋 Prompt 6: Progress Bars - Metas

**Platform:** v0.dev or Lovable
**Type:** Component
**Output:** 2 progress bars with labels

```
Create progress bars component for financial goals (Metas):

GOAL 1: META MENSAL
Title: "Meta Mensal: R$ 2.000 restante"
Progress: 45%
Fill: Gradient #06B6D4 → #10B981 (cyan to green)
Label bottom: "Faltam: R$ 27.500"

GOAL 2: META ANUAL
Title: "Meta Anual: R$ 50.000"
Progress: 62%
Fill: Gradient #10B981 → #BD3AF5 (green to purple)
Label bottom: "Alcançou: R$ 31.000"

STYLING PER BAR:
- Height: 24px
- Container background: #334155 (dark gray)
- Border-radius: 12px
- Padding: 0 (bars inside)
- Icon: ✨ (sparkle, 12px, left-aligned inside bar)
- Margin-bottom between bars: 24px

PROGRESS BAR ANIMATION:
- On load: Fill animates from 0% to final (800ms, ease-out)
- Glow effect on fill: subtle shadow

LABELS:
- Title (top-left): 14px, weight 500, color: #F1F5F9
- Value (top-right): 12px, weight 600, color: state color
- Bottom label: 12px, weight 400, color: #94A3B8

RESPONSIVE:
- Desktop/Tablet: Full-width
- Mobile: Full-width with reduced padding

CONTAINER:
- Background: transparent
- Padding: 12px 0
- Gap between goals: 32px

Framework: React + TypeScript + Tailwind CSS
```

---

## 📋 Prompt 7: Chat Widget

**Platform:** v0.dev or Lovable
**Type:** Component
**Output:** Floating chat interface

```
Create floating chat widget for financial AI assistant:

CLOSED STATE:
- Fixed position: bottom-right (16px from right, 16px from bottom)
- Icon button: 44x44px circular
- Background: Gradient (neon colors)
- Border: 2px solid, gradient #00D4FF → #00FF88
- Border-radius: 50%
- Icon: Chat bubble (💬)
- Badge: Message count (optional)

OPEN STATE:
- Position: Fixed, bottom-right (stays visible)
- Width: 360px on desktop, 100% - 32px margin on mobile
- Height: max-height 480px
- Background: Card BG (#2D323D)
- Border: 2px solid, gradient #00D4FF → #00FF88
- Border-radius: 12px
- Z-index: 1000
- Box-shadow: 0 20px 25px rgba(0, 0, 0, 0.4)

HEADER (when open):
- Background: Slightly darker (#252A33)
- Padding: 12px
- Border-bottom: 1px solid #4A515E
- Title: "Chat com IA"
- Close button: X (top-right)

MESSAGES AREA:
- Max-height: 400px
- Scrollable: Yes, smooth scroll-behavior
- Padding: 12px

MESSAGE STYLES:

USER MESSAGE:
- Alignment: right
- Background: Gradient #3B82F6 → #8B5CF6 (blue to purple)
- Color: white (#FFFFFF)
- Border-radius: 12px
- Padding: 8px 12px
- Font: 14px
- Max-width: 80%

AI MESSAGE:
- Alignment: left
- Background: Slightly darker (#1A1D23)
- Color: #F1F5F9
- Border-left: 3px solid #00D4FF
- Border-radius: 8px
- Padding: 8px 12px
- Font: 14px
- Max-width: 80%

INPUT AREA (bottom):
- Display: Flex, gap 8px
- Padding: 12px
- Background: Card BG

INPUT FIELD:
- Flex: 1
- Height: 40px
- Padding: 8px 12px
- Font: 14px
- Border: 1px solid #4A515E
- Border-radius: 8px
- Background: #1A1D23
- Color: #F1F5F9
- Placeholder: "Escreva sua pergunta..."

SEND BUTTON:
- Width: 40px
- Height: 40px
- Border-radius: 8px
- Background: #00D4FF (cyan)
- Color: #1A1D23 (dark)
- Icon: ✈️ or arrow
- Cursor: pointer
- Hover: Brighten

EXAMPLE MESSAGES:
User: "Qual é minha categoria com maior gasto?"
AI: "Sua maior despesa em janeiro é Alimentação (R$ 8.400, 35% do total). Acima da meta de R$ 7.000."

User: "Quanto economizei esse trimestre?"
AI: "Você economizou R$ 26.500 no Q1 (76% de taxa de economia). Meta anual: R$ 50k — já atingiu 160%!"

ANIMATIONS:
- Open: Slide in from bottom-right (300ms) + Backdrop fade (200ms)
- Close: Slide out (200ms)
- New message: Slide up (150ms)
- Loading: Spinner animation

STATES:
- Default: Ready to receive input
- Loading: Show spinner, disable send button
- Error: Show error message, red border on input
- Success: Message sent, input cleared

Framework: React + TypeScript + Tailwind CSS
```

---

## 📋 Prompt 8: Theme Toggle (Dark/Light Mode)

**Platform:** v0.dev or Lovable
**Type:** Hook/Context
**Output:** Theme switcher with persistence

```
Create theme toggle system for dark/light mode:

BUTTON LOCATION:
- Header (right side)
- Next to settings icon
- Size: 40x40px clickable area
- Icon: 🌙 (dark mode) / ☀️ (light mode)

ON CLICK:
1. Update theme state
2. Change all colors smoothly (300ms transition)
3. Save preference to localStorage ('theme': 'dark' | 'light')
4. Update CSS variables

COLOR MAPPING:

DARK MODE (default):
- Background: #1A1D23
- Secondary: #252A33
- Card: #2D323D
- Text primary: #F1F5F9
- Text secondary: #CBD5E1

LIGHT MODE:
- Background: #FFFFFF
- Secondary: #F8FAFC
- Card: #F1F5F9
- Text primary: #0F172A
- Text secondary: #475569

GRADIENTS:
- Keep same gradient colors (neon works in both modes)
- Only adjust text colors for contrast

CSS VARIABLES:
```css
:root.dark {
  --bg-primary: #1A1D23;
  --bg-secondary: #252A33;
  --bg-card: #2D323D;
  --text-primary: #F1F5F9;
  --text-secondary: #CBD5E1;
}

:root.light {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --bg-card: #F1F5F9;
  --text-primary: #0F172A;
  --text-secondary: #475569;
}
```

PERSISTENCE:
- On component mount: Check localStorage
- If stored theme: Apply it
- If not stored: Use system preference (prefers-color-scheme)
- Save on toggle

ANIMATION:
- All colors transition 300ms ease-in-out
- Cards scale 1.01 during transition (optional)
- Icons rotate 180° (optional)

ACCESSIBILITY:
- aria-label="Toggle theme (dark/light mode)"
- Keyboard accessible (Tab, Enter)
- High contrast maintained

Framework: React + TypeScript + Tailwind CSS + Context API
```

---

## 🚀 Quick Implementation Guide

### **Order of Implementation:**

1. **Prompt 1** - Dashboard shell & layout foundation
2. **Prompt 8** - Theme toggle (needed for all components)
3. **Prompt 2** - KPI cards (core data display)
4. **Prompt 3** - Donut charts (data visualization)
5. **Prompt 4** - Bar chart (evolution tracking)
6. **Prompt 5** - Top 5 tables (transactions)
7. **Prompt 6** - Progress bars (goals)
8. **Prompt 7** - Chat widget (AI interaction)

### **Testing Checklist:**
- [ ] All colors render correctly in dark mode
- [ ] Theme toggle persists on reload
- [ ] Charts update when data changes
- [ ] Chat widget opens/closes smoothly
- [ ] Responsive layout works on all breakpoints
- [ ] All animations smooth (60fps)
- [ ] Touch targets >= 44x44px on mobile
- [ ] Accessibility checked (contrast, labels)

---

**Prompts Version:** 1.0.0
**Last Updated:** 2026-02-20
**Status:** Ready to use with v0.dev or Lovable
