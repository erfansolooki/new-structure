import { useState } from 'react';
import { useStore } from '@/helpers/feature/store';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import styles from './style.module.scss';
import type { ILayout } from './types';

export const Layout = ({ children }: ILayout) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useStore();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`${styles.layout} ${styles[theme]}`}>
      <Header onToggleSidebar={toggleSidebar} />

      <div className={styles.container}>
        <Sidebar isOpen={sidebarOpen} />
        <main className={styles.main}>{children}</main>
      </div>

      <Footer />
    </div>
  );
};
