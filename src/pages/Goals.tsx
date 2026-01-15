"use client";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Plus, 
  Target, 
  Leaf,
  Users,
  DollarSign,
  Shield,
  Globe,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ESGGoal {
  id: string;
  title: string;
  category: "Environmental" | "Social" | "Governance";
  target: string;
  current: string;
  progress: number;
  status: "Completed" | "On Track" | "At Risk";
  icon: React.ReactNode;
  color: string;
  indicators: string[];
}

const mockGoals: ESGGoal[] = [
  {
    id: "1",
    title: "Carbon Emission Reduction",
    category: "Environmental",
    target: "Reduce by 40% by 2026",
    current: "27.2% reduction achieved",
    progress: 68,
    status: "On Track",
    icon: <Leaf className="w-6 h-6" />,
    color: "#22c55e",
    indicators: ["Scope 1 emissions", "Scope 2 emissions", "Carbon intensity"],
  },
  {
    id: "2",
    title: "Renewable Energy Adoption",
    category: "Environmental",
    target: "80% renewable energy by 2025",
    current: "62% achieved",
    progress: 78,
    status: "On Track",
    icon: <Globe className="w-6 h-6" />,
    color: "#3b82f6",
    indicators: ["Solar capacity", "Wind capacity", "Energy efficiency"],
  },
  {
    id: "3",
    title: "Employee Diversity",
    category: "Social",
    target: "40% women in leadership",
    current: "35% achieved",
    progress: 88,
    status: "On Track",
    icon: <Users className="w-6 h-6" />,
    color: "#8b5cf6",
    indicators: ["Gender ratio", "Leadership representation", "Pay equity"],
  },
  {
    id: "4",
    title: "Community Investment",
    category: "Social",
    target: "₦500M annual investment",
    current: "₦420M invested",
    progress: 84,
    status: "On Track",
    icon: <DollarSign className="w-6 h-6" />,
    color: "#f59e0b",
    indicators: ["Education programs", "Healthcare initiatives", "Local employment"],
  },
  {
    id: "5",
    title: "Board Independence",
    category: "Governance",
    target: "60% independent directors",
    current: "55% independent",
    progress: 92,
    status: "Completed",
    icon: <Shield className="w-6 h-6" />,
    color: "#06b6d4",
    indicators: ["Board composition", "Audit committee", "Risk oversight"],
  },
  {
    id: "6",
    title: "Waste Reduction",
    category: "Environmental",
    target: "Zero waste to landfill",
    current: "15% still to landfill",
    progress: 45,
    status: "At Risk",
    icon: <Target className="w-6 h-6" />,
    color: "#ef4444",
    indicators: ["Recycling rate", "Circular economy", "Waste diversion"],
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "On Track":
      return <Clock className="w-4 h-4 text-primary" />;
    case "At Risk":
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-success/10 text-success border-success/20";
    case "On Track":
      return "bg-primary/10 text-primary border-primary/20";
    case "At Risk":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Environmental":
      return "bg-success/10 text-success";
    case "Social":
      return "bg-purple-500/10 text-purple-600";
    case "Governance":
      return "bg-cyan-500/10 text-cyan-600";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Goals() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredGoals = useMemo(() => {
    return mockGoals.filter((goal) => {
      const matchesSearch = goal.title.toLowerCase().includes(searchText.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === "all" || goal.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  const categories = ["all", "Environmental", "Social", "Governance"];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">Goals & Indicators</h1>
            <p className="text-muted-foreground mt-1">
              Track your ESG goals and key performance indicators
            </p>
          </div>
          <Button className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Add Goal
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search goals..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "capitalize",
                  selectedCategory === category && "bg-primary text-primary-foreground"
                )}
              >
                {category === "all" ? "All" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="dashboard-card group hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${goal.color}15`, color: goal.color }}
                >
                  {goal.icon}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 border",
                    getStatusColor(goal.status)
                  )}>
                    {getStatusIcon(goal.status)}
                    {goal.status}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    getCategoryColor(goal.category)
                  )}>
                    {goal.category}
                  </span>
                </div>

                <h3 className="font-semibold text-foreground">{goal.title}</h3>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Target: {goal.target}</p>
                  <p className="text-xs text-foreground">Current: {goal.current}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {goal.indicators.slice(0, 2).map((indicator, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                      {indicator}
                    </span>
                  ))}
                  {goal.indicators.length > 2 && (
                    <span className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                      +{goal.indicators.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
