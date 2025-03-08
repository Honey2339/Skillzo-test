"use client";

import type React from "react";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface JsonViewerProps {
  data: JsonValue;
  initialExpanded?: boolean;
  level?: number;
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  initialExpanded = true,
  level = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const indent = level * 20;

  if (data === null) return <span className="text-gray-500">null</span>;

  if (typeof data === "boolean")
    return <span className="text-purple-600">{data.toString()}</span>;

  if (typeof data === "number")
    return <span className="text-blue-600">{data.toString()}</span>;

  if (typeof data === "string")
    return <span className="text-green-600">"{data}"</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-gray-500">[]</span>;

    return (
      <div>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="text-gray-700">Array[{data.length}]</span>
        </div>

        {isExpanded && (
          <div style={{ marginLeft: `${indent + 20}px` }}>
            {data.map((item, index) => (
              <div key={index} className="flex">
                <span className="text-gray-500 mr-2">{index}:</span>
                <JsonViewer data={item} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Object handling
  const entries = Object.entries(data);
  if (entries.length === 0)
    return <span className="text-gray-500">{"{}"}</span>;

  return (
    <div>
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span className="text-gray-700">Object{"{}"}</span>
      </div>

      {isExpanded && (
        <div style={{ marginLeft: `${indent + 20}px` }}>
          {entries.map(([key, value]) => (
            <div key={key} className="flex">
              <span className="text-gray-800 font-medium mr-2">{key}:</span>
              <JsonViewer data={value} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function JsonRenderer({ data }: { data: any }) {
  if (!data) return <div>No data to display</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">JSON Data</h2>
      <div className="overflow-auto max-h-[500px]">
        <JsonViewer data={data} />
      </div>
    </div>
  );
}
