# LumiGlow 25-Point Enterprise Cross-Device & Post-Deployment Testing Checklist

This checklist verifies all aspects of business logic, responsiveness across screens from 320px mobile to 4K monitors, keyboard navigation, theme switching, idempotency, and SRE resilience.

---

## 📱 Mobile Device Tests (320px – 767px)

1. **iOS Safari 16px Font Auto-Zoom Prevention**
   - *Test*: Open site on iPhone / iOS Safari. Tap into every form input on Checkout and Search.
   - *Expected*: The browser must **NOT** zoom into the field or shift the viewport (verified by global 16px font-size).
2. **Device Orientation & Responsive Reflow**
   - *Test*: Rotate phone from portrait (390px) to landscape (844px).
   - *Expected*: Layout reflows seamlessly without horizontal scrollbars or cut-off content.
3. **Safe-Area Notch & Dynamic Island Inset**
   - *Test*: View on iPhone with notch / Dynamic Island.
   - *Expected*: Content and headers respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
4. **Touch Target Sizing & Spacing (Apple HIG & WCAG 2.5.8)**
   - *Test*: Inspect touch targets for hamburger menu, cart triggers, theme toggle, and chips.
   - *Expected*: All interactive hit areas are at least 44×44 CSS pixels with no overlapping touch areas.
5. **Mobile Navigation Drawer & Swipe-to-Dismiss**
   - *Test*: Open the hamburger navigation menu. Swipe right or tap outside.
   - *Expected*: Drawer smoothly closes; focus is trapped while open and returned to trigger button upon close.
6. **Double-Tap Zoom & Horizontal Overflow Prevention**
   - *Test*: Rapidly tap cards and swipe horizontally along edge.
   - *Expected*: Zero unwanted horizontal scrolling or layout shifts.

---

## 💻 Standard Laptop Tests (1024px – 1366x768)

7. **Navigation Link Wrapping at 1366×768**
   - *Test*: Resize browser window to exactly 1366×768 (standard 13-inch laptop).
   - *Expected*: Navigation links stay neatly on a single line without wrapping to a second line or overflowing.
8. **3-Column Product Grid Scaling**
   - *Test*: Navigate to `/products` on a 1366px screen.
   - *Expected*: Product grid renders cleanly in 3 columns with proportional card spacing.
9. **Sticky Sidebars & Independent Scrolling**
   - *Test*: In Checkout or multi-pane views, scroll long content.
   - *Expected*: Order summary sticky sidebar remains docked without squishing primary form fields.

---

## 🖥️ Desktop & 4K Workstation Tests (1440px – 3840px)

10. **Max-Width Container Line Length Containment (1920×1080 & 4K)**
    - *Test*: Open site maximized on 1080p and 4K displays.
    - *Expected*: Content is capped by `max-w-7xl` / `container-4k` (1280px–1536px); body copy line length never exceeds 75–80 characters for optimal readability.
11. **5-Column 4K Grid Density**
    - *Test*: View `/products` on 1920px+ monitors.
    - *Expected*: Grid automatically scales to 4 or 5 columns utilizing high screen real estate.
12. **Desktop Hover Micro-Interactions with 200ms Protection**
    - *Test*: Hover over product cards and buttons with a mouse.
    - *Expected*: Smooth hover lift with shadow transitions; no ghost clicks on touch hybrid screens.

---

## ⌨️ Accessibility (A11y) & Keyboard Navigation

13. **Visible Focus Rings (WCAG 2.1 AA)**
    - *Test*: Press the `Tab` key 10 times consecutively through the page.
    - *Expected*: High-contrast focus indicator (2px offset ring) is clearly visible on every interactive element.
14. **Escape Key Modal & Drawer Dismissal**
    - *Test*: Open the Quick View modal, Mobile drawer, or Search overlay, then press `Escape`.
    - *Expected*: Dialog closes instantly without React hydration errors; focus returns to the initiating button.
15. **Global <kbd>Cmd+K</kbd> / <kbd>Ctrl+K</kbd> Quick Search**
    - *Test*: Press `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux) anywhere on the site.
    - *Expected*: Site search overlay instantly opens and autofocuses input.
16. **Skip to Main Content Link**
    - *Test*: Focus page and press `Tab` on first load.
    - *Expected*: "Skip to main content" button appears and jumps directly to `#main-content`.

---

## 🌓 Zero-FOUC Theme & Visual Consistency

17. **Dark / Light Mode Toggle with Zero Flash (FOUC)**
    - *Test*: Switch theme to Dark mode, then hard refresh (`Ctrl+F5` / `Cmd+Shift+R`).
    - *Expected*: Page renders directly in dark mode with zero white flash during load.
18. **WCAG 2.1 AA Color Contrast Ratio**
    - *Test*: Inspect text colors against background tokens in both Dark and Light themes.
    - *Expected*: Normal text meets or exceeds 4.5:1 ratio; large text meets or exceeds 3.0:1 ratio.
19. **Mobile Address Bar Sync (`theme-color`)**
    - *Test*: Switch theme on mobile Chrome / Safari.
    - *Expected*: Browser address bar / notch bar adapts to `#120D0A` (dark) or `#FFF8F0` (light).

---

## 🛡️ Business Logic Fortress, Idempotency & SRE Resilience

20. **Idempotent Checkout (Anti-Double-Submit)**
    - *Test*: Fill in checkout form and click "Complete Order" rapidly multiple times.
    - *Expected*: Button immediately disables, shows loading spinner with `aria-busy="true"`, generates single order idempotency key, and prevents duplicate charges.
21. **Stateful URL Query Parameter Persistence**
    - *Test*: On `/products`, select "Serums" filter, search "vitamin", sort by "Price: Low to High", and refresh.
    - *Expected*: URL reflects `?category=serum&q=vitamin&sort=price-low`; full state is restored on refresh.
22. **Parallel & Intercepted Quick-View Modal Link Sharing**
    - *Test*: Click "Quick View" on a product card, copy the URL (`/products?quickView=serum`), open in new tab.
    - *Expected*: Direct navigation loads the page with the Quick View modal already open.
23. **Offline Mode & Exponential Backoff Cache Fallback**
    - *Test*: Toggle browser DevTools to "Offline" and navigate the catalog.
    - *Expected*: Resilient fetcher serves stale-while-revalidate localStorage cache with friendly offline toast.
24. **Global Error Boundary Recovery**
    - *Test*: Trigger a simulated component rendering error.
    - *Expected*: Section error boundary displays friendly isolated fallback with "Try Again" without crashing the entire app.
25. **Hybrid Mouse / Touchscreen 2-in-1 Laptop Immunity**
    - *Test*: Hover over a dropdown menu with a mouse on a 2-in-1 laptop, then tap the touchscreen.
    - *Expected*: Dropdown toggles cleanly on touch and does not get permanently stuck open.
