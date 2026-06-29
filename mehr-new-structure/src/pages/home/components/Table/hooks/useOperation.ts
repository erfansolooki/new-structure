import { useColumns } from './useColumns';
import { useRows } from './useRows';

export const useOperations = () => {
  const { columns } = useColumns();
  const { rows, isLoading, pagination } = useRows();
  return {
    columns,
    rows,
    isLoading,
    pagination,
  };
};
