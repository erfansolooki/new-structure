import { FormProvider } from './namespace';

export const Form = () => {
  return (
    <FormProvider>
      <FormProvider.Textfield label="Name"  error='Name is required'/>

      <FormProvider.Textfield label="Email" error='Email is required' />

      <FormProvider.TextArea label="Description" error='Description is required' />

    <button type="submit">Submit</button>
  </FormProvider>
)};