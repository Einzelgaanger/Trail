"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Loader2,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculatePortfolioStats } from "@/data/esgData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Format response as clean HTML instead of markdown
const formatResponse = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
};

// AI responses based on portfolio data - returns structured HTML
const generateResponse = (query: string): string => {
  const stats = calculatePortfolioStats();
  const lowerQuery = query.toLowerCase();
  
  // Portfolio overview queries
  if (lowerQuery.includes("portfolio") && (lowerQuery.includes("overview") || lowerQuery.includes("summary"))) {
    return `<div class="space-y-3">
      <div class="font-semibold text-primary">Portfolio Overview</div>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="bg-muted/50 p-2 rounded">
          <div class="text-muted-foreground text-xs">Total Projects</div>
          <div class="font-medium">${stats.totalProjects}</div>
        </div>
        <div class="bg-muted/50 p-2 rounded">
          <div class="text-muted-foreground text-xs">Portfolio Value</div>
          <div class="font-medium">₦${(stats.totalPortfolioValue / 1000000000).toFixed(1)}B</div>
        </div>
        <div class="bg-muted/50 p-2 rounded">
          <div class="text-muted-foreground text-xs">ESG Completeness</div>
          <div class="font-medium">${stats.avgEsgCompleteness}%</div>
        </div>
        <div class="bg-muted/50 p-2 rounded">
          <div class="text-muted-foreground text-xs">Green Classification</div>
          <div class="font-medium">${stats.greenTaxonomy.greenPercentage}%</div>
        </div>
      </div>
      <div class="text-xs text-muted-foreground">Total Carbon: ${stats.carbonSummary.total.toLocaleString()} tCO₂e</div>
    </div>`;
  }
  
  // Carbon/emissions queries
  if (lowerQuery.includes("carbon") || lowerQuery.includes("emission") || lowerQuery.includes("co2")) {
    const scope3Percent = Math.round((stats.carbonSummary.scope3 / stats.carbonSummary.total) * 100);
    return `<div class="space-y-3">
      <div class="font-semibold text-primary">Carbon Emissions Summary</div>
      <div class="text-center py-2">
        <div class="text-2xl font-bold">${stats.carbonSummary.total.toLocaleString()}</div>
        <div class="text-xs text-muted-foreground">Total tCO₂e</div>
      </div>
      <div class="grid grid-cols-3 gap-2 text-sm text-center">
        <div class="bg-primary/10 p-2 rounded">
          <div class="font-medium">${stats.carbonSummary.scope1.toLocaleString()}</div>
          <div class="text-xs text-muted-foreground">Scope 1</div>
        </div>
        <div class="bg-accent/10 p-2 rounded">
          <div class="font-medium">${stats.carbonSummary.scope2.toLocaleString()}</div>
          <div class="text-xs text-muted-foreground">Scope 2</div>
        </div>
        <div class="bg-warning/10 p-2 rounded">
          <div class="font-medium">${stats.carbonSummary.scope3.toLocaleString()}</div>
          <div class="text-xs text-muted-foreground">Scope 3</div>
        </div>
      </div>
      <div class="text-xs text-muted-foreground">Scope 3 represents ${scope3Percent}% of total emissions</div>
    </div>`;
  }
  
  // Green taxonomy queries
  if (lowerQuery.includes("taxonomy") || lowerQuery.includes("green") || lowerQuery.includes("classification")) {
    return `<div class="space-y-3">
      <div class="font-semibold text-primary">Green Taxonomy Classification</div>
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            Green
          </span>
          <span class="font-medium">${stats.greenTaxonomy.green} (${stats.greenTaxonomy.greenPercentage}%)</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
            Transition
          </span>
          <span class="font-medium">${stats.greenTaxonomy.transition} (${stats.greenTaxonomy.transitionPercentage}%)</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-500"></span>
            Not Green
          </span>
          <span class="font-medium">${stats.greenTaxonomy.notGreen} (${stats.greenTaxonomy.notGreenPercentage}%)</span>
        </div>
      </div>
      <div class="text-xs text-muted-foreground border-t pt-2 mt-2">
        By portfolio value: ${stats.greenTaxonomy.greenPercentageByValue}% classified as Green
      </div>
    </div>`;
  }
  
  // ESG/compliance queries
  if (lowerQuery.includes("esg") || lowerQuery.includes("compliance") || lowerQuery.includes("completeness")) {
    return `<div class="space-y-3">
      <div class="font-semibold text-primary">ESG Data Status</div>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="bg-muted/50 p-2 rounded">
          <div class="text-muted-foreground text-xs">Avg Completeness</div>
          <div class="font-medium">${stats.avgEsgCompleteness}%</div>
        </div>
        <div class="bg-muted/50 p-2 rounded">
          <div class="text-muted-foreground text-xs">On-time Reports</div>
          <div class="font-medium">${stats.reportingTimeliness.onTime} projects</div>
        </div>
      </div>
      <div class="font-medium text-sm mt-2">ESG Flags</div>
      <div class="flex gap-2 text-xs">
        <span class="px-2 py-1 bg-red-100 text-red-700 rounded">Critical: ${stats.esgFlags.critical}</span>
        <span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Warning: ${stats.esgFlags.warning}</span>
        <span class="px-2 py-1 bg-green-100 text-green-700 rounded">OK: ${stats.esgFlags.compliant}</span>
      </div>
    </div>`;
  }
  
  // PFI queries
  if (lowerQuery.includes("pfi") || lowerQuery.includes("bank") || lowerQuery.includes("financial institution")) {
    return `<div class="space-y-3">
      <div class="font-semibold text-primary">PFI Performance Summary</div>
      <div class="text-sm text-muted-foreground mb-2">Portfolio managed by 8 PFIs</div>
      <div class="space-y-1 text-xs">
        <div class="flex justify-between p-1.5 bg-muted/30 rounded">GT Bank<span class="font-medium">13 projects</span></div>
        <div class="flex justify-between p-1.5 bg-muted/30 rounded">Fidelity Bank<span class="font-medium">13 projects</span></div>
        <div class="flex justify-between p-1.5 bg-muted/30 rounded">Ecobank<span class="font-medium">13 projects</span></div>
        <div class="flex justify-between p-1.5 bg-muted/30 rounded">Access Bank<span class="font-medium">12 projects</span></div>
        <div class="flex justify-between p-1.5 bg-muted/30 rounded">Zenith Bank<span class="font-medium">12 projects</span></div>
      </div>
      <div class="text-xs text-muted-foreground">${stats.reportingTimeliness.onTime} of ${stats.totalProjects} submitted on time</div>
    </div>`;
  }
  
  // Net zero queries
  if (lowerQuery.includes("net zero") || lowerQuery.includes("netzero") || lowerQuery.includes("target")) {
    return `<div class="space-y-3">
      <div class="font-semibold text-primary">Net Zero Progress</div>
      <div class="grid grid-cols-3 gap-2 text-sm text-center">
        <div class="bg-muted/50 p-2 rounded">
          <div class="font-medium">2050</div>
          <div class="text-xs text-muted-foreground">Target Year</div>
        </div>
        <div class="bg-muted/50 p-2 rounded">
          <div class="font-medium">40%</div>
          <div class="text-xs text-muted-foreground">2030 Target</div>
        </div>
        <div class="bg-primary/10 p-2 rounded">
          <div class="font-medium text-primary">21%</div>
          <div class="text-xs text-muted-foreground">Current</div>
        </div>
      </div>
      <div class="w-full bg-muted rounded-full h-2 mt-2">
        <div class="bg-primary h-2 rounded-full" style="width: 52%"></div>
      </div>
      <div class="text-xs text-muted-foreground">Portfolio on track to meet interim targets</div>
    </div>`;
  }
  
  // Risk queries
  if (lowerQuery.includes("risk") || lowerQuery.includes("flag") || lowerQuery.includes("issue")) {
    return `<div class="space-y-3">
      <div class="font-semibold text-primary">Risk Assessment</div>
      <div class="space-y-2">
        <div class="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded text-sm">
          <span>Critical Issues</span>
          <span class="font-bold text-red-600">${stats.esgFlags.critical}</span>
        </div>
        <div class="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <span>Warnings</span>
          <span class="font-bold text-yellow-600">${stats.esgFlags.warning}</span>
        </div>
        <div class="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded text-sm">
          <span>Compliant</span>
          <span class="font-bold text-green-600">${stats.esgFlags.compliant}</span>
        </div>
      </div>
      <div class="text-xs text-muted-foreground">Key risks: Missing documentation, low data quality, off-track carbon targets</div>
    </div>`;
  }
  
  // Sector queries
  if (lowerQuery.includes("sector") || lowerQuery.includes("industry")) {
    return `<div class="space-y-3">
      <div class="font-semibold text-primary">Sector Distribution</div>
      <div class="space-y-1 text-xs">
        <div class="flex justify-between p-1.5 bg-muted/30 rounded">Manufacturing<span class="text-muted-foreground">High emissions</span></div>
        <div class="flex justify-between p-1.5 bg-green-50 rounded">Agriculture<span class="text-green-600">Strong green</span></div>
        <div class="flex justify-between p-1.5 bg-green-50 rounded">Energy<span class="text-green-600">Renewables</span></div>
        <div class="flex justify-between p-1.5 bg-muted/30 rounded">Services<span class="text-muted-foreground">Good compliance</span></div>
        <div class="flex justify-between p-1.5 bg-yellow-50 rounded">Trade<span class="text-yellow-600">Mixed status</span></div>
      </div>
      <div class="text-xs text-muted-foreground">Energy and Agriculture show highest green alignment</div>
    </div>`;
  }
  
  // Help/capabilities
  if (lowerQuery.includes("help") || lowerQuery.includes("what can you") || lowerQuery.includes("capabilities")) {
    return `<div class="space-y-3">
      <div class="font-semibold text-primary">I can help you with:</div>
      <div class="grid grid-cols-2 gap-1 text-xs">
        <div class="p-1.5 bg-muted/50 rounded">Portfolio Overview</div>
        <div class="p-1.5 bg-muted/50 rounded">Carbon Analysis</div>
        <div class="p-1.5 bg-muted/50 rounded">Green Taxonomy</div>
        <div class="p-1.5 bg-muted/50 rounded">ESG Compliance</div>
        <div class="p-1.5 bg-muted/50 rounded">PFI Performance</div>
        <div class="p-1.5 bg-muted/50 rounded">Net Zero Progress</div>
        <div class="p-1.5 bg-muted/50 rounded">Risk Assessment</div>
        <div class="p-1.5 bg-muted/50 rounded">Sector Analysis</div>
      </div>
      <div class="text-xs text-muted-foreground">Just ask any question about your ESG portfolio!</div>
    </div>`;
  }
  
  // Default response
  return `<div class="space-y-3">
    <div class="text-sm">I can help you understand your ESG portfolio. Try asking about:</div>
    <div class="flex flex-wrap gap-1">
      <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Portfolio overview</span>
      <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Carbon emissions</span>
      <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Green taxonomy</span>
      <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">ESG compliance</span>
      <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Net zero targets</span>
    </div>
  </div>`;
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `<div class="space-y-2">
        <div class="font-medium">Hello! I'm your ESG AI Assistant.</div>
        <div class="text-sm text-muted-foreground">I can help you analyze portfolio data, carbon emissions, taxonomy classifications, and more.</div>
        <div class="text-xs text-muted-foreground">What would you like to know?</div>
      </div>`,
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
    }, 600 + Math.random() * 400);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "Portfolio overview",
    "Carbon emissions",
    "Green taxonomy",
    "ESG status",
  ];

  return (
    <>
      {/* Floating Button - Professional AI Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group border-2 border-primary/20",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <BrainCircuit className="w-7 h-7 group-hover:scale-110 transition-transform" />
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
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-primary-foreground" />
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
                      : "bg-gradient-to-br from-primary/20 to-primary/10"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted rounded-tl-sm"
                  )}
                >
                  {message.role === "assistant" ? (
                    <div 
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: message.content }} 
                    />
                  ) : (
                    <div className="text-sm">{message.content}</div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
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
