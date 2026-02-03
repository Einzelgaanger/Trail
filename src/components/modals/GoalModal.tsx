"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: "Environmental" | "Social" | "Governance";
  status: "Not Started" | "On Track" | "At Risk" | "Completed";
  target: string;
  current: string;
  progress: number;
  indicators: string[];
  color: string;
  createdAt: string;
}

interface GoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  onSave: (goal: Goal) => void;
}

const colorOptions = [
  { value: "#22c55e", label: "Green" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#ef4444", label: "Red" },
];

export function GoalModal({ open, onOpenChange, goal, onSave }: GoalModalProps) {
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: "",
    description: "",
    category: "Environmental",
    status: "Not Started",
    target: "",
    current: "",
    progress: 0,
    indicators: [],
    color: "#22c55e",
  });
  const [newIndicator, setNewIndicator] = useState("");

  useEffect(() => {
    if (goal) {
      setFormData(goal);
    } else {
      setFormData({
        title: "",
        description: "",
        category: "Environmental",
        status: "Not Started",
        target: "",
        current: "",
        progress: 0,
        indicators: [],
        color: "#22c55e",
      });
    }
  }, [goal, open]);

  const handleSave = () => {
    if (!formData.title) return;
    
    const newGoal: Goal = {
      id: goal?.id || `goal_${Date.now()}`,
      title: formData.title || "",
      description: formData.description || "",
      category: formData.category || "Environmental",
      status: formData.status || "Not Started",
      target: formData.target || "",
      current: formData.current || "",
      progress: formData.progress || 0,
      indicators: formData.indicators || [],
      color: formData.color || "#22c55e",
      createdAt: goal?.createdAt || new Date().toISOString(),
    };
    
    onSave(newGoal);
    onOpenChange(false);
  };

  const addIndicator = () => {
    if (newIndicator.trim()) {
      setFormData({
        ...formData,
        indicators: [...(formData.indicators || []), newIndicator.trim()],
      });
      setNewIndicator("");
    }
  };

  const removeIndicator = (index: number) => {
    setFormData({
      ...formData,
      indicators: formData.indicators?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter goal title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter goal description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Goal["category"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Environmental">Environmental</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Governance">Governance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Goal["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="On Track">On Track</SelectItem>
                  <SelectItem value="At Risk">At Risk</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                placeholder="e.g., 40% reduction"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current">Current</Label>
              <Input
                id="current"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                placeholder="e.g., 27% achieved"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress">Progress (%)</Label>
            <Input
              id="progress"
              type="number"
              min={0}
              max={100}
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <Select
              value={formData.color}
              onValueChange={(value) => setFormData({ ...formData, color: value })}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: formData.color }} />
                    {colorOptions.find((c) => c.value === formData.color)?.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: color.value }} />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Indicators</Label>
            <div className="flex gap-2">
              <Input
                value={newIndicator}
                onChange={(e) => setNewIndicator(e.target.value)}
                placeholder="Add indicator"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIndicator())}
              />
              <Button type="button" size="icon" onClick={addIndicator}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.indicators?.map((indicator, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-muted rounded text-sm flex items-center gap-1"
                >
                  {indicator}
                  <button
                    type="button"
                    onClick={() => removeIndicator(index)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.title}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
