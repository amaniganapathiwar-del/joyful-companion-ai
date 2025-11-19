import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

const CONVERSATION_STARTERS = [
  "Tell me a joke! 😄",
  "Let's play 20 questions!",
  "Share a fun fact with me",
  "Tell me a story",
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hey there! 👋 I'm so excited to chat with you today! What fun things shall we get up to? 🎉",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // TODO: Replace with actual AI endpoint once Lovable Cloud is enabled
      // For now, simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "This is a placeholder response! Once we connect Lovable AI, I'll be your fun, lovable companion! 🎈✨",
        isUser: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Oops! 😅",
        description: "Something went wrong. Let's try that again!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleStarterClick = (starter: string) => {
    sendMessage(starter);
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--gradient-glow)]">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 p-4 bg-card shadow-[var(--shadow-soft)] border-b border-border">
        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        <h1 className="text-2xl font-bold text-foreground">Your Fun AI Buddy</h1>
        <Sparkles className="w-6 h-6 text-accent animate-pulse" />
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.content}
            isUser={message.isUser}
          />
        ))}
        {isLoading && <ChatMessage message="" isUser={false} isTyping />}

        {/* Conversation Starters */}
        {messages.length === 1 && !isLoading && (
          <div className="flex flex-col items-center gap-3 pt-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <p className="text-muted-foreground text-sm">Try one of these:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {CONVERSATION_STARTERS.map((starter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleStarterClick(starter)}
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-[var(--transition-smooth)]"
                >
                  {starter}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border shadow-[var(--shadow-soft)]">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here... 💬"
            disabled={isLoading}
            className="flex-1 rounded-full bg-background border-2 border-border focus:border-primary transition-[var(--transition-smooth)]"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-full w-12 h-12 p-0 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-soft)] hover:scale-105 transition-[var(--transition-smooth)]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
