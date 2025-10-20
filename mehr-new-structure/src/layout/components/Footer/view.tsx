import styles from './style.module.scss';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Your App Name. All rights reserved.</p>
    </footer>
  );
};
