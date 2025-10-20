import type { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export interface SidebarProps {
  isOpen: boolean;
}

export interface NavigationItem {
  href: string;
  icon: string;
  label: string;
}

export interface ILayout {
  children: ReactNode;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: '/', icon: '🏠', label: 'Home' },
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/profile', icon: '👤', label: 'Profile' },
  { href: '/settings', icon: '⚙️', label: 'Settings' },
];

export const SECONDARY_NAVIGATION_ITEMS: NavigationItem[] = [
  { href: '/help', icon: '❓', label: 'Help' },
  { href: '/logout', icon: '🚪', label: 'Logout' },
];
