import { createContext, useContext, useState } from 'react';
import type { IForm, IFormContext, IFormProvider } from './types';
import { Textfield } from '@shared/components/Textfield';
import { TextArea } from '@/shared/components/TextArea';

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


FormProvider.Textfield = Textfield
FormProvider.TextArea = TextArea