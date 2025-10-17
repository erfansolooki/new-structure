import type { ReactNode } from "react";

// Form
export interface IForm {
  name: string;
}


// Namespace
export interface IFormProvider {
  children: ReactNode;
}

// Context
export interface IFormContext {
  formData: IForm;
  setFormData: (data: IForm) => void;
  updateFormField: (field: keyof IForm, value: string) => void;
}