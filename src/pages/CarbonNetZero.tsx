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
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Carbon data per documentation
interface ProjectCarbon {
  id: string;
  projectId: string;
  name: string;
  sector: string;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  baselineYear: string;
  baselineValue: number;
  currentValue: number;
  targetYear: string;
  targetReduction: number;
  currentProgress: number;
  status: "On Track" | "At Risk" | "Off Track";
}

const carbonOverview = {
  totalEmissions: 53300,
  scope1: 12450,
  scope2: 8750,
  scope3: 32100,
  netZeroTarget: "2050",
  reductionTarget: 40,
  currentReduction: 27.2,
  baselineYear: "2020",
};

const projectCarbonData: ProjectCarbon[] = [
  { id: "1", projectId: "DBN-2024-001", name: "Lagos Solar Farm", sector: "Renewable Energy", scope1: 120, scope2: 85, scope3: 245, total: 450, baselineYear: "2022", baselineValue: 580, currentValue: 450, targetYear: "2027", targetReduction: 30, currentProgress: 25, status: "On Track" },
  { id: "2", projectId: "DBN-2024-002", name: "Kano Agricultural Hub", sector: "Agriculture", scope1: 850, scope2: 650, scope3: 1350, total: 2850, baselineYear: "2021", baselineValue: 3500, currentValue: 2850, targetYear: "2028", targetReduction: 25, currentProgress: 18, status: "On Track" },
  { id: "3", projectId: "DBN-2023-018", name: "Ogun Manufacturing Hub", sector: "Manufacturing", scope1: 4200, scope2: 3100, scope3: 5200, total: 12500, baselineYear: "2020", baselineValue: 14700, currentValue: 12500, targetYear: "2030", targetReduction: 40, currentProgress: 15, status: "At Risk" },
  { id: "4", projectId: "DBN-2024-003", name: "Abuja Green Building", sector: "Real Estate", scope1: 180, scope2: 420, scope3: 600, total: 1200, baselineYear: "2023", baselineValue: 1650, currentValue: 1200, targetYear: "2028", targetReduction: 35, currentProgress: 32, status: "On Track" },
  { id: "5", projectId: "DBN-2024-004", name: "Rivers Water Treatment", sector: "Water & Sanitation", scope1: 280, scope2: 320, scope3: 250, total: 850, baselineYear: "2022", baselineValue: 1090, currentValue: 850, targetYear: "2026", targetReduction: 20, currentProgress: 22, status: "On Track" },
  { id: "6", projectId: "DBN-2024-005", name: "Delta Oil Remediation", sector: "Environmental", scope1: 1800, scope2: 1200, scope3: 2600, total: 5600, baselineYear: "2021", baselineValue: 11200, currentValue: 5600, targetYear: "2030", targetReduction: 50, currentProgress: 20, status: "Off Track" },
];

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-NG").format(value);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "On Track": return "bg-success/10 text-success border-success/20";
    case "At Risk": return "bg-warning/10 text-warning border-warning/20";
    case "Off Track": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "On Track": return <CheckCircle className="w-3 h-3" />;
    case "At Risk": return <AlertTriangle className="w-3 h-3" />;
    case "Off Track": return <XCircle className="w-3 h-3" />;
    default: return null;
  }
};

const exportToCSV = (data: ProjectCarbon[]) => {
  const date = new Date().toISOString().split('T')[0];
  const filename = `DBN_Carbon_NetZero_Report_${date}.csv`;
  
  // Build CSV content
  const headers = ["Project ID", "Project Name", "Sector", "Scope 1 (tCO₂e)", "Scope 2 (tCO₂e)", "Scope 3 (tCO₂e)", "Total (tCO₂e)", "Baseline Year", "Baseline Value", "Current Value", "Target Year", "Target Reduction %", "Current Progress %", "Status"];
  
  const rows = data.map(p => [
    p.projectId,
    p.name,
    p.sector,
    p.scope1,
    p.scope2,
    p.scope3,
    p.total,
    p.baselineYear,
    p.baselineValue,
    p.currentValue,
    p.targetYear,
    p.targetReduction,
    p.currentProgress,
    p.status
  ]);

  const csvContent = [
    `DBN Carbon & Net Zero Report`,
    `Generated: ${date}`,
    `Total Portfolio Emissions: ${formatNumber(carbonOverview.totalEmissions)} tCO₂e`,
    `Net Zero Target Year: ${carbonOverview.netZeroTarget}`,
    ``,
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export default function CarbonNetZero() {
  const [searchText, setSearchText] = useState("");

  const filteredProjects = useMemo(() => {
    return projectCarbonData.filter((project) =>
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      project.projectId.toLowerCase().includes(searchText.toLowerCase()) ||
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
          <Button onClick={() => exportToCSV(filteredProjects)} variant="outline" className="gap-2">
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
              Baseline: {carbonOverview.baselineYear}
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

        {/* Carbon Data Table per Documentation */}
        <div className="dashboard-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent" />
              Project Carbon Data
            </h3>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by Project ID, Name, Sector..."
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
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground sticky left-0 bg-card">Project ID</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Project Name</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Sector</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Scope 1</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Scope 2</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Scope 3</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground font-bold">Total</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Baseline vs Current</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Target & Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const baselineProgress = ((project.baselineValue - project.currentValue) / project.baselineValue) * 100;
                  return (
                    <tr key={project.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono text-sm sticky left-0 bg-card">{project.projectId}</td>
                      <td className="py-3 font-medium">{project.name}</td>
                      <td className="py-3 text-sm text-muted-foreground">{project.sector}</td>
                      <td className="py-3 text-right text-sm">{formatNumber(project.scope1)}</td>
                      <td className="py-3 text-right text-sm">{formatNumber(project.scope2)}</td>
                      <td className="py-3 text-right text-sm">{formatNumber(project.scope3)}</td>
                      <td className="py-3 text-right font-bold">{formatNumber(project.total)}</td>
                      <td className="py-3">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">
                            {project.baselineYear}: {formatNumber(project.baselineValue)} → {formatNumber(project.currentValue)}
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-success rounded-full"
                              style={{ width: `${Math.min(baselineProgress, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-success mt-1">-{baselineProgress.toFixed(1)}%</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">
                            {project.targetYear}: -{project.targetReduction}% target
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                project.status === "On Track" ? "bg-success" :
                                project.status === "At Risk" ? "bg-warning" : "bg-destructive"
                              )}
                              style={{ width: `${(project.currentProgress / project.targetReduction) * 100}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <span className="text-xs font-medium">{project.currentProgress}%</span>
                            <span className={cn(
                              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border",
                              getStatusColor(project.status)
                            )}>
                              {getStatusIcon(project.status)}
                              {project.status}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
