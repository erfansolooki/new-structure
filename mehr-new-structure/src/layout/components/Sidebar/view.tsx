import { NAVIGATION_ITEMS, SECONDARY_NAVIGATION_ITEMS } from '../../types';
import { NavItem } from '../NavItem';
import styles from './style.module.scss';
import type { ISidebar } from './types';

export const Sidebar = ({ isOpen }: ISidebar) => {
  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''}`}>
      <nav className={styles.sidebarNav}>
        <ul className={styles.navList}>
          {NAVIGATION_ITEMS.map((item) => (
            <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
          ))}
        </ul>

        <div className={styles.divider}>
          <ul className={styles.navList}>
            {SECONDARY_NAVIGATION_ITEMS.map((item) => (
              <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};
