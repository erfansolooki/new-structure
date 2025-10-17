import { useGetSthForHomePage } from "./hooks/useGetSthForHomePage";
import styles from './styles.module.css';
import type { IHome } from "./types";

export const Home = ({ name }: IHome) => {
  const sthForHomePage = useGetSthForHomePage();

  return <div className={styles.home}>{name}</div>;
};
