import { useHooks1 } from './useHooks1';
import { useHooks2 } from './useHooks2';

export const useCalcultion = () => {
  const { hooks1 } = useHooks1();
  const { hooks2 } = useHooks2();

  return {
    calculation: () => {
      return 1 + 1;
    },
  };
};
