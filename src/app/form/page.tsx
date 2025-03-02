"use client";
import FormPage from "@/components/FormPage";
import { useFormStore } from "../(store)/formDataStore";

const Form = () => {
  const { formData, setFormData } = useFormStore();
  return (
    <div>
      <FormPage formData={formData} setFormData={setFormData} />
    </div>
  );
};

export default Form;
