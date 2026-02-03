"use client";
import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { GoalModal, Goal } from "@/components/modals/GoalModal";
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
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_KEY = "trail_esg_goals";

const defaultGoals: Goal[] = [
  {
    id: "1",
    title: "Carbon Emission Reduction",
    description: "Reduce carbon emissions across all funded projects",
    category: "Environmental",
    target: "Reduce by 40% by 2026",
    current: "27.2% reduction achieved",
    progress: 68,
    status: "On Track",
    color: "#22c55e",
    indicators: ["Scope 1 emissions", "Scope 2 emissions", "Carbon intensity"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Renewable Energy Adoption",
    description: "Increase renewable energy usage in portfolio",
    category: "Environmental",
    target: "80% renewable energy by 2025",
    current: "62% achieved",
    progress: 78,
    status: "On Track",
    color: "#3b82f6",
    indicators: ["Solar capacity", "Wind capacity", "Energy efficiency"],
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    title: "Employee Diversity",
    description: "Improve diversity metrics across portfolio companies",
    category: "Social",
    target: "40% women in leadership",
    current: "35% achieved",
    progress: 88,
    status: "On Track",
    color: "#8b5cf6",
    indicators: ["Gender ratio", "Leadership representation", "Pay equity"],
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    title: "Community Investment",
    description: "Increase investment in local communities",
    category: "Social",
    target: "₦500M annual investment",
    current: "₦420M invested",
    progress: 84,
    status: "On Track",
    color: "#f59e0b",
    indicators: ["Education programs", "Healthcare initiatives", "Local employment"],
    createdAt: "2024-03-01",
  },
  {
    id: "5",
    title: "Board Independence",
    description: "Ensure board independence across portfolio",
    category: "Governance",
    target: "60% independent directors",
    current: "55% independent",
    progress: 92,
    status: "Completed",
    color: "#06b6d4",
    indicators: ["Board composition", "Audit committee", "Risk oversight"],
    createdAt: "2024-01-10",
  },
  {
    id: "6",
    title: "Waste Reduction",
    description: "Minimize waste sent to landfills",
    category: "Environmental",
    target: "Zero waste to landfill",
    current: "15% still to landfill",
    progress: 45,
    status: "At Risk",
    color: "#ef4444",
    indicators: ["Recycling rate", "Circular economy", "Waste diversion"],
    createdAt: "2024-02-15",
  },
];

const getIconByCategory = (category: string, color: string) => {
  const iconClass = "w-6 h-6";
  switch (category) {
    case "Environmental":
      return <Leaf className={iconClass} style={{ color }} />;
    case "Social":
      return <Users className={iconClass} style={{ color }} />;
    case "Governance":
      return <Shield className={iconClass} style={{ color }} />;
    default:
      return <Target className={iconClass} style={{ color }} />;
  }
};

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
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  // Load goals from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
      } catch {
        setGoals(defaultGoals);
      }
    } else {
      setGoals(defaultGoals);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGoals));
    }
  }, []);

  // Save to localStorage when goals change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    }
  }, [goals]);

  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const matchesSearch = goal.title.toLowerCase().includes(searchText.toLowerCase()) ||
        goal.category.toLowerCase().includes(searchText.toLowerCase()) ||
        goal.status.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === "all" || goal.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [goals, searchText, selectedCategory]);

  const categories = ["all", "Environmental", "Social", "Governance"];

  const handleSaveGoal = (goal: Goal) => {
    const exists = goals.find((g) => g.id === goal.id);
    if (exists) {
      setGoals(goals.map((g) => (g.id === goal.id ? goal : g)));
      toast({ title: "Goal Updated", description: "Your goal has been updated successfully." });
    } else {
      setGoals([...goals, goal]);
      toast({ title: "Goal Created", description: "Your goal has been created successfully." });
    }
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    setGoalToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (goalToDelete) {
      setGoals(goals.filter((g) => g.id !== goalToDelete));
      toast({ title: "Goal Deleted", description: "The goal has been deleted." });
    }
    setGoalToDelete(null);
    setDeleteDialogOpen(false);
  };

  const toggleGoalSelection = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((gId) => gId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedGoals.length === 0) return;
    setGoals(goals.filter((g) => !selectedGoals.includes(g.id)));
    setSelectedGoals([]);
    toast({ title: "Goals Deleted", description: `${selectedGoals.length} goals have been deleted.` });
  };

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
          <div className="flex gap-2">
            {selectedGoals.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete} className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete ({selectedGoals.length})
              </Button>
            )}
            <Button className="btn-primary gap-2" onClick={() => { setEditingGoal(null); setModalOpen(true); }}>
              <Plus className="w-4 h-4" />
              Add Goal
            </Button>
          </div>
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
              onClick={() => toggleGoalSelection(goal.id)}
              className={cn(
                "dashboard-card group hover:shadow-lg transition-all duration-300 cursor-pointer",
                selectedGoals.includes(goal.id) && "ring-2 ring-primary"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${goal.color}15` }}
                >
                  {getIconByCategory(goal.category, goal.color)}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    onClick={() => handleEditGoal(goal)}
                  >
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button 
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
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
                
                {goal.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
                )}

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

                <p className="text-xs text-muted-foreground">
                  Created: {new Date(goal.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No goals found</h3>
            <p className="text-muted-foreground mb-4">
              {searchText ? "Try adjusting your search" : "Create your first ESG goal to get started"}
            </p>
            <Button onClick={() => { setEditingGoal(null); setModalOpen(true); }} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Goal
            </Button>
          </div>
        )}
      </div>

      {/* Goal Modal */}
      <GoalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        goal={editingGoal}
        onSave={handleSaveGoal}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
