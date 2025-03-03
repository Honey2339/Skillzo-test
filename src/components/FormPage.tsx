"use client";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import WorkExpSection from "./WorkExpSection";
import { FormData, WorkExpSectionProps } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function FormPage({
  formData,
  setFormData,
}: WorkExpSectionProps) {
  const router = useRouter();
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;

    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-zinc-900 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Please Check Your Information
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Full Name
                      </label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="yoe"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Years of Experience
                      </label>
                      <Input
                        type="number"
                        name="yoe"
                        id="yoe"
                        value={formData.yoe}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
                        placeholder="5"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Skills
                  </label>
                  <Textarea
                    name="skills"
                    id="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
                    placeholder="JavaScript, React, Node.js, Tailwind CSS, etc."
                    required
                  ></Textarea>
                  <p className="mt-1 text-sm text-gray-400">
                    Separate skills with commas
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="education"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Education
                  </label>
                  <Textarea
                    name="education"
                    id="education"
                    value={formData.education}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
                    placeholder="BSc Computer Science, University of Technology (2018-2022)"
                    required
                  ></Textarea>
                </div>

                {/* <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Work Experience
                  </label>
                  <Textarea
                    name="experience"
                    id="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
                    placeholder="Senior Frontend Developer at Tech Inc. (2020-Present)"
                  ></Textarea>
                </div> */}
                <WorkExpSection formData={formData} setFormData={setFormData} />

                <div>
                  <label
                    htmlFor="projects"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Projects ("Separate projects with commas")
                  </label>
                  <Textarea
                    name="projects"
                    id="projects"
                    value={formData.projects}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
                    placeholder="E-commerce Platform, Portfolio Website, etc."
                  ></Textarea>
                </div>

                <div>
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Contact Information
                  </label>
                  <Textarea
                    name="contact"
                    id="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
                    placeholder="Email, Phone, LinkedIn, GitHub, etc."
                  ></Textarea>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => router.push("/chat")}
                    type="submit"
                    variant="secondary"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
