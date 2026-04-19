# Menu Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a cinematic, elegantly styled, dynamic, and filterable Menu section for the AURA website featuring exclusively Pure Veg categories (Chinese, South Indian, Punjabi, Rajasthani).

**Architecture:** A monolithic wrapper React component (`Menu`) that handles `activeCategory` state. It will contain child components/sections for the `CategoryFilterBar` and `MenuGrid`. The styling will strictly adhere to the previously established `@frontend-design` tokens (Cinzel + DM Sans typography, `#0a0a0a` background, and Champagne Gold accents `#c9a776`).

**Tech Stack:** React, Vanilla CSS

---

## Scope
- **In:** Pure vegetarian categorised data schema, filtering state logic, highly polished responsive CSS grid design for menu items matching the "Cinematic Luxury" aesthetic.
- **Out:** Cart/checkout functionality, backend DB connection for the menu items (will use static mock data initially).

---

### Task 1: Create the Menu Data Provider

**Files:**
- Create: `src/data/menuData.js`

**Step 1: Write the minimal implementation**
```javascript
export const CATEGORIES = ['All', 'Chinese', 'South Indian', 'Punjabi', 'Rajasthani'];

export const MENU_ITEMS = [
  { id: 1, name: 'Truffle Edamame Dumplings', price: '$28', desc: 'Hand-pleated crystal skin, white truffle oil, edible gold', category: 'Chinese' },
  { id: 2, name: 'Saffron Paneer Tikka', price: '$32', desc: 'Slow-roasted artisanal cottage cheese, smoked yellow chilli', category: 'Punjabi' },
  { id: 3, name: 'Ghee Roast Dosa', price: '$24', desc: 'Fermented lentil crepe, aged desi ghee, gunpowder dust', category: 'South Indian' },
  { id: 4, name: 'Ker Sangri Galouti', price: '$30', desc: 'Desert beans melt-in-mouth kebabs, warqi paratha', category: 'Rajasthani' },
  { id: 5, name: 'Lotus Stem Honey Chilli', price: '$22', desc: 'Crispy lotus rhizome, wild forest honey, sichuan pepper', category: 'Chinese' },
  { id: 6, name: 'Dal Baati Churma', price: '$36', desc: 'Wood-fired wheat breads, five-lentil stew, sweetened grit', category: 'Rajasthani' }
];
```

**Step 2: Commit**
```bash
git add src/data/menuData.js
git commit -m "feat: add pure veg luxury menu mock data"
```

---

### Task 2: Scaffold Menu Component & CSS

**Files:**
- Create: `src/components/Menu.jsx`
- Create: `src/components/Menu.css`

**Step 1: Write implementation**
Build the skeleton structure with the `activeCategory` state and map through the `CATEGORIES` array to build the filter bar. Define the layout in CSS using the CSS variables.

**CSS Aesthetic Constraints:**
- Category buttons must be minimal text with an animated subtle gold underline when active.
- Menu items should be text-driven, emphasizing the typography without borders (editorial layout).
- Use `opacity: 0.7` for descriptions, full opacity for titles and prices.
- Add micro-animations (staggered fade-up) when changing categories.
- **Dynamic Category-Specific Elements (Crucial):**
  - *Punjabi:* Use rich, warm orange/gold accents for the hover states.
  - *South Indian:* Embed clean, minimalist icons (e.g., banana leaf edge or steam lines).
  - *Chinese:* Keep the UI exceptionally sleek with sharp, modern lines and hard geometric accents.
  - *Rajasthani:* Display a royal "Marwari" border or a subtle mandala pattern in the background of active items.

**Step 2: Commit**
```bash
git add src/components/Menu.jsx src/components/Menu.css
git commit -m "feat: scaffold menu comp and aesthetic styles"
```

---

### Task 3: Implement Dynamic Filtering

**Files:**
- Modify: `src/components/Menu.jsx`

**Step 1: Implementation**
Add a filtered list derivation:
```javascript
const filteredItems = activeCategory === 'All' 
  ? MENU_ITEMS 
  : MENU_ITEMS.filter(item => item.category === activeCategory);
```
Map over `filteredItems` to render the grid.

**Step 2: Commit**
```bash
git commit -am "feat: hook up category filtering state"
```

---

### Task 4: Integration into App

**Files:**
- Modify: `src/App.jsx`

**Step 1: Implementation**
Import `<Menu />` and place it directly beneath the `<Hero />` section. Ensure smooth scroll padding is applied if needed.

**Step 2: Verify in browser**
Run `npm run dev` and test the category switches visually.

**Step 3: Commit**
```bash
git commit -am "feat: integrate menu section into main app"
```
