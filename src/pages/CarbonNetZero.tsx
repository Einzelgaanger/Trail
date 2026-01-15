"use client";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Flame,
  Download,
  Target,
  TrendingDown,
  Factory,
  Zap,
  Truck,
  Calendar,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Carbon data
const carbonOverview = {
  totalEmissions: 53300,
  scope1: 12450,
  scope2: 8750,
  scope3: 32100,
  netZeroTarget: "2050",
  reductionTarget: 40,
  currentReduction: 27.2,
  projectedAchievement: "2048",
};

const projectEmissions = [
  { id: "1", name: "Lagos Solar Farm", sector: "Renewable Energy", scope1: true, scope2: true, scope3: false, emissions: 450, target: 30, current: 25, status: "On Track" },
  { id: "2", name: "Kano Agriculture Hub", sector: "Agriculture", scope1: true, scope2: true, scope3: true, emissions: 2850, target: 25, current: 18, status: "On Track" },
  { id: "3", name: "Ogun Manufacturing", sector: "Manufacturing", scope1: true, scope2: true, scope3: true, emissions: 12500, target: 40, current: 15, status: "At Risk" },
  { id: "4", name: "Abuja Green Building", sector: "Real Estate", scope1: false, scope2: true, scope3: true, emissions: 1200, target: 35, current: 32, status: "On Track" },
  { id: "5", name: "Rivers Water Treatment", sector: "Water & Sanitation", scope1: true, scope2: true, scope3: false, emissions: 850, target: 20, current: 22, status: "Achieved" },
  { id: "6", name: "Delta Oil Remediation", sector: "Environmental", scope1: true, scope2: false, scope3: true, emissions: 5600, target: 50, current: 20, status: "At Risk" },
];

const reductionInitiatives = [
  { name: "Solar Panel Installation", impact: 2500, status: "In Progress", progress: 65, cost: 180000000 },
  { name: "Energy Efficiency Program", impact: 1800, status: "In Progress", progress: 45, cost: 85000000 },
  { name: "Fleet Electrification", impact: 3200, status: "Planning", progress: 15, cost: 320000000 },
  { name: "Carbon Offset Purchases", impact: 5000, status: "Completed", progress: 100, cost: 120000000 },
];

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-NG").format(value);
};

const formatCurrency = (value: number) => {
  return `₦${(value / 1000000).toFixed(0)}M`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "On Track": return "bg-primary/10 text-primary border-primary/20";
    case "Achieved": return "bg-success/10 text-success border-success/20";
    case "At Risk": return "bg-destructive/10 text-destructive border-destructive/20";
    case "Completed": return "bg-success/10 text-success border-success/20";
    case "In Progress": return "bg-primary/10 text-primary border-primary/20";
    case "Planning": return "bg-warning/10 text-warning border-warning/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export default function CarbonNetZero() {
  const [searchText, setSearchText] = useState("");

  const filteredProjects = useMemo(() => {
    return projectEmissions.filter((project) =>
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      project.sector.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  const netZeroProgress = (carbonOverview.currentReduction / carbonOverview.reductionTarget) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">Carbon & Net Zero</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage carbon emissions and net-zero targets
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Carbon Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="stat-card lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="stat-title">Total Carbon Emissions</p>
                <p className="text-3xl font-bold">{formatNumber(carbonOverview.totalEmissions)} tCO₂e</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-muted rounded-lg text-center">
                <Factory className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-semibold">{formatNumber(carbonOverview.scope1)}</p>
                <p className="text-xs text-muted-foreground">Scope 1 (Direct)</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <Zap className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-semibold">{formatNumber(carbonOverview.scope2)}</p>
                <p className="text-xs text-muted-foreground">Scope 2 (Energy)</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <Truck className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-semibold">{formatNumber(carbonOverview.scope3)}</p>
                <p className="text-xs text-muted-foreground">Scope 3 (Indirect)</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-primary" />
              <p className="stat-title">Net-Zero Target</p>
            </div>
            <p className="text-4xl font-bold text-primary">{carbonOverview.netZeroTarget}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Projected: {carbonOverview.projectedAchievement}
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-success" />
              <p className="stat-title">Reduction Progress</p>
            </div>
            <p className="text-4xl font-bold text-success">{carbonOverview.currentReduction}%</p>
            <p className="text-sm text-muted-foreground mt-1">Target: {carbonOverview.reductionTarget}%</p>
            <Progress value={netZeroProgress} className="h-2 mt-3" />
          </div>
        </div>

        {/* Projects Emissions Table */}
        <div className="dashboard-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent" />
              Project Emissions
            </h3>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Project</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Sector</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Scope 1</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Scope 2</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Scope 3</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Emissions</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Reduction</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-medium">{project.name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{project.sector}</td>
                    <td className="py-3 text-center">
                      {project.scope1 ? (
                        <CheckCircle className="w-4 h-4 text-success mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {project.scope2 ? (
                        <CheckCircle className="w-4 h-4 text-success mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {project.scope3 ? (
                        <CheckCircle className="w-4 h-4 text-success mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-medium">{formatNumber(project.emissions)} tCO₂e</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm">{project.current}%</span>
                        <span className="text-xs text-muted-foreground">/ {project.target}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium border",
                        getStatusColor(project.status)
                      )}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reduction Initiatives */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-success" />
            Carbon Reduction Initiatives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reductionInitiatives.map((initiative, idx) => (
              <div key={idx} className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{initiative.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Expected Impact: -{formatNumber(initiative.impact)} tCO₂e
                    </p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium border",
                    getStatusColor(initiative.status)
                  )}>
                    {initiative.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{initiative.progress}%</span>
                  </div>
                  <Progress value={initiative.progress} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Budget: {formatCurrency(initiative.cost)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
