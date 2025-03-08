import { create } from "zustand";

interface FormState {
  formData: any;
  setFormData: (data: any) => void;
}

export const useFormStore = create<FormState>((set) => ({
  formData: {},
  setFormData: (data) => set({ formData: data }),
}));
