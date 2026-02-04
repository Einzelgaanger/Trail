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
  XCircle,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projects, calculatePortfolioStats, formatNumber } from "@/data/esgData";
import { exportPDF } from "@/lib/pdfExport";

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

const exportToCSV = () => {
  const date = new Date().toISOString().split('T')[0];
  const filename = `DBN_Carbon_NetZero_Report_${date}.csv`;
  const stats = calculatePortfolioStats();
  
  const csvContent = [
    `DBN Carbon & Net Zero Report`,
    `Generated: ${date}`,
    `Total Portfolio Emissions: ${formatNumber(stats.carbonSummary.total)} tCO₂e`,
    `Net Zero Target Year: 2050`,
    ``,
    `Scope Breakdown:`,
    `Scope 1 (Direct),${stats.carbonSummary.scope1} tCO₂e`,
    `Scope 2 (Energy),${stats.carbonSummary.scope2} tCO₂e`,
    `Scope 3 (Indirect),${stats.carbonSummary.scope3} tCO₂e`,
    ``,
    `Project Carbon Data`,
    `Project ID,Enterprise,Sector,Scope 1,Scope 2,Scope 3,Total,Baseline Year,Target Year,Target %,Progress %,Status`,
    ...projects.map(p => 
      `${p.projectId},${p.enterpriseName},${p.sector},${p.scope1},${p.scope2},${p.scope3},${p.totalEmissions},${p.baselineYear},${p.targetYear},${p.targetReduction}%,${p.currentProgress}%,${p.carbonStatus}`
    )
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
  const stats = calculatePortfolioStats();

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.enterpriseName.toLowerCase().includes(searchText.toLowerCase()) ||
      project.projectId.toLowerCase().includes(searchText.toLowerCase()) ||
      project.sector.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  // Calculate net zero progress (simulated)
  const netZeroProgress = 68; // 68% of interim target achieved

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">Carbon & Net Zero</h1>
            <p className="text-muted-foreground mt-1">
              Track carbon emissions and net-zero targets
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => exportPDF("carbon")} variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
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
                <p className="text-3xl font-bold">{formatNumber(stats.carbonSummary.total)} tCO₂e</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-muted rounded-lg text-center">
                <Factory className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-semibold">{formatNumber(stats.carbonSummary.scope1)}</p>
                <p className="text-xs text-muted-foreground">Scope 1 (Direct)</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <Zap className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-semibold">{formatNumber(stats.carbonSummary.scope2)}</p>
                <p className="text-xs text-muted-foreground">Scope 2 (Energy)</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <Truck className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-semibold">{formatNumber(stats.carbonSummary.scope3)}</p>
                <p className="text-xs text-muted-foreground">Scope 3 (Indirect)</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-primary" />
              <p className="stat-title">Net-Zero Target</p>
            </div>
            <p className="text-4xl font-bold text-primary">2050</p>
            <p className="text-sm text-muted-foreground mt-2">
              Baseline: 2020
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Interim: 40% reduction by 2030
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-success" />
              <p className="stat-title">Progress to 2030</p>
            </div>
            <p className="text-4xl font-bold text-success">27%</p>
            <p className="text-sm text-muted-foreground mt-1">of 40% target achieved</p>
            <Progress value={netZeroProgress} className="h-2 mt-3" />
            <p className="text-xs text-muted-foreground mt-1">On track for interim target</p>
          </div>
        </div>

        {/* Carbon Data Table */}
        <div className="dashboard-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent" />
              Project Carbon Data
            </h3>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by Project ID, Enterprise, Sector..."
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
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Enterprise</th>
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
                {filteredProjects.slice(0, 15).map((project) => {
                  const baselineProgress = ((project.baselineEmissions - project.totalEmissions) / project.baselineEmissions) * 100;
                  return (
                    <tr key={project.projectId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono text-sm sticky left-0 bg-card">{project.projectId}</td>
                      <td className="py-3 font-medium">{project.enterpriseName}</td>
                      <td className="py-3 text-sm text-muted-foreground">{project.sector}</td>
                      <td className="py-3 text-right text-sm">{formatNumber(project.scope1)}</td>
                      <td className="py-3 text-right text-sm">{formatNumber(project.scope2)}</td>
                      <td className="py-3 text-right text-sm">{formatNumber(project.scope3)}</td>
                      <td className="py-3 text-right font-bold">{formatNumber(project.totalEmissions)}</td>
                      <td className="py-3">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">
                            {project.baselineYear}: {formatNumber(project.baselineEmissions)} → {formatNumber(project.totalEmissions)}
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
                                project.carbonStatus === "On Track" ? "bg-success" :
                                project.carbonStatus === "At Risk" ? "bg-warning" : "bg-destructive"
                              )}
                              style={{ width: `${(project.currentProgress / project.targetReduction) * 100}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <span className="text-xs font-medium">{project.currentProgress}%</span>
                            <span className={cn(
                              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border",
                              getStatusColor(project.carbonStatus)
                            )}>
                              {getStatusIcon(project.carbonStatus)}
                              {project.carbonStatus}
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
          {filteredProjects.length > 15 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Showing 15 of {filteredProjects.length} projects
            </p>
          )}
        </div>

        {/* Calculation Logic Reference */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Carbon Calculation Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Scope 1 - Direct</h4>
              <p className="text-xs text-muted-foreground">
                Activity Data × Emission Factor = tCO₂e
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Direct emissions from owned or controlled sources
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Scope 2 - Energy Indirect</h4>
              <p className="text-xs text-muted-foreground">
                Energy Consumption × Grid Factor = tCO₂e
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Indirect emissions from purchased electricity, steam, heating
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Scope 3 - Other Indirect</h4>
              <p className="text-xs text-muted-foreground">
                Supply Chain Data × Emission Factors = tCO₂e
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                All other indirect emissions in the value chain
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
