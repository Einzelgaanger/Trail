"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Minimize2,
  Maximize2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculatePortfolioStats } from "@/data/esgData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// AI responses based on portfolio data
const generateResponse = (query: string): string => {
  const stats = calculatePortfolioStats();
  const lowerQuery = query.toLowerCase();
  
  // Portfolio overview queries
  if (lowerQuery.includes("portfolio") && (lowerQuery.includes("overview") || lowerQuery.includes("summary"))) {
    return `**Portfolio Overview:**\n\n• **Total Projects:** ${stats.totalProjects}\n• **Portfolio Value:** ₦${(stats.totalPortfolioValue / 1000000000).toFixed(1)}B\n• **ESG Completeness:** ${stats.avgEsgCompleteness}%\n• **Green Classification:** ${stats.greenTaxonomy.greenPercentage}% of projects\n• **Total Carbon Emissions:** ${stats.carbonSummary.total.toLocaleString()} tCO₂e`;
  }
  
  // Carbon/emissions queries
  if (lowerQuery.includes("carbon") || lowerQuery.includes("emission") || lowerQuery.includes("co2")) {
    return `**Carbon Emissions Summary:**\n\n• **Total Emissions:** ${stats.carbonSummary.total.toLocaleString()} tCO₂e\n• **Scope 1 (Direct):** ${stats.carbonSummary.scope1.toLocaleString()} tCO₂e\n• **Scope 2 (Energy):** ${stats.carbonSummary.scope2.toLocaleString()} tCO₂e\n• **Scope 3 (Indirect):** ${stats.carbonSummary.scope3.toLocaleString()} tCO₂e\n\nScope 3 emissions represent ${Math.round((stats.carbonSummary.scope3 / stats.carbonSummary.total) * 100)}% of total portfolio emissions.`;
  }
  
  // Green taxonomy queries
  if (lowerQuery.includes("taxonomy") || lowerQuery.includes("green") || lowerQuery.includes("classification")) {
    return `**Green Taxonomy Classification:**\n\n• **Green Projects:** ${stats.greenTaxonomy.green} (${stats.greenTaxonomy.greenPercentage}%)\n• **Transition Projects:** ${stats.greenTaxonomy.transition} (${stats.greenTaxonomy.transitionPercentage}%)\n• **Not Green:** ${stats.greenTaxonomy.notGreen} (${stats.greenTaxonomy.notGreenPercentage}%)\n\n**By Portfolio Value:** ${stats.greenTaxonomy.greenPercentageByValue}% of total financing is classified as Green.`;
  }
  
  // ESG/compliance queries
  if (lowerQuery.includes("esg") || lowerQuery.includes("compliance") || lowerQuery.includes("completeness")) {
    return `**ESG Data Status:**\n\n• **Average Completeness:** ${stats.avgEsgCompleteness}%\n• **On-time Reporting:** ${stats.reportingTimeliness.onTime} projects\n• **Late Reporting:** ${stats.reportingTimeliness.late} projects\n\n**ESG Flags:**\n• Critical: ${stats.esgFlags.critical}\n• Warning: ${stats.esgFlags.warning}\n• Compliant: ${stats.esgFlags.compliant}`;
  }
  
  // PFI queries
  if (lowerQuery.includes("pfi") || lowerQuery.includes("bank") || lowerQuery.includes("financial institution")) {
    return `**PFI Performance Summary:**\n\nThe portfolio is managed through 5 Participating Financial Institutions:\n\n1. **GT Bank** - 24 projects, high data quality\n2. **Fidelity Bank** - 22 projects, needs improvement\n3. **Ecobank** - 18 projects, good compliance\n4. **Baobab MFB** - 20 projects, excellent reporting\n5. **Infinity MFB** - 16 projects, good compliance\n\n${stats.reportingTimeliness.onTime} of ${stats.totalProjects} PFIs submitted on time.`;
  }
  
  // Net zero queries
  if (lowerQuery.includes("net zero") || lowerQuery.includes("netzero") || lowerQuery.includes("target")) {
    return `**Net Zero Progress:**\n\n• **Target Year:** 2050\n• **Reduction Target:** 40% by 2030\n• **Current Progress:** ~21% reduction from baseline\n\nThe portfolio is on track to meet interim targets, with renewable energy projects leading the reduction efforts.`;
  }
  
  // Risk queries
  if (lowerQuery.includes("risk") || lowerQuery.includes("flag") || lowerQuery.includes("issue")) {
    return `**Risk Assessment:**\n\n• **Critical Issues:** ${stats.esgFlags.critical} projects require immediate attention\n• **Warnings:** ${stats.esgFlags.warning} projects need review\n• **Compliant:** ${stats.esgFlags.compliant} projects meeting standards\n\n**Key Risk Areas:**\n- Missing evidence documentation\n- Low data quality scores (<60%)\n- Off-track carbon reduction targets`;
  }
  
  // Sector queries
  if (lowerQuery.includes("sector") || lowerQuery.includes("industry")) {
    return `**Sector Distribution:**\n\nTop sectors by portfolio value:\n\n1. **Manufacturing** - High emissions, transition focus\n2. **Agriculture** - Strong green classification\n3. **Energy** - Renewable projects performing well\n4. **Services** - Good ESG compliance\n5. **Trade** - Mixed classification status\n\nRenewable Energy and Agriculture sectors show the highest green taxonomy alignment.`;
  }
  
  // Help/capabilities
  if (lowerQuery.includes("help") || lowerQuery.includes("what can you") || lowerQuery.includes("capabilities")) {
    return `**I can help you with:**\n\n• **Portfolio Overview** - Total projects, values, status\n• **Carbon Analysis** - Scope 1/2/3 emissions, trends\n• **Green Taxonomy** - Classification breakdown\n• **ESG Compliance** - Completeness, reporting status\n• **PFI Performance** - Bank-level analysis\n• **Net Zero Progress** - Target tracking\n• **Risk Assessment** - Critical flags, warnings\n• **Sector Analysis** - Industry breakdown\n\nJust ask any question about your ESG portfolio!`;
  }
  
  // Default response
  return `I can help you understand your ESG portfolio data. Try asking about:\n\n• Portfolio overview\n• Carbon emissions\n• Green taxonomy classification\n• ESG compliance status\n• PFI performance\n• Net zero targets\n• Risk flags\n\nWhat would you like to know?`;
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your ESG AI Assistant. I can help you analyze portfolio data, carbon emissions, taxonomy classifications, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "Portfolio overview",
    "Carbon emissions summary",
    "Green taxonomy breakdown",
    "ESG compliance status",
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed z-50 bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300 flex flex-col overflow-hidden",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
          isExpanded 
            ? "bottom-4 right-4 left-4 top-4 sm:left-auto sm:w-[500px] sm:h-[700px]" 
            : "bottom-6 right-6 w-[380px] h-[520px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">ESG AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Powered by Trail Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted rounded-tl-sm"
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => {
                    setInput(question);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your ESG portfolio..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
