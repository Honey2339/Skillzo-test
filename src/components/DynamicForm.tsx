"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import WorkExpSection from "./WorkExpSection";

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface DynamicFormProps {
  initialData: any;
  onSubmit: (data: any) => void;
}

const DynamicForm = ({ initialData, onSubmit }: DynamicFormProps) => {
  const [formData, setFormData] = useState<any>(initialData);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const router = useRouter();

  useEffect(() => {
    const sanitizeInitialData = (data: any): any => {
      if (data === null || data === undefined) {
        return "";
      }

      if (typeof data !== "object") {
        return data;
      }

      if (Array.isArray(data)) {
        return data.map((item) => {
          if (typeof item === "object" && item !== null) {
            return JSON.stringify(item);
          }
          return item;
        });
      }

      const result: any = {};
      for (const key in data) {
        result[key] = sanitizeInitialData(data[key]);
      }
      return result;
    };

    setFormData(sanitizeInitialData(initialData));

    const sections: Record<string, boolean> = {};
    const initExpandedSections = (obj: any, path = "") => {
      if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        Object.keys(obj).forEach((key) => {
          const currentPath = path ? `${path}.${key}` : key;
          sections[currentPath] = true;
          if (obj[key] && typeof obj[key] === "object") {
            initExpandedSections(obj[key], currentPath);
          }
        });
      }
    };

    initExpandedSections(initialData);
    setExpandedSections(sections);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const prepareFormData = (data: any): any => {
      if (data === null || data === undefined || typeof data !== "object") {
        return data;
      }

      if (Array.isArray(data)) {
        return data.map((item) => {
          if (
            typeof item === "string" &&
            ((item.startsWith("{") && item.endsWith("}")) ||
              (item.startsWith("[") && item.endsWith("]")))
          ) {
            try {
              return JSON.parse(item);
            } catch {
              return item;
            }
          }
          return prepareFormData(item);
        });
      }

      const result: any = {};
      for (const key in data) {
        result[key] = prepareFormData(data[key]);
      }
      return result;
    };

    onSubmit(prepareFormData(formData));
    router.push("/chat");
  };

  const toggleSection = (path: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  };

  const updateFormData = (path: string, value: any) => {
    const keys = path.split(".");
    setFormData((prevData: any) => {
      const newData = { ...prevData };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const renderFormField = (key: string, value: JsonValue, path = ""): any => {
    const currentPath = path ? `${path}.${key}` : key;
    const label = formatLabel(key);

    if (value === null || value === undefined || value === "") {
      return (
        <div key={currentPath} className="mb-4">
          <Label
            htmlFor={currentPath}
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {label}
          </Label>
          <Input
            type="text"
            id={currentPath}
            value=""
            onChange={(e) => updateFormData(currentPath, e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </div>
      );
    }
    if (typeof value === "boolean") {
      return (
        <div key={currentPath} className="mb-4 flex items-center">
          <input
            type="checkbox"
            id={currentPath}
            checked={value}
            onChange={(e) => updateFormData(currentPath, e.target.checked)}
            className="mr-2 h-4 w-4"
          />
          <Label
            htmlFor={currentPath}
            className="text-sm font-medium text-gray-300"
          >
            {label}
          </Label>
        </div>
      );
    }

    if (typeof value === "number") {
      return (
        <div key={currentPath} className="mb-4">
          <Label
            htmlFor={currentPath}
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {label}
          </Label>
          <Input
            type="number"
            id={currentPath}
            value={value}
            onChange={(e) =>
              updateFormData(currentPath, Number(e.target.value))
            }
            className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </div>
      );
    }

    if (typeof value === "string") {
      if (
        (value.startsWith("{") && value.endsWith("}")) ||
        (value.startsWith("[") && value.endsWith("]"))
      ) {
        try {
          const parsedValue = JSON.parse(value);
          const prettyValue = JSON.stringify(parsedValue, null, 2);

          return (
            <div key={currentPath} className="mb-4">
              <Label
                htmlFor={currentPath}
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {label}
              </Label>
              <Textarea
                id={currentPath}
                value={prettyValue}
                onChange={(e) => updateFormData(currentPath, e.target.value)}
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white font-mono text-sm"
                placeholder={`Enter valid JSON for ${label.toLowerCase()}`}
              />
              <p className="mt-1 text-sm text-gray-400">
                Enter valid JSON object
              </p>
            </div>
          );
        } catch {}
      }

      if (value.length > 100) {
        return (
          <div key={currentPath} className="mb-4">
            <Label
              htmlFor={currentPath}
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              {label}
            </Label>
            <Textarea
              id={currentPath}
              value={value}
              onChange={(e) => updateFormData(currentPath, e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        );
      }

      return (
        <div key={currentPath} className="mb-4">
          <Label
            htmlFor={currentPath}
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {label}
          </Label>
          <Input
            type="text"
            id={currentPath}
            value={value}
            onChange={(e) => updateFormData(currentPath, e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </div>
      );
    }

    if (Array.isArray(value)) {
      const containsObjects = value.some(
        (item) => typeof item === "object" && item !== null
      );

      if (containsObjects) {
        const prettyArray = JSON.stringify(value, null, 2);

        return (
          <div key={currentPath} className="mb-4">
            <Label
              htmlFor={currentPath}
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              {label}
            </Label>
            <Textarea
              id={currentPath}
              value={prettyArray}
              onChange={(e) => {
                try {
                  const newArray = JSON.parse(e.target.value);
                  updateFormData(currentPath, newArray);
                } catch {
                  updateFormData(currentPath, e.target.value);
                }
              }}
              rows={5}
              className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white font-mono text-sm"
              placeholder={`Enter JSON array for ${label.toLowerCase()}`}
            />
            <p className="mt-1 text-sm text-gray-400">Enter valid JSON array</p>
          </div>
        );
      }
      const arrayAsString = value.join(", ");

      return (
        <div key={currentPath} className="mb-4">
          <Label
            htmlFor={currentPath}
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {label}
          </Label>
          <Textarea
            id={currentPath}
            value={arrayAsString}
            onChange={(e) => {
              const newArray = e.target.value
                .split(",")
                .map((item) => item.trim());
              updateFormData(currentPath, newArray);
            }}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
            placeholder={`Enter ${label.toLowerCase()} (comma separated)`}
          />
          <p className="mt-1 text-sm text-gray-400">
            Separate items with commas
          </p>
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      const isExpanded = expandedSections[currentPath];

      return (
        <Card key={currentPath} className="mb-4 bg-zinc-900 border-zinc-700">
          <CardHeader
            className="px-4 text-white cursor-pointer"
            onClick={() => toggleSection(currentPath)}
          >
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <CardTitle className="text-md font-medium ml-1">
                {label}
              </CardTitle>
            </div>
          </CardHeader>

          {isExpanded && (
            <CardContent className="pt-0 px-4 pb-4">
              {Object.entries(value).map(([nestedKey, nestedValue]) =>
                renderFormField(
                  nestedKey,
                  nestedValue as JsonValue,
                  currentPath
                )
              )}
            </CardContent>
          )}
        </Card>
      );
    }

    return (
      <div key={currentPath} className="mb-4">
        <Label
          htmlFor={currentPath}
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          {label}
        </Label>
        <Input
          type="text"
          id={currentPath}
          value={String(value)}
          onChange={(e) => updateFormData(currentPath, e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-500 text-white"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-zinc-900 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              Please Review Your Information
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {Object.entries(formData ?? {}).map(([key, value]) =>
                  renderFormField(key, value as JsonValue)
                )}

                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="secondary">
                    Submit and Continue
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
