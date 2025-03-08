"use client";
import FormPage from "@/components/FormPage";
import { useFormStore } from "../(store)/formDataStore";
import DynamicForm from "@/components/DynamicForm";

const Form = () => {
  const { formData, setFormData } = useFormStore();
  const handleOnSubmit = (data: any) => {};
  return (
    <div>
      {/* <FormPage formData={formData} setFormData={setFormData} /> */}
      <DynamicForm initialData={formData} onSubmit={handleOnSubmit} />
    </div>
  );
};

export default Form;
