import { FormData } from "@/lib/types";
import { create } from "zustand";

interface FormStore {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  formData: {
    name: "",
    yoe: "",
    skills: "",
    education: "",
    workExperiences: [],
    projects: "",
    certifications: "",
    languages: "",
    contact: "",
  },
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () =>
    set({
      formData: {
        name: "",
        yoe: "",
        skills: "",
        education: "",
        workExperiences: [],
        projects: "",
        certifications: "",
        languages: "",
        contact: "",
      },
    }),
}));
