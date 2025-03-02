export type WorkExperience = {
  id: number;
  employer: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type FormData = {
  name: string;
  yoe: string;
  skills: string;
  education: string;
  workExperiences: WorkExperience[];
  projects: string;
  certifications: string;
  languages: string;
  contact: string;
};

export type WorkExpSectionProps = {
  formData: FormData;
  setFormData: (data: FormData) => void;
};
