import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isTyping?: boolean;
}

const ChatMessage = ({ message, isUser, isTyping }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-500",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-[var(--shadow-chat)] transition-[var(--transition-smooth)]",
          isUser
            ? "bg-chat-user-bg text-chat-user-fg rounded-br-md"
            : "bg-chat-bot-bg text-chat-bot-fg rounded-bl-md border border-border"
        )}
      >
        {isTyping ? (
          <div className="flex items-center gap-1">
            <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
              •
            </span>
            <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
              •
            </span>
            <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
              •
            </span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
