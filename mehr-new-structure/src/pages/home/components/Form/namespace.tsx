import { createContext, useContext, useState } from 'react';
import type { IForm, IFormContext, IFormProvider } from './types';

const FormContext = createContext<IFormContext | undefined>(undefined);



export const FormProvider = ({ children }: IFormProvider) => {
  const [formData, setFormData] = useState<IForm>({
    name: '',
  });

  const updateFormField = (field: keyof IForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <FormContext.Provider value={{ formData, setFormData, updateFormField }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  
  return context;
};