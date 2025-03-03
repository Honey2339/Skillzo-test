"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { ChatWithAI } from "@/lib/LLM";
import { useFormStore } from "../(store)/formDataStore";
import ReactMarkdown from "react-markdown";

const formatMessageContent = (content: string) => {
  if (!content) return "";

  const markdownContent = content
    .replace(/\*\*(.*?)\*\*/g, "**$1**")
    .replace(/\*(.*?)\*/g, "*$1*")
    .replace(/```([\s\S]*?)```/g, "```$1```");

  return markdownContent;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { formData } = useFormStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await ChatWithAI(formData, input);

      const aiMessage = { role: "assistant", content: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error chatting with AI:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <h1 className="text-2xl font-semibold text-zinc-200">
                  How can I help you today?
                </h1>
                <p className="text-zinc-400 mt-2">
                  Type a message to start chatting
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-zinc-800 border border-zinc-700"
                      : "bg-zinc-900"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        message.role === "user"
                          ? "bg-blue-600"
                          : "bg-emerald-600"
                      }`}
                    >
                      <span className="text-xs text-zinc-100 font-bold">
                        {message.role === "user" ? "U" : "AI"}
                      </span>
                    </div>
                    <div className="flex-1 text-zinc-200 prose prose-invert prose-sm max-w-none">
                      {message.role === "assistant" ? (
                        <ReactMarkdown>
                          {formatMessageContent(message.content)}
                        </ReactMarkdown>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="p-4 rounded-lg bg-zinc-900">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center mr-3">
                    <span className="text-xs text-zinc-100 font-bold">AI</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-zinc-600 rounded-full animate-bounce"></div>
                      <div
                        className="h-2 w-2 bg-zinc-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-zinc-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-zinc-800 bg-zinc-900 p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                placeholder="Message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-4 pr-12 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-zinc-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-blue-500 p-2"
                disabled={input.trim() === "" || isLoading}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
