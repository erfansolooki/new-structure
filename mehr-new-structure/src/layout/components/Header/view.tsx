import { useStore } from '@/helpers/feature/store';
import styles from './style.module.scss';
import type { IHeader } from './types';

export const Header = ({ onToggleSidebar }: IHeader) => {
  const { user, theme, toggleTheme } = useStore();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button onClick={onToggleSidebar} className={styles.menuButton} aria-label="Toggle sidebar">
          ☰
        </button>
        <h1 className={styles.logo}>Your App Name</h1>
      </div>

      <div className={styles.headerRight}>
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>

        {/* User Info */}
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
            <span className={styles.userName}>{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};
