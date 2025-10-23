import { useOperations } from './hooks/useOperations';
import { FormProvider } from './namespace';

export const Form = () => {
  const { handleChange, handleValidate, handleSubmit, errors } = useOperations();

  return (
    <FormProvider>
      <FormProvider.Textfield
        label="Name"
        error={errors.name}
        onChange={(e) => {
          handleChange('name', e.target.value);
        }}
      />

      <FormProvider.Textfield
        label="Email"
        error={errors.email}
        onChange={(e) => {
          handleChange('name', e.target.value);
        }}
      />

      <FormProvider.TextArea
        label="Description"
        error={errors.description}
        onChange={(e) => {
          handleChange('name', e.target.value);
        }}
      />

      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </FormProvider>
  );
};
