import { usePostQuery } from './queries/usePostQuery';
import { useGetQuery } from './queries/useGetQuery';
import { useEditQuery } from './queries/useEditQuery';
import type { IForm } from '../types';
import { useFormContext } from '../namespace';

export const useOperations = () => {
  const { data: getData, isPending: isGetPending } = useGetQuery();
  const { data: postData, isPending: isPostPending } = usePostQuery();
  const { data: editData, isPending: isEditPending } = useEditQuery();
  const errors = {
    name: 'Name is required',
    email: 'Email is required',
    description: 'Description is required',
  };

  const handleChange = (field: keyof IForm, value: string) => {
    const { updateFormField } = useFormContext();
    updateFormField(field, value);
  };

  const handleValidate = () => {
    console.log('validate');
  };

  const handleSubmit = () => {
    console.log('submit');
  };

  return {
    getData,
    postData,
    editData,
    isGetPending,
    isPostPending,
    isEditPending,
    errors,
    handleChange,
    handleSubmit,
  };
};
