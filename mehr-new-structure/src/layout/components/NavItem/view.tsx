import type { INavItem } from './types';
import styles from './style.module.scss';

export const NavItem = ({ href, icon, label }: INavItem) => {
  const isActive = window.location.pathname === href;

  return (
    <li className={styles.navItem}>
      <a href={href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
        <span className={styles.navIcon}>{icon}</span>
        <span className={styles.navLabel}>{label}</span>
      </a>
    </li>
  );
};
