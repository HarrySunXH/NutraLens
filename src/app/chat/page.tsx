"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ChatSidebar, { Conversation } from "@/components/chat/ChatSidebar";
import ChatMessages, { Message, SupplementProduct } from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import SuggestedPrompts from "@/components/chat/SuggestedPrompts";
import ProfileButton from "@/components/chat/ProfileButton";
import ProfileEditor from "@/components/chat/ProfileEditor";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { HealthProfileProvider, useHealthProfile } from "@/context/HealthProfileContext";
import { HealthProfile } from "@/types/health-profile";

// Fallback responses in case API fails
const fallbackResponses: Record<string, string> = {
  default: `I'd be happy to help you with your supplement questions! I can:

- **Analyze supplements** - Tell me what you're taking and I'll provide insights
- **Check interactions** - I can identify potential conflicts between supplements
- **Make recommendations** - Based on your health goals
- **Explain timing** - When to take different supplements for optimal absorption

What would you like to know?`,
};

// Sample conversation history
const sampleConversations: Conversation[] = [
  {
    id: "1",
    title: "Vitamin D Questions",
    lastMessage: "What's the best form of Vitamin D?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "2",
    title: "Pre-workout Stack",
    lastMessage: "Analyzed your pre-workout supplements",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "3",
    title: "Sleep Support",
    lastMessage: "Magnesium glycinate is recommended...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
];

function ChatPageContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  const { profile, updateProfile, showOnboarding, setShowOnboarding, isLoading, isOnboardingComplete } = useHealthProfile();

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const streamAIResponse = async (
    conversationMessages: Message[],
    healthProfile: HealthProfile,
    onChunk: (chunk: string) => void,
    onProducts: (products: SupplementProduct[]) => void
  ): Promise<void> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          healthProfile,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              }
              if (parsed.products) {
                onProducts(parsed.products);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Error calling AI API:", error);
      onChunk(fallbackResponses["default"]);
    }
  };

  const handleSendMessage = useCallback(
    async (content: string, file?: File | null) => {
      if (!content.trim() && !file) return;

      // Hide suggestions after first message
      setShowSuggestions(false);

      // Create user message
      const userMessage: Message = {
        id: generateId(),
        content: content || "Uploaded a supplement label for analysis",
        role: "user",
        timestamp: new Date(),
        file: file
          ? {
              name: file.name,
              preview: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : undefined,
            }
          : undefined,
      };

      // Add user message to state
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Create AI message placeholder for streaming
      const aiMessageId = generateId();
      const aiMessage: Message = {
        id: aiMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date(),
      };

      // Add empty AI message that will be populated via streaming
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(true);

      try {
        if (file) {
          // Handle file upload with static response
          const fileContent = `I've received your supplement label image "${file.name}". Let me analyze it for you...\n\nBased on the label, I can see this product contains various vitamins and minerals. For a complete analysis, I would examine:\n\n- **Active ingredients** and their dosages\n- **Daily value percentages**\n- **Other ingredients** (fillers, allergens)\n- **Suggested use** and timing\n\nWould you like me to check for any specific interactions or provide recommendations based on this supplement?`;
          
          // Simulate streaming for file response
          let currentContent = "";
          const words = fileContent.split(" ");
          for (const word of words) {
            currentContent += (currentContent ? " " : "") + word;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId ? { ...msg, content: currentContent } : msg
              )
            );
            await new Promise((resolve) => setTimeout(resolve, 30));
          }
        } else {
          // Stream AI response with health profile
          setIsStreaming(true);
          await streamAIResponse(
            updatedMessages,
            profile,
            (chunk) => {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: msg.content + chunk }
                    : msg
                )
              );
            },
            (products) => {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, products }
                    : msg
                )
              );
            }
          );
          setIsStreaming(false);
        }

        // Get final content for conversation sidebar
        setMessages((prev) => {
          const finalMessage = prev.find((msg) => msg.id === aiMessageId);
          const finalContent = finalMessage?.content || "";
          
          // Update conversation in sidebar
          if (!activeConversationId && finalContent) {
            const newConversation: Conversation = {
              id: generateId(),
              title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
              lastMessage: finalContent.slice(0, 50) + "...",
              timestamp: new Date(),
            };
            setConversations((prevConvs) => [newConversation, ...prevConvs]);
            setActiveConversationId(newConversation.id);
          }
          
          return prev;
        });
      } catch (error) {
        console.error("Error handling message:", error);
        // Update the AI message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: "I apologize, but I encountered an error. Please try again." }
              : msg
          )
        );
      } finally {
        setIsTyping(false);
        setIsStreaming(false);
      }
    },
    [messages, activeConversationId, profile]
  );

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
    setShowSuggestions(true);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setMessages([]);
    setShowSuggestions(true);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      handleNewChat();
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleOnboardingComplete = (completedProfile: HealthProfile) => {
    updateProfile(completedProfile);
    setShowOnboarding(false);
  };

  // Handle question answers from interactive cards
  const handleQuestionAnswer = useCallback(
    (messageId: string, answer: string) => {
      // Mark the question as answered
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, answeredQuestion: answer } : msg
        )
      );

      // Send the answer as a new user message
      handleSendMessage(answer);
    },
    [handleSendMessage]
  );

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        <Navbar />

        <div className="flex-1 flex overflow-hidden pt-16 md:pt-20">
          {/* Sidebar */}
          <ChatSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
          />

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header with sidebar toggle and profile button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isSidebarOpen ? (
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              
              {/* Profile Button */}
              <ProfileButton onClick={() => setShowProfileEditor(true)} />
            </div>

            {/* Messages or Welcome Screen with Suggested Prompts */}
            {messages.length === 0 && showSuggestions ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
                <SuggestedPrompts 
                  onSelectPrompt={handleSelectPrompt} 
                  onOpenProfile={() => setShowProfileEditor(true)}
                  isProfileComplete={isOnboardingComplete}
                />
              </div>
            ) : (
              <ChatMessages 
                messages={messages} 
                isTyping={isTyping} 
                isStreaming={isStreaming}
                onQuestionAnswer={handleQuestionAnswer}
              />
            )}

            {/* Input */}
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
        initialProfile={profile}
      />

      {/* Profile Editor Modal */}
      <ProfileEditor
        isOpen={showProfileEditor}
        onClose={() => setShowProfileEditor(false)}
      />
    </>
  );
}

export default function ChatPage() {
  return (
    <HealthProfileProvider>
      <ChatPageContent />
    </HealthProfileProvider>
  );
}
