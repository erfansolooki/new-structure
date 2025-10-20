# Layout Component

A comprehensive, modular layout system with header, sidebar, main content area, and footer.

## Features

- ✅ **Responsive Design** - Mobile-friendly with collapsible sidebar
- ✅ **Theme Support** - Light/Dark mode with CSS variables
- ✅ **Modular Components** - Separated Header, Sidebar, Footer, and NavItem
- ✅ **CSS Modules** - Scoped styling with SCSS
- ✅ **TypeScript** - Fully typed components
- ✅ **Zustand Integration** - State management for theme and user
- ✅ **Sticky Header** - Always visible navigation
- ✅ **Active State** - Highlights current page in navigation
- ✅ **Accessibility** - ARIA labels and keyboard navigation

## Structure

```
layout/
├── components/
│   ├── Header.tsx       # Top navigation bar
│   ├── Sidebar.tsx      # Side navigation menu
│   ├── Footer.tsx       # Bottom footer
│   ├── NavItem.tsx      # Navigation link component
│   └── index.ts         # Component exports
├── style.module.scss    # All styles
├── types.ts             # TypeScript types and constants
├── view.tsx             # Main Layout component
├── index.ts             # Public exports
└── README.md            # Documentation
```

## Usage

### Basic Usage

```tsx
import { Layout } from '@/layout';

function App() {
  return (
    <Layout>
      <h1>Your Page Content</h1>
      <p>Content goes here...</p>
    </Layout>
  );
}
```

### With Router

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
```

## Components

### Layout

Main wrapper component that combines all layout elements.

**Props:**

- `children: ReactNode` - Content to render in the main area

### Header

Top navigation bar with menu toggle, theme switcher, and user info.

**Props:**

- `onToggleSidebar: () => void` - Callback to toggle sidebar

### Sidebar

Side navigation menu with primary and secondary navigation items.

**Props:**

- `isOpen: boolean` - Controls sidebar visibility

### Footer

Bottom footer with copyright information.

### NavItem

Individual navigation link with icon and label.

**Props:**

- `href: string` - Link destination
- `icon: string` - Icon (emoji or icon component)
- `label: string` - Link text

## Customization

### Adding Navigation Items

Edit `types.ts`:

```typescript
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: '/', icon: '🏠', label: 'Home' },
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  // Add your items here
];
```

### Styling

Edit `style.module.scss` to customize:

- Colors (via CSS variables)
- Spacing and sizing
- Responsive breakpoints
- Hover effects
- Transitions

**CSS Variables:**

```scss
--bg-primary      // Main background
--bg-secondary    // Secondary background
--bg-tertiary     // Tertiary background
--text-primary    // Primary text color
--text-secondary  // Secondary text color
--border-color    // Border color
--shadow          // Shadow color
--hover-bg        // Hover background
```

### Theme Colors

Customize light/dark theme in `style.module.scss`:

```scss
.layout {
  &.light {
    --bg-primary: #ffffff;
    --text-primary: #000000;
    // ... more variables
  }

  &.dark {
    --bg-primary: #121212;
    --text-primary: #ffffff;
    // ... more variables
  }
}
```

### Using Icons

Replace emoji icons with icon libraries:

```tsx
import { Home, Dashboard, User, Settings } from 'lucide-react';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: '/', icon: <Home size={20} />, label: 'Home' },
  { href: '/dashboard', icon: <Dashboard size={20} />, label: 'Dashboard' },
];
```

## Responsive Behavior

- **Desktop (>768px)**: Full sidebar visible
- **Mobile (≤768px)**:
  - Sidebar becomes an overlay
  - Username hidden in header
  - Reduced padding
  - Smaller font sizes

## Integration

### Zustand Store

The layout integrates with the Zustand store for:

- User information (avatar, name)
- Theme state (light/dark)
- Theme toggle function

Required store interface:

```typescript
interface Store {
  user: { name: string } | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

### Without Zustand

If not using Zustand, modify components to use local state or props:

```tsx
// Example: Pass theme as prop
interface LayoutProps {
  children: ReactNode;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}
```

## Accessibility

- Semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<footer>`)
- ARIA labels for buttons
- Keyboard navigation support
- Focus indicators
- Proper heading hierarchy

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Breadcrumb navigation
- [ ] Notification center
- [ ] Search bar in header
- [ ] User dropdown menu
- [ ] Mobile navigation overlay
- [ ] Persistent sidebar state
- [ ] Multi-level navigation
- [ ] Customizable header actions
