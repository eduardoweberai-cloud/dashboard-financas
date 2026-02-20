# Frontend Specification: Dashboard Financeiro

**Documento:** Frontend Specification Document
**Projeto:** Dashboard Financeiro Pessoal
**Data:** 2026-02-20
**Versão:** 1.0.0
**Status:** Ready for Development

---

## 📋 Executive Summary

This document provides comprehensive frontend specifications for implementing the Financial Dashboard. It serves as the blueprint for developers, defining layout, components, states, interactions, and accessibility requirements.

---

## 🎯 Design System Overview

### **Grid & Layout**
```
Base Unit: 4px
Container: 1200px max-width
Padding: 24px (desktop), 16px (tablet), 12px (mobile)
Gap: 16px (between components)
```

### **Breakpoints**
```
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  > 1024px
```

---

## 🎨 Color Palette

### **Backgrounds (Dark Mode)**
```
Primary BG:     #1A1D23
Secondary BG:   #252A33
Card BG:        #2D323D
Hover/Active:   #3C4350
Border:         #4A515E
```

### **Gradients**
```
Receitas:       #00FF88 → #00D4FF (Verde → Cyan)
Despesas:       #FF4757 → #FF6B9D (Vermelho → Rosa)
Saldo:          #3B82F6 → #BD3AF5 (Azul → Roxo)
% Poupança:     #00FF88 → #06B6D4 (Verde → Cyan)
Metas:          #06B6D4 → #10B981 (Cyan → Verde)
```

### **Donut Colors (Distinct)**
```
DESPESAS:
- Alimentação:    #FF4757
- Moradia:        #BD3AF5
- Transporte:     #FF9500
- Saúde:          #00D4FF
- Lazer:          #FFD700
- Outros:         #A78BFA

RECEITAS:
- Salário:        #00FF88
- Freelance:      #00D4FF
- Outros:         #FFD700
```

### **Texts**
```
Primary:   #F1F5F9
Secondary: #CBD5E1
Subtle:    #94A3B8
```

### **States**
```
Success:   #00FF88 (Verde neon)
Warning:   #FFD700 (Ouro)
Danger:    #FF4757 (Vermelho)
Info:      #00D4FF (Cyan)
```

---

## 🔤 Typography

```
Titles:
  - H1: 32px, Weight 700, Color #F1F5F9
  - H2: 24px, Weight 600, Color #F1F5F9
  - H3: 18px, Weight 600, Color #F1F5F9

Body:
  - Label: 12px, Weight 500, Color #CBD5E1
  - Body: 14px, Weight 400, Color #F1F5F9
  - Small: 12px, Weight 400, Color #94A3B8

Numbers (KPIs):
  - Display: 32px, Weight 700, Color: Gradient
  - Badge: 12px, Weight 600, Color: State color
```

**Font Family:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

---

## 📐 Spacing Scale

```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

---

## 🧩 Component Specifications

### **1. HEADER**

**Location:** Top of page, sticky
**Height:** 64px
**Background:** Secondary BG (#252A33)
**Border:** 1px bottom, #4A515E

**Contents (Left to Right):**
```
[Logo: 40x40px]
[Space: 24px]
[Período Selector: Dropdowns]
[Space: auto]
[Resincronizar Button: sm]
[Space: 12px]
[Theme Toggle: Icon Button]
[Space: 8px]
[Settings: Icon Button]
[Space: 16px (padding)]
```

**Period Selector Component:**
- Dropdown buttons: `[Mensal ▼] [Trim ▼] [Sem ▼] [Anual ▼]`
- Style: Ghost buttons, 10px padding
- Font: 12px, Weight 500
- On hover: Background lighten 5%
- On click: Dropdown opens below

**Theme Toggle Button:**
- Icon: Moon (🌙) in dark mode, Sun (☀️) in light mode
- Size: 24x24px
- Clickable area: 44x44px (touch target)
- Animation: Smooth color transition 300ms

**Resincronizar Button:**
- Icon: ↻ + Text "Resincronizar"
- Size: sm (32px height)
- Style: Ghost
- On click: Loading spinner
- Tooltip: "Sincronizar metas de Orçamento2026"

---

### **2. KPI CARDS (4 Cards)**

**Layout:** 4-column grid on desktop, flexible on tablet/mobile
**Card Size:** ~280px width, 120px height
**Spacing:** 16px gap between cards

#### **Card Structure:**

```
┌─────────────────────────────────┐
│ [Icon: 16x16px] [Label: 12px]  │ ← Header
├─────────────────────────────────┤
│ R$ 35.000                       │ ← Main number (32px bold)
│ ↑ +5% vs ant. | [Badge color]  │ ← Variation
├─────────────────────────────────┤
│ Proj: R$ 40.000                 │ ← Projected (12px subtle)
│ 87.5% ✓ | [Color: state]       │ ← % Realization
└─────────────────────────────────┘
```

**Card Styles:**
```
Background:   Gradient (see colors)
Border:       1.5px solid gradient color @ 30% opacity
BorderRadius: 12px
Padding:      16px
Box-shadow:   0 0 20px rgba(color, 0.1) [glow effect]
```

**Card 4: % Poupança (Special)**
```
Additional:
- Box-shadow: 0 0 20px rgba(0, 255, 136, 0.3) [extra glow]
- Border: Thicker, 2px
- Scale on hover: 1.02
- Pulse animation: 2s loop
```

**States:**
```
Normal:   As specified
Hover:    Brighten gradient 10%, shadow increase 20%
Loading:  Skeleton loader with shimmer
```

---

### **3. DONUTS (2 Charts)**

**Layout:** 2 columns on desktop, stacked on mobile
**Size:** 320x320px each
**Library:** Recharts

#### **Donut Configuration:**

```
Radius (outer):      100px
Radius (inner):      60px
Stroke width:        8px
Start angle:         90
End angle:           -90
Margin:              20px

Legend:
  Layout:    vertical
  Position:  right
  Format:    "Label: XX%"

Labels:
  Show on each slice
  Format: "Category: R$ XXX (XX%)"
  Position: outside
  Color: #F1F5F9
  Font: 12px, Weight 500
```

**Color Assignment:** Use distinct colors from palette (see Donut Colors above)

**Interactions:**
- Hover slice: Brighten 15%, show tooltip
- Tooltip format: "Category\nR$ XXXX (XX%)"

---

### **4. BAR CHART (Evolution)**

**Type:** Vertical Bar Chart
**Height:** 280px
**X-axis:** Days (01-31) for monthly, months for other periods
**Y-axis:** R$ values (0 to max)
**Library:** Recharts

#### **Configuration:**

```
Margin:           { top: 20, right: 30, bottom: 20, left: 60 }
Bar Color:        Gradient: #00D4FF → #0891B2
Bar Radius:       [4, 4, 0, 0]
Stroke:           None
Fill Opacity:     0.8

Grid:
  Horizontal:     Yes, color: rgba(148, 163, 184, 0.1), strokeDasharray: 0
  Vertical:       No

Axes:
  X-axis:         Font 12px, color: #94A3B8
  Y-axis:         Font 12px, color: #94A3B8, format: "R$ XXXX"

Tooltip:
  Format:         "Day/Period: R$ XXXX"
  Background:     Card BG (#2D323D)
  Border:         1px solid #4A515E
```

**Interactions:**
- Hover bar: Highlight, show exact value
- Animation: Draw bars on load (500ms)

---

### **5. TOP 5 TABLES**

**Layout:** 2 side-by-side tables
**Columns:** [#], [Name], [Amount], [Icon]

#### **Table Row Structure:**

```
┌─────────────────────────────────┐
│ 1. Aluguel       R$ 1.500    🔴 │
│    Moradia • 01 Oct             │
└─────────────────────────────────┘
```

**Styling:**
```
Border-left:    3px gradient (expenses: red→pink, income: green→cyan)
Padding:        12px
Margin-bottom:  8px
Background:     Card BG
Border-radius:  8px
Font:           14px, Weight 400
```

**Colors:**
- Expenses: #FF4757 (red) border
- Income:   #00FF88 (green) border

---

### **6. PROGRESS BARS (Metas)**

**Type:** Linear progress bar
**Height:** 24px
**Width:** Full container width
**Border-radius:** 12px

#### **Structure:**

```
┌─────────────────────────────────────────────────┐
│ Meta Mensal: R$ 2.000 restante                  │
│ ✨████████░░░░░░░░░░░░░░░░░░░  45%             │
│ Faltam: R$ 27.500                              │
└─────────────────────────────────────────────────┘
```

**Styling:**
```
Background:     #334155 (container)
Fill:           Gradient (see colors)
Fill animation: 800ms ease-out on load
Sparkle icon:   ✨ (12px, left-aligned)
Border:         None
```

**2 Bars Total:**
- Bar 1: Cyan → Verde gradient
- Bar 2: Verde → Roxo gradient

---

### **7. CHAT WIDGET**

**Position:** Fixed, bottom-right
**Offset:** 16px from right, 16px from bottom
**Width:** 360px (desktop), full - 16px margin (mobile)
**Max-height:** 480px
**Z-index:** 1000

#### **States:**

**Closed:**
- Icon: Chat bubble (32x32px)
- Badge: Message count (if any)
- Style: Circle button, gradient border, 44x44px clickable area

**Open:**
- Header: "Chat com IA", close button (✕)
- Messages: Scrollable area, max-height 400px
- Input: Text field + send button
- Footer: Minimize (−), Close (✕)

**Border:** 2px solid, gradient #00D4FF → #00FF88

#### **Messages:**

```
User Message:
  Alignment:  Right
  Background: Gradient (blue)
  Color:      White
  Border-radius: 12px
  Margin:     8px 0

AI Message:
  Alignment:  Left
  Background: Card BG
  Color:      #F1F5F9
  Border-left: 3px solid #00D4FF
  Border-radius: 8px
  Margin:     8px 0
```

**Animations:**
- Open: Slide in from bottom-right (300ms)
- Backdrop: Fade in (200ms)
- New message: Slide up (150ms)

---

## 🔄 User Interactions

### **Period Selection Change**

**Flow:**
1. User clicks period button
2. Dropdown opens below button
3. User selects option
4. KPIs fade out (150ms)
5. Data loads from API
6. KPIs fade in + slide up (300ms)
7. Gráficos redraw (400ms animation)
8. Top 5 fade in (150ms)

**Disabled state:** During API call, show skeleton loaders

### **Theme Toggle**

**Flow:**
1. User clicks theme icon
2. Background colors fade (200ms)
3. Text colors update
4. Cards transform (250ms)
5. Save to localStorage
6. Theme persists on reload

**Animation:** All colors transition smoothly 300ms ease-in-out

### **Chat Interaction**

**Open Flow:**
1. User clicks chat icon
2. Drawer slides in from bottom-right (300ms)
3. Focus moves to input field
4. Show message history

**Send Flow:**
1. User types message, clicks send
2. Message appears on right (blue)
3. Input clears
4. API call to backend
5. Spinner shows while loading
6. AI response appears on left (card BG)
7. Auto-scroll to latest message

**Close Flow:**
1. User clicks ✕ or presses ESC
2. Drawer slides out (200ms)

### **Resincronizar Metas**

**Flow:**
1. User clicks "🔄 Resincronizar"
2. Button shows loading spinner
3. API call to sync Orçamento2026
4. Success: Toast appears "✓ Metas atualizadas com sucesso"
5. KPIs update (fade 150ms)
6. Error: Toast appears "❌ Erro ao sincronizar..."
7. Badge shows "⚠️ Últimos dados: [data-hora]" if sync fails for > 24h

---

## 📱 Responsive Design

### **Desktop (> 1024px)**
```
Layout:        As wireframe
KPI Cards:     4-column grid
Donuts:        2 side-by-side
Bar Chart:     Full width
Top 5:         2 side-by-side
Chat:          Floating 360px wide
```

### **Tablet (640px - 1024px)**
```
Layout:        Adjusted padding
KPI Cards:     2 per row (or 3 + 1)
Donuts:        Stacked vertical
Bar Chart:     Scrollable horizontal
Top 5:         Stacked, scroll-x
Chat:          Drawer from right side
Font sizes:    Reduced 10% for readability
```

### **Mobile (< 640px)**
```
Layout:        Full-width
KPI Cards:     1 per row, stacked vertical
Donuts:        Stacked, smaller (240x240px)
Bar Chart:     Scroll-x, reduce height to 200px
Top 5:         1 per row, scroll-x with snap
Chat:          Fullscreen modal
Header:        Stack logo + controls (wrap on multiple lines)
Padding:       12px all sides
Font sizes:    Reduced 15%
Touch targets: Minimum 44x44px
```

---

## ♿ Accessibility (WCAG AA)

### **Color Contrast**
```
Text on background:  4.5:1 minimum
UI components:       3:1 minimum
All gradients:       Ensure text readable (AA)
```

### **Focus Management**
```
Focus indicator:    2px solid #00D4FF, 2px offset
Focus trap:         On chat open (ESC to close)
Tab order:          Left to right, top to bottom
```

### **Keyboard Navigation**
```
Tab:            Move between focusable elements
Enter:          Click/submit
ESC:            Close modals/chat
Arrow keys:     Navigate selects
Space:          Toggle buttons
```

### **ARIA Labels**
```
Chat button:        aria-label="Abrir chat com IA"
Theme toggle:       aria-label="Alternar tema (modo escuro/claro)"
Period selector:    aria-label="Selecionar período"
KPI cards:          aria-label="[Label]: R$ [amount]"
Progress bars:      aria-valuenow, aria-valuemin, aria-valuemax
Tables:             <th> for headers, proper <thead>/<tbody>
Forms:              <label> associated with <input>
```

### **Skip Links**
```
Add hidden "Skip to main content" link
```

### **Semantic HTML**
```
Use <button> for buttons
Use <a> for links
Use <form> for forms
Use <table> for data tables
Use <main>, <section>, <article>
```

---

## 🎬 Animations & Transitions

### **Global**
```
Default transition: 0.3s ease-in-out
Easing:             cubic-bezier(0.4, 0, 0.2, 1)
```

### **Specific Animations**

**KPI Cards on Load:**
```
Animation:     Fade in + Slide up
Duration:      200ms each
Delay:         Stagger 50ms per card
Start state:   opacity: 0, translateY: 20px
End state:     opacity: 1, translateY: 0
```

**% Poupança Pulse:**
```
Animation:     Box-shadow pulse
Duration:      2s infinite
keyframes:
  0%:    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3)
  50%:   box-shadow: 0 0 40px rgba(0, 255, 136, 0.6)
  100%:  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3)
```

**Period Change:**
```
KPIs:      Fade out 150ms → load → Fade in 300ms
Gráficos:  Fade out 150ms → redraw 400ms animation
Top 5:     Fade out 150ms → Fade in 200ms
```

**Chat Open/Close:**
```
Open:  Slide in from bottom-right 300ms + Backdrop fade 200ms
Close: Slide out to bottom-right 200ms
```

**Theme Toggle:**
```
Background: Fade color change 200ms
Text:       Fade color change 200ms
Cards:      Transform 250ms (subtle scale/opacity)
```

---

## 🧪 Testing Checklist

### **Functional Testing**
- [ ] Period selector works and updates all data
- [ ] KPIs calculate and display correctly
- [ ] Gráficos render without errors
- [ ] Top 5 tables populate correctly
- [ ] Progress bars calculate correct percentages
- [ ] Chat sends and receives messages
- [ ] Resincronizar updates metas
- [ ] Theme toggle persists on reload

### **Visual Testing**
- [ ] Colors match design (check on both dark/light)
- [ ] Spacing consistent per design
- [ ] Typography correct sizes/weights
- [ ] Donuts colors all distinct
- [ ] Gradient colors display correctly
- [ ] Animations smooth and not janky

### **Responsive Testing**
- [ ] Desktop layout (> 1024px) — correct
- [ ] Tablet layout (640-1024px) — correct
- [ ] Mobile layout (< 640px) — correct
- [ ] Images/charts scale correctly
- [ ] No horizontal scroll on mobile
- [ ] Touch targets >= 44x44px

### **Accessibility Testing**
- [ ] Color contrast 4.5:1 for text
- [ ] Focus indicators visible
- [ ] Keyboard navigation works (Tab, Enter, ESC)
- [ ] Screen reader labels present
- [ ] No color-only information (patterns/icons)
- [ ] Form fields properly labeled

### **Performance Testing**
- [ ] Dashboard loads in < 2s
- [ ] Gráficos render smoothly
- [ ] Chat responds in < 5s
- [ ] Period change < 1s
- [ ] No memory leaks in dev tools
- [ ] Lighthouse score > 90

---

## 📦 Component Dependencies

### **Required Libraries**
```
- React 18+
- Next.js 14+ (App Router)
- Recharts (charts)
- Shadcn/ui (base components)
- Tailwind CSS 3.4+
- Framer Motion (animations, optional)
- Zustand (state management, optional)
```

### **Component Tree**

```
<Dashboard>
  ├── <Header>
  │   ├── <Logo>
  │   ├── <PeriodSelector>
  │   ├── <ResincButton>
  │   ├── <ThemeToggle>
  │   └── <SettingsButton>
  │
  ├── <KPISection>
  │   ├── <KPICard> (Receitas)
  │   ├── <KPICard> (Despesas)
  │   ├── <KPICard> (Saldo)
  │   └── <KPICard> (% Poupança)
  │
  ├── <ChartsSection>
  │   ├── <DonutChart> (Despesas)
  │   ├── <DonutChart> (Receitas)
  │   └── <BarChart> (Evolução)
  │
  ├── <Top5Section>
  │   ├── <Table> (Gastos)
  │   └── <Table> (Entradas)
  │
  ├── <MetasSection>
  │   ├── <ProgressBar> (Mensal)
  │   └── <ProgressBar> (Anual)
  │
  └── <ChatWidget>
      ├── <ChatIcon> (quando fechado)
      └── <ChatDrawer> (quando aberto)
          ├── <ChatMessages>
          ├── <ChatInput>
          └── <ChatActions>
```

---

## 🚀 Implementation Phases

### **Phase 1: Layout & Basic Components**
- Header + Navigation
- KPI Cards (no data)
- Chat widget (UI only)
- Theme toggle

### **Phase 2: Data & Charts**
- Connect to API
- Populate KPIs
- Render donuts
- Render bar chart

### **Phase 3: Interactions**
- Period selector
- Resincronizar button
- Chat messages
- Animations

### **Phase 4: Polish & Testing**
- Responsive design refinement
- Accessibility audit
- Performance optimization
- Cross-browser testing

---

## 📝 Notes for Developers

1. **State Management:** Consider Zustand for period state, theme preference
2. **API Calls:** Implement loading states with skeleton loaders
3. **Error Handling:** Toast notifications for errors (Resincronizar, API failures)
4. **Caching:** Cache period data in-memory to reduce API calls
5. **Dark Mode:** Use CSS variables for colors to allow easy theme switching
6. **Mobile First:** Build components mobile-first, then enhance for larger screens
7. **Testing:** Write unit tests for components and integration tests for flows

---

**Document Version:** 1.0.0
**Last Updated:** 2026-02-20
**Ready for Development:** ✅ YES
