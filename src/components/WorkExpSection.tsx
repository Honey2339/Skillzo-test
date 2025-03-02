import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const WorkExpSection = ({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) => {
  const [workExperiences, setWorkExperiences] = useState(
    formData.workExperiences?.length > 0
      ? formData.workExperiences
      : [
          {
            id: Date.now(),
            employer: "",
            jobTitle: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
          },
        ]
  );
  const addWorkExperience = () => {
    const newExperience = {
      id: Date.now(),
      employer: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    const updatedExperiences = [...workExperiences, newExperience];
    setWorkExperiences(updatedExperiences);

    setFormData({
      ...formData,
      workExperiences: updatedExperiences,
    });
  };

  const removeWorkExperience = (id: any) => {
    const updatedExperiences = workExperiences.filter(
      (exp: any) => exp.id !== id
    );
    setWorkExperiences(updatedExperiences);
    setFormData({
      ...formData,
      workExperiences: updatedExperiences,
    });
  };
  const handleExperienceChange = (id, field, value) => {
    const updatedExperiences = workExperiences.map((exp) => {
      if (exp.id === id) {
        if (field === "current") {
          return {
            ...exp,
            [field]: value,
            endDate: value ? "" : exp.endDate,
          };
        }
        return { ...exp, [field]: value };
      }
      return exp;
    });

    setWorkExperiences(updatedExperiences);
    setFormData({
      ...formData,
      workExperiences: updatedExperiences,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="block text-sm font-medium text-gray-300">
          Work Experience
        </h2>
        <button
          type="button"
          onClick={addWorkExperience}
          className="flex items-center text-sm text-blue-400 hover:text-blue-300"
        >
          <PlusCircle className="mr-1 h-4 w-4" />
          Add Experience
        </button>
      </div>

      {workExperiences.map((experience, index) => (
        <div
          key={experience.id}
          className="p-4 bg-zinc-900 rounded-lg border border-zinc-500"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium">Position {index + 1}</h3>
            {workExperiences.length > 1 && (
              <button
                type="button"
                onClick={() => removeWorkExperience(experience.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Job Title
              </label>
              <Input
                type="text"
                value={experience.jobTitle}
                onChange={(e) =>
                  handleExperienceChange(
                    experience.id,
                    "jobTitle",
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
                placeholder="Senior Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Employer
              </label>
              <Input
                type="text"
                value={experience.employer}
                onChange={(e) =>
                  handleExperienceChange(
                    experience.id,
                    "employer",
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
                placeholder="Tech Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={experience.startDate}
                onChange={(e) =>
                  handleExperienceChange(
                    experience.id,
                    "startDate",
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <Input
                type="date"
                value={experience.endDate}
                onChange={(e) =>
                  handleExperienceChange(
                    experience.id,
                    "endDate",
                    e.target.value
                  )
                }
                className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
                disabled={experience.current}
              />

              <div className="flex items-center mt-2">
                <Input
                  type="checkbox"
                  id={`current-${experience.id}`}
                  checked={experience.current}
                  onChange={(e) =>
                    handleExperienceChange(
                      experience.id,
                      "current",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-gray-500 text-purple-600 focus:ring-purple-500 bg-gray-700"
                />
                <label
                  htmlFor={`current-${experience.id}`}
                  className="ml-2 text-sm text-gray-300"
                >
                  I currently work here
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Job Description
            </label>
            <Textarea
              value={experience.description}
              onChange={(e) =>
                handleExperienceChange(
                  experience.id,
                  "description",
                  e.target.value
                )
              }
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
              placeholder="Describe your responsibilities and accomplishments..."
            ></Textarea>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkExpSection;
