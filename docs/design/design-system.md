# Design System: Dashboard Financeiro

**Versão:** 1.0.0
**Data:** 2026-02-20
**Status:** Ready for Implementation

---

## 📦 Design Tokens

### **Colors**

```yaml
# Dark Mode (Primary)
colors:
  dark:
    backgrounds:
      primary: "#1A1D23"
      secondary: "#252A33"
      card: "#2D323D"
      hover: "#3C4350"
      border: "#4A515E"

    text:
      primary: "#F1F5F9"
      secondary: "#CBD5E1"
      subtle: "#94A3B8"

    states:
      success: "#00FF88"
      warning: "#FFD700"
      danger: "#FF4757"
      info: "#00D4FF"

    gradients:
      receitas: "linear-gradient(135deg, #00FF88 0%, #00D4FF 100%)"
      despesas: "linear-gradient(135deg, #FF4757 0%, #FF6B9D 100%)"
      saldo: "linear-gradient(135deg, #3B82F6 0%, #BD3AF5 100%)"
      poupanca: "linear-gradient(135deg, #00FF88 0%, #06B6D4 100%)"
      metas: "linear-gradient(90deg, #06B6D4 0%, #10B981 100%)"
      barChart: "linear-gradient(180deg, #06B6D4 0%, #0891B2 50%, #164E63 100%)"

# Light Mode
  light:
    backgrounds:
      primary: "#FFFFFF"
      secondary: "#F8FAFC"
      card: "#F1F5F9"
      hover: "#E2E8F0"
      border: "#CBD5E1"

    text:
      primary: "#0F172A"
      secondary: "#475569"
      subtle: "#64748B"

    states:
      success: "#16A34A"
      warning: "#D97706"
      danger: "#DC2626"
      info: "#0284C7"

# Categorical Colors (Donuts)
  donuts:
    expenses:
      alimentacao: "#FF4757"
      moradia: "#BD3AF5"
      transporte: "#FF9500"
      saude: "#00D4FF"
      lazer: "#FFD700"
      outros: "#A78BFA"

    income:
      salario: "#00FF88"
      freelance: "#00D4FF"
      outros: "#FFD700"
```

---

### **Typography**

```yaml
typography:
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

  scale:
    h1:
      fontSize: "32px"
      fontWeight: 700
      lineHeight: 1.2
      letterSpacing: "-0.01em"

    h2:
      fontSize: "24px"
      fontWeight: 600
      lineHeight: 1.3
      letterSpacing: "-0.005em"

    h3:
      fontSize: "18px"
      fontWeight: 600
      lineHeight: 1.4
      letterSpacing: 0

    body:
      fontSize: "14px"
      fontWeight: 400
      lineHeight: 1.5
      letterSpacing: 0

    label:
      fontSize: "12px"
      fontWeight: 500
      lineHeight: 1.4
      letterSpacing: "0.01em"

    small:
      fontSize: "12px"
      fontWeight: 400
      lineHeight: 1.4
      letterSpacing: 0

    display:
      fontSize: "32px"
      fontWeight: 700
      lineHeight: 1.1
      letterSpacing: "-0.02em"
```

---

### **Spacing**

```yaml
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"

  # Preset combinations
  padding:
    container: "24px"
    card: "16px"
    section: "32px"

  gap:
    compact: "8px"
    normal: "16px"
    relaxed: "24px"
    spacious: "32px"
```

---

### **Border Radius**

```yaml
borderRadius:
  none: "0"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"

  # Component-specific
  components:
    card: "12px"
    button: "8px"
    input: "8px"
    avatar: "50%"
    donut: "0"
```

---

### **Shadows**

```yaml
shadows:
  none: "none"
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)"
  md: "0 4px 6px rgba(0, 0, 0, 0.1)"
  lg: "0 10px 15px rgba(0, 0, 0, 0.2)"
  xl: "0 20px 25px rgba(0, 0, 0, 0.3)"

  # Component-specific (dark mode)
  card: "0 4px 12px rgba(0, 0, 0, 0.4)"
  kpi:
    normal: "0 0 20px rgba(color, 0.1)"
    poupanca: "0 0 20px rgba(0, 255, 136, 0.3)"
  glow:
    sm: "0 0 10px rgba(color, 0.2)"
    md: "0 0 20px rgba(color, 0.3)"
    lg: "0 0 30px rgba(color, 0.4)"
```

---

### **Transitions & Animations**

```yaml
transitions:
  fast: "0.15s ease-in-out"
  normal: "0.3s ease-in-out"
  slow: "0.5s ease-in-out"

  easing:
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)"
    easeIn: "cubic-bezier(0.4, 0, 1, 1)"
    easeOut: "cubic-bezier(0, 0, 0.2, 1)"

animations:
  fadeIn:
    duration: "200ms"
    easing: "easeInOut"

  slideUp:
    duration: "300ms"
    easing: "easeOut"
    distance: "20px"

  pulse:
    duration: "2s"
    iterations: "infinite"

  shimmer:
    duration: "1.5s"
    iterations: "infinite"
```

---

## 🎨 Component Design Tokens

### **Button**

```yaml
button:
  sizes:
    xs:
      height: "24px"
      padding: "4px 8px"
      fontSize: "12px"
    sm:
      height: "32px"
      padding: "8px 12px"
      fontSize: "12px"
    md:
      height: "40px"
      padding: "10px 16px"
      fontSize: "14px"
    lg:
      height: "48px"
      padding: "12px 20px"
      fontSize: "14px"

  variants:
    primary:
      background: "linear-gradient(135deg, #00FF88, #00D4FF)"
      color: "#1A1D23"
      border: "none"

    secondary:
      background: "#3C4350"
      color: "#F1F5F9"
      border: "1px solid #4A515E"

    ghost:
      background: "transparent"
      color: "#F1F5F9"
      border: "1px solid #4A515E"

  states:
    hover:
      opacity: 0.9
      transform: "scale(1.02)"

    active:
      opacity: 0.8

    disabled:
      opacity: 0.5
      cursor: "not-allowed"

    loading:
      opacity: 0.8
      pointerEvents: "none"
```

---

### **KPI Card**

```yaml
kpiCard:
  dimensions:
    width: "280px"
    height: "120px"
    borderRadius: "12px"

  spacing:
    padding: "16px"
    gap: "8px"

  styling:
    border: "1.5px solid"
    borderColor: "gradient-color @ 30% opacity"
    boxShadow: "0 0 20px rgba(color, 0.1)"

  elements:
    icon:
      size: "16px"
    label:
      fontSize: "12px"
      color: "text.secondary"
    value:
      fontSize: "32px"
      fontWeight: 700
    badge:
      fontSize: "12px"
      fontWeight: 600
    projected:
      fontSize: "12px"
      color: "text.subtle"
    percentage:
      fontSize: "12px"
      fontWeight: 600

  states:
    hover:
      borderColor: "brighter"
      boxShadow: "increased 20%"

    loading:
      background: "skeleton gradient"
      animation: "shimmer"

  special:
    poupanca:
      boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)"
      pulse: true
```

---

### **Donut Chart**

```yaml
donutChart:
  dimensions:
    width: "320px"
    height: "320px"
    radius:
      outer: "100px"
      inner: "60px"

  styling:
    strokeWidth: "8px"
    startAngle: 90
    endAngle: -90

  legend:
    layout: "vertical"
    position: "right"
    format: "Label: XX%"

  labels:
    show: true
    format: "Category: R$ XXX (XX%)"
    position: "outside"
    color: "#F1F5F9"
    fontSize: "12px"
    fontWeight: 500

  colors:
    fromPalette: "donuts"

  interactions:
    hover:
      brightness: "1.15"
    tooltip:
      format: "Category\nR$ XXXX (XX%)"
```

---

### **Bar Chart**

```yaml
barChart:
  dimensions:
    height: "280px"
    margin: "{ top: 20, right: 30, bottom: 20, left: 60 }"

  bars:
    color: "linear-gradient(180deg, #00D4FF 0%, #0891B2 50%, #164E63 100%)"
    radius: "[4, 4, 0, 0]"
    fillOpacity: 0.8

  grid:
    horizontal: true
    horizontalColor: "rgba(148, 163, 184, 0.1)"
    vertical: false

  axes:
    fontSize: "12px"
    color: "#94A3B8"
    yAxisFormat: "R$ XXXX"

  tooltip:
    format: "Day/Period: R$ XXXX"
    backgroundColor: "#2D323D"
    border: "1px solid #4A515E"

  animations:
    onLoad:
      duration: "500ms"
      type: "drawBars"
```

---

### **Progress Bar**

```yaml
progressBar:
  dimensions:
    height: "24px"
    borderRadius: "12px"

  container:
    background: "#334155"
    border: "none"

  fill:
    gradients:
      meta1: "linear-gradient(90deg, #06B6D4 0%, #10B981 100%)"
      meta2: "linear-gradient(90deg, #10B981 0%, #BD3AF5 100%)"
    animation:
      duration: "800ms"
      easing: "easeOut"

  icon:
    sparkle: "✨"
    size: "12px"
    position: "left-aligned"

  labels:
    value:
      fontSize: "12px"
      fontWeight: 600
      position: "inside-right"
```

---

### **Chat Widget**

```yaml
chatWidget:
  closed:
    icon:
      size: "32px"
      background: "gradient"
      border: "2px solid"
    button:
      width: "44px"
      height: "44px"
      borderRadius: "50%"
    badge:
      size: "20px"
      borderRadius: "50%"
      background: "#FF4757"

  open:
    dimensions:
      width: "360px"
      maxWidth: "100%"
      maxHeight: "480px"

    header:
      height: "48px"
      padding: "12px"
      background: "card.bg"
      borderBottom: "1px solid border"

    messages:
      maxHeight: "400px"
      scrollBehavior: "smooth"
      padding: "12px"

    input:
      height: "44px"
      padding: "8px 12px"
      fontSize: "14px"
      borderRadius: "8px"

    border:
      width: "2px"
      gradient: "linear-gradient(135deg, #00D4FF, #00FF88)"
      borderRadius: "12px"

  message:
    user:
      alignment: "right"
      background: "linear-gradient(135deg, #3B82F6, #8B5CF6)"
      color: "#FFFFFF"
      borderRadius: "12px"

    ai:
      alignment: "left"
      background: "card.bg"
      color: "#F1F5F9"
      borderLeft: "3px solid #00D4FF"
      borderRadius: "8px"

  animations:
    open: "slideIn 300ms + backdropFade 200ms"
    close: "slideOut 200ms"
    newMessage: "slideUp 150ms"
```

---

## 🔧 Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark backgrounds
        'dark-bg': '#1A1D23',
        'dark-bg-secondary': '#252A33',
        'dark-card': '#2D323D',
        'dark-hover': '#3C4350',
        'dark-border': '#4A515E',

        // Text
        'text-primary': '#F1F5F9',
        'text-secondary': '#CBD5E1',
        'text-subtle': '#94A3B8',

        // Neon
        'neon-green': '#00FF88',
        'neon-cyan': '#00D4FF',
        'neon-red': '#FF4757',
        'neon-pink': '#FF6B9D',
        'neon-blue': '#3B82F6',
        'neon-purple': '#BD3AF5',
        'neon-orange': '#FF9500',
        'neon-gold': '#FFD700',
      },

      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },

      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },

      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-pink': '0 0 20px rgba(255, 107, 157, 0.2)',
        'kpi': '0 0 20px rgba(var(--color-rgb), 0.1)',
      },

      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },

      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 136, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

## 📐 Breakpoint Configuration

```javascript
// breakpoints.js or in tailwind.config.js
export const breakpoints = {
  xs: '0px',      // Default
  sm: '640px',    // Tablet
  md: '768px',    // Small desktop
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px', // Extra large
};

// Usage in Tailwind
// sm:  = 640px and up
// md:  = 768px and up
// lg:  = 1024px and up
// xl:  = 1280px and up
```

---

## 🎬 Animation Library

```javascript
// animations.js
export const animations = {
  fadeIn: {
    duration: 200,
    easing: 'easeInOut',
  },

  slideUp: {
    duration: 300,
    easing: 'easeOut',
    distance: 20,
  },

  slideIn: {
    duration: 300,
    easing: 'easeOut',
    direction: 'bottom-right',
  },

  pulse: {
    duration: 2000,
    iterations: 'infinite',
  },

  shimmer: {
    duration: 1500,
    iterations: 'infinite',
  },
};
```

---

## 🔌 Integration Checklist

- [ ] Install Tailwind CSS
- [ ] Configure Tailwind with dark mode
- [ ] Add custom colors and spacing
- [ ] Add custom animations
- [ ] Install Recharts
- [ ] Install Shadcn/ui
- [ ] Setup theme context for dark/light toggle
- [ ] Create reusable component wrappers
- [ ] Test color contrast (WCAG AA)
- [ ] Test responsive behavior
- [ ] Test animations performance

---

**Design System Version:** 1.0.0
**Last Updated:** 2026-02-20
**Status:** Ready for Implementation
