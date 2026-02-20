# Design Documentation - Dashboard Financeiro

**Data:** 2026-02-20
**Versão:** 1.0.0
**Status:** ✅ Ready for Development

---

## 📚 Complete Design Package

Este pacote contém toda a documentação necessária para implementar o Dashboard Financeiro Pessoal. Inclui wireframes, especificações técnicas, design system e prompts para geração automática de código.

---

## 📋 Arquivos Criados

### **1. 🎨 Wireframes (ASCII + Anotações)**
**Arquivo:** Consulte outputs/wireframes/
**Conteúdo:**
- Layout visual completo da dashboard
- 4 KPI cards com gradientes neon
- Gráficos donuts com cores distintas
- Gráfico de barras vertical
- Top 5 tables lado a lado
- Progress bars para metas
- Chat widget flutuante
- Anotações sobre cores, espaçamento, estados

---

### **2. 📄 Frontend Specification (`front-end-spec.md`)**
**Tamanho:** ~800 linhas
**Conteúdo Completo:**

```
✅ Design System Overview (grid, layout, breakpoints)
✅ Color Palette (dark mode + light mode)
✅ Typography (scale, font family, sizes)
✅ Spacing Scale (xs-3xl)
✅ Border Radius & Shadows
✅ Component Specifications:
   - Header (sticky, 64px)
   - KPI Cards (4 cards, gradients)
   - Donut Charts (Recharts config)
   - Bar Chart (vertical, animated)
   - Top 5 Tables (expenses & income)
   - Progress Bars (metas)
   - Chat Widget (floating, 360px)
✅ User Interactions (period selection, theme toggle, chat)
✅ Responsive Design (mobile/tablet/desktop)
✅ Accessibility (WCAG AA)
✅ Animations & Transitions
✅ Component Tree (React hierarchy)
✅ Implementation Phases (4 phases)
✅ Testing Checklist (functional, visual, responsive, a11y, performance)
```

**Como Usar:**
1. Leia section-by-section para entender cada component
2. Use as referência durante desenvolvimento
3. Valide implementação contra specs

---

### **3. 🎯 Design System (`design-system.md`)**
**Tamanho:** ~600 linhas
**Conteúdo:**

```
✅ Design Tokens (YAML format):
   - Colors (dark/light modes)
   - Typography (scale, family, weights)
   - Spacing (xs-3xl scale)
   - Border Radius
   - Shadows
   - Transitions & Animations

✅ Component Design Tokens:
   - Button (sizes, variants, states)
   - KPI Card (dimensions, styling, states)
   - Donut Chart (config, colors, interactions)
   - Bar Chart (bars, axes, animations)
   - Progress Bar (dimensions, fills)
   - Chat Widget (closed/open states)

✅ Tailwind CSS Configuration:
   - Custom colors
   - Custom spacing
   - Custom border radius
   - Custom shadows
   - Custom animations

✅ Breakpoint Configuration
✅ Animation Library (reference)
✅ Integration Checklist
```

**Como Usar:**
1. Copie o `tailwind.config.js` para seu projeto
2. Use tokens como referência em CSS/Tailwind classes
3. Adapte conforme necessário

---

### **4. 🚀 v0.dev/Lovable Prompts (`v0-lovable-prompts.md`)**
**Tamanho:** ~400 linhas
**8 Prompts Estruturados:**

```
📋 Prompt 1: Dashboard Layout & Header
   - Header structure
   - Period selector
   - Responsive design

📋 Prompt 2: KPI Cards (4 Cards)
   - Receitas, Despesas, Saldo, % Poupança
   - Gradients específicos
   - Colors por estado
   - Animations

📋 Prompt 3: Donut Charts (Recharts)
   - Despesas por categoria
   - Receitas por categoria
   - Colors distintas
   - Legend & labels

📋 Prompt 4: Bar Chart
   - Vertical bars
   - Gradient fill
   - Axes, grid, tooltip
   - Animation on load

📋 Prompt 5: Top 5 Tables
   - Expenses & Income
   - Border-left gradient
   - Responsive layout

📋 Prompt 6: Progress Bars
   - 2 metas (mensal & anual)
   - Gradient fills
   - Animation on load

📋 Prompt 7: Chat Widget
   - Floating position
   - Open/closed states
   - Message styling
   - Animations

📋 Prompt 8: Theme Toggle
   - Dark/light mode
   - localStorage persistence
   - CSS variables
```

**Como Usar:**
1. Crie um novo projeto em v0.dev ou Lovable
2. Use **Prompt 1** como base (dashboard shell)
3. Então use **Prompt 8** (theme toggle)
4. Depois os demais prompts (2-7) para components
5. Copy/paste código gerado no seu projeto

---

## 🎨 Color Reference

### **Gradients (4 KPIs)**
```
Receitas:       #00FF88 → #00D4FF (Verde → Cyan)
Despesas:       #FF4757 → #FF6B9D (Vermelho → Rosa)
Saldo:          #3B82F6 → #BD3AF5 (Azul → Roxo)
% Poupança:     #00FF88 → #06B6D4 (Verde → Cyan)
Metas:          #06B6D4 → #10B981 (Cyan → Verde)
Bar Chart:      #06B6D4 → #0891B2 → #164E63
```

### **Donut Colors**
```
DESPESAS:
  Alimentação:  #FF4757 (Vermelho)
  Moradia:      #BD3AF5 (Roxo)
  Transporte:   #FF9500 (Laranja)
  Saúde:        #00D4FF (Cyan)
  Lazer:        #FFD700 (Ouro)
  Outros:       #A78BFA (Roxo claro)

RECEITAS:
  Salário:      #00FF88 (Verde neon)
  Freelance:    #00D4FF (Cyan neon)
  Outros:       #FFD700 (Ouro)
```

### **Backgrounds**
```
Dark Mode (Primary):
  Primary BG:   #1A1D23
  Secondary BG: #252A33
  Card BG:      #2D323D
  Hover:        #3C4350
  Border:       #4A515E

Light Mode:
  Primary BG:   #FFFFFF
  Secondary BG: #F8FAFC
  Card BG:      #F1F5F9
```

---

## 📐 Spacing Reference

```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px

Container padding: 24px
Section gap: 32px
Component gap: 16px
```

---

## 🔤 Typography Reference

```
Display (KPI values):
  32px, Weight 700

H1/H2 (Section titles):
  24px, Weight 600

Body (Default):
  14px, Weight 400

Label (Form labels, captions):
  12px, Weight 500

Small (Helper text):
  12px, Weight 400

Font Family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

---

## 📱 Responsive Breakpoints

```
Mobile:   < 640px   (single column, stacked)
Tablet:   640-1024px (2 columns, adjusted spacing)
Desktop:  > 1024px   (full layout as designed)
```

---

## 🚀 Quick Start Guide

### **Option 1: Use v0.dev/Lovable (Fastest)**

1. Create project in [v0.dev](https://v0.dev) or [Lovable](https://lovable.dev)
2. Open `docs/design/v0-lovable-prompts.md`
3. Copy **Prompt 1** (Dashboard Layout)
4. Paste in v0/Lovable chat
5. Wait for generated code
6. Repeat for Prompts 2-8 (add components one by one)
7. Combine all components in your main page

**Time estimate:** 2-3 hours for complete UI

### **Option 2: Manual Implementation (More Control)**

1. Create Next.js project
2. Install: `npm install recharts shadcn-ui tailwindcss`
3. Copy `tailwind.config.js` from Design System
4. Read `front-end-spec.md` for component specs
5. Implement components following specs
6. Test against Frontend Spec checklist

**Time estimate:** 8-12 hours for complete UI

### **Option 3: Hybrid (Recommended)**

1. Use v0.dev to generate initial components (Prompts 1-7)
2. Copy generated code to your project
3. Customize using `front-end-spec.md` for fine-tuning
4. Add API integration using Frontend Spec
5. Test against checklists

**Time estimate:** 4-6 hours for complete UI

---

## ✅ Implementation Checklist

### **Phase 1: Setup**
- [ ] Create React/Next.js project
- [ ] Install Recharts, Tailwind, Shadcn/ui
- [ ] Configure Tailwind with custom theme
- [ ] Setup theme toggle (dark/light mode)

### **Phase 2: Layout & Components**
- [ ] Build Header component
- [ ] Build KPI Cards
- [ ] Build Donut Charts
- [ ] Build Bar Chart
- [ ] Build Top 5 Tables
- [ ] Build Progress Bars
- [ ] Build Chat Widget

### **Phase 3: Interactions**
- [ ] Period selector functionality
- [ ] Theme toggle persistence
- [ ] Chat message handling
- [ ] Resincronizar button
- [ ] API integration

### **Phase 4: Polish**
- [ ] Responsive design refinement
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Animation smoothness

---

## 📊 Design Decisions

### **Why Dark Mode First?**
- Neon colors pop better on dark backgrounds
- More modern, appealing aesthetic
- Reduces eye strain for financial analysis
- Light mode can be easily toggled

### **Why 4 KPIs instead of 3?**
- % Poupança is critical metric for financial health
- Shows savings rate vs target (70% goal)
- Distinguishes this dashboard from basic trackers
- Deserves its own prominent card with pulse animation

### **Why Neon Gradients?**
- Creates modern, premium feel
- Each KPI has unique gradient for quick visual recognition
- Aligns with portfolio appeal (mentioned in PRD)
- Neon colors are trendy in fintech UI

### **Why Recharts?**
- Lightweight, no dependencies
- Easy responsive behavior
- Good animation support
- Works well with Tailwind CSS
- Community support and examples

### **Why Floating Chat (not fixed bottom)?**
- Less intrusive, can be minimized
- Consistent with modern chat UX
- Works well on mobile with drawer
- Can be easily repositioned

---

## 🔗 File Structure

```
docs/
├── design/
│   ├── README.md (this file)
│   ├── front-end-spec.md (complete specs)
│   ├── design-system.md (tokens & config)
│   ├── v0-lovable-prompts.md (8 prompts)
│   ├── references/ (design images you provided)
│   │   ├── image.png
│   │   ├── image1.png
│   │   ├── image2.png
│   │   ├── image3.png
│   │   ├── image4.png
│   │   └── image5.png
│   └── wireframes/
│       └── (ASCII wireframes from session)

outputs/
└── (will contain generated components)
```

---

## 🤝 Next Steps

### **Immediate (Next 1-2 hours):**
1. Choose implementation path (v0.dev, manual, or hybrid)
2. Set up project foundation
3. Configure theme system
4. Test dark/light mode toggle

### **Short-term (Next 1 week):**
1. Generate/implement all components
2. Integrate with API
3. Test period selection
4. Style Chat widget

### **Medium-term (Next 2 weeks):**
1. Accessibility audit (WCAG AA)
2. Performance optimization
3. Cross-browser testing
4. Mobile refinement

### **Long-term (Phase 2):**
1. Advanced features (alerts, exports, etc.)
2. Analytics integration
3. User preferences
4. Advanced chat capabilities

---

## 📞 Questions & Support

### **If you need to adjust:**
- **Colors:** See `design-system.md` → Edit color tokens
- **Layout:** See `front-end-spec.md` → Adjust spacing/grid
- **Components:** See `v0-lovable-prompts.md` → Modify prompts
- **Typography:** See `design-system.md` → Update scale

### **Common Issues:**
- Contrast too low? → Adjust text color in light mode
- Charts too small? → Adjust size in prompt
- Mobile layout broken? → Review responsive breakpoints
- Animations janky? → Reduce animation complexity

---

## 📈 Success Metrics

Once implemented, the dashboard should:
- ✅ Load in < 2 seconds
- ✅ Show all KPIs with correct calculations
- ✅ Render gráficos smoothly (60fps)
- ✅ Handle period selection instantly
- ✅ Chat responds in < 5 seconds
- ✅ Pass WCAG AA accessibility
- ✅ Work on mobile/tablet/desktop
- ✅ Theme toggle persists on reload

---

## 📝 Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-20 | Initial design package created |

---

**Design Package Version:** 1.0.0
**Status:** ✅ Complete and Ready for Implementation
**Next Action:** Choose implementation path and start building!

🎨 Happy building! — Uma, desenhando com empatia 💝
