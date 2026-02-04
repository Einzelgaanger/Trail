"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Calendar,
  Clock,
  CheckCircle,
  Trash2,
  Eye,
  Mail,
  Leaf,
  Flame,
  BarChart3,
  Shield,
  FileSpreadsheet,
  Presentation,
  Loader2,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  ArrowRight,
  FolderOpen,
  Plus,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportPDF } from "@/lib/pdfExport";
import { projects, calculatePortfolioStats, formatCurrencyShort } from "@/data/esgData";
import { Badge } from "@/components/ui/badge";

// 6 Report Types per Documentation
const reportCards = [
  { 
    id: "portfolio", 
    name: "ESG Portfolio Pack", 
    description: "Comprehensive ESG portfolio summary with KPIs, taxonomy breakdown, and carbon overview",
    formats: ["PDF", "Excel"],
    icon: FileText,
    gradient: "from-primary to-primary/80",
    pdfType: "portfolio" as const,
    badge: "Popular"
  },
  { 
    id: "pfi-compliance", 
    name: "PFI Compliance Summary", 
    description: "Detailed summary of all PFI submissions, validation status, and compliance metrics",
    formats: ["Excel", "PDF"],
    icon: FileSpreadsheet,
    gradient: "from-success to-success/80",
    pdfType: "projects" as const
  },
  { 
    id: "carbon-summary", 
    name: "Carbon & Net Zero", 
    description: "Portfolio and project-level carbon emissions with Scope 1, 2, 3 breakdown",
    formats: ["PDF", "Excel"],
    icon: Flame,
    gradient: "from-accent to-accent/80",
    pdfType: "carbon" as const
  },
  { 
    id: "taxonomy", 
    name: "Green Taxonomy Report", 
    description: "Complete taxonomy classifications, evidence status, and alignment criteria",
    formats: ["PDF", "Excel"],
    icon: Leaf,
    gradient: "from-primary to-success",
    pdfType: "taxonomy" as const
  },
  { 
    id: "data-quality", 
    name: "Data Quality Report", 
    description: "Data completeness scores, error logs, and validation summaries",
    formats: ["Excel", "PDF"],
    icon: BarChart3,
    gradient: "from-[#4431B4] to-[#6366f1]",
    pdfType: "portfolio" as const
  },
  { 
    id: "executive", 
    name: "Executive Summary", 
    description: "High-level dashboard summary for executive presentations",
    formats: ["PDF", "PowerPoint"],
    icon: Shield,
    gradient: "from-primary to-accent",
    pdfType: "portfolio" as const,
    badge: "New"
  },
];

const generatedReports = [
  { id: "1", name: "Q4 2024 ESG Performance Report", type: "ESG Portfolio Pack", date: "2025-01-15", generatedBy: "Admin User", status: "Ready", size: "2.4 MB" },
  { id: "2", name: "Annual Portfolio Overview 2024", type: "PFI Compliance Summary", date: "2025-01-10", generatedBy: "Admin User", status: "Ready", size: "1.8 MB" },
  { id: "3", name: "Green Taxonomy Assessment Report", type: "Green Taxonomy Report", date: "2025-01-08", generatedBy: "John Doe", status: "Ready", size: "3.1 MB" },
  { id: "4", name: "Carbon Emissions Q4 2024", type: "Carbon & Net Zero", date: "2025-01-05", generatedBy: "Jane Smith", status: "Generating", size: "-" },
  { id: "5", name: "Data Quality Audit Report", type: "Data Quality Report", date: "2024-12-20", generatedBy: "Admin User", status: "Ready", size: "892 KB" },
];

const scheduledReports = [
  { name: "Monthly ESG Summary", type: "ESG Portfolio Pack", frequency: "Monthly", nextRun: "2025-02-01", recipients: 3, active: true },
  { name: "Weekly PFI Update", type: "PFI Compliance Summary", frequency: "Weekly", nextRun: "2025-01-20", recipients: 5, active: true },
  { name: "Quarterly Carbon Report", type: "Carbon & Net Zero", frequency: "Quarterly", nextRun: "2025-04-01", recipients: 2, active: false },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Ready": return { bg: "bg-success/10", text: "text-success", border: "border-success/20", icon: CheckCircle };
    case "Generating": return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", icon: Loader2 };
    case "Failed": return { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", icon: null };
    default: return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border", icon: null };
  }
};

const getFormatStyles = (format: string) => {
  switch (format) {
    case "PDF": return { icon: FileText, bg: "bg-destructive/10", text: "text-destructive" };
    case "Excel": return { icon: FileSpreadsheet, bg: "bg-success/10", text: "text-success" };
    case "PowerPoint": return { icon: Presentation, bg: "bg-accent/10", text: "text-accent" };
    default: return { icon: FileText, bg: "bg-muted", text: "text-muted-foreground" };
  }
};

export default function Reports() {
  const [exportingStates, setExportingStates] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const stats = calculatePortfolioStats();

  const handleExport = (reportId: string, format: string, pdfType?: "portfolio" | "projects" | "carbon" | "taxonomy") => {
    const key = `${reportId}-${format}`;
    setExportingStates(prev => ({ ...prev, [key]: true }));
    
    setTimeout(() => {
      const date = new Date().toISOString().split('T')[0];
      const report = reportCards.find(r => r.id === reportId);
      
      if (format === "PDF" && pdfType) {
        exportPDF(pdfType);
      } else if (format === "Excel") {
        const filename = `DBN_${report?.name.replace(/\s+/g, '_')}_${date}.csv`;
        
        let csvContent = "";
        
        if (reportId === "portfolio" || reportId === "executive") {
          csvContent = [
            `DBN ESG Portfolio Report`,
            `Generated: ${date}`,
            ``,
            `Portfolio Summary`,
            `Total Projects,${stats.totalProjects}`,
            `Portfolio Value,₦${(stats.totalPortfolioValue / 1000000000).toFixed(2)}B`,
            `ESG Completeness,${stats.avgEsgCompleteness}%`,
            `Green Classification,${stats.greenTaxonomy.greenPercentage}%`,
            ``,
            `Carbon Summary`,
            `Total Emissions,${stats.carbonSummary.total} tCO₂e`,
            `Scope 1,${stats.carbonSummary.scope1} tCO₂e`,
            `Scope 2,${stats.carbonSummary.scope2} tCO₂e`,
            `Scope 3,${stats.carbonSummary.scope3} tCO₂e`,
            ``,
            `Project Details`,
            `Project ID,PFI,Enterprise,Sector,State,Amount,Taxonomy,ESG %,Carbon Status`,
            ...projects.map(p => 
              `${p.projectId},${p.pfiName},${p.enterpriseName},${p.sector},${p.state},${formatCurrencyShort(p.loanAmount)},${p.taxonomyStatus},${p.esgCompleteness}%,${p.carbonStatus}`
            )
          ].join("\n");
        } else if (reportId === "carbon-summary") {
          csvContent = [
            `DBN Carbon & Net Zero Report`,
            `Generated: ${date}`,
            ``,
            `Carbon Summary`,
            `Total Emissions,${stats.carbonSummary.total} tCO₂e`,
            `Scope 1 (Direct),${stats.carbonSummary.scope1} tCO₂e`,
            `Scope 2 (Energy),${stats.carbonSummary.scope2} tCO₂e`,
            `Scope 3 (Indirect),${stats.carbonSummary.scope3} tCO₂e`,
            ``,
            `Project Carbon Data`,
            `Project ID,Enterprise,Sector,Scope 1,Scope 2,Scope 3,Total,Target Year,Progress,Status`,
            ...projects.map(p => 
              `${p.projectId},${p.enterpriseName},${p.sector},${p.scope1},${p.scope2},${p.scope3},${p.totalEmissions},${p.targetYear},${p.currentProgress}%,${p.carbonStatus}`
            )
          ].join("\n");
        } else if (reportId === "taxonomy") {
          csvContent = [
            `DBN Green Taxonomy Report`,
            `Generated: ${date}`,
            ``,
            `Classification Summary`,
            `Green,${stats.greenTaxonomy.green},${stats.greenTaxonomy.greenPercentage}%`,
            `Transition,${stats.greenTaxonomy.transition},${stats.greenTaxonomy.transitionPercentage}%`,
            `Not Green,${stats.greenTaxonomy.notGreen},${stats.greenTaxonomy.notGreenPercentage}%`,
            ``,
            `Project Classifications`,
            `Project ID,Enterprise,Sector,Classification,Evidence Status,Last Updated`,
            ...projects.map(p => 
              `${p.projectId},${p.enterpriseName},${p.sector},${p.taxonomyStatus},${p.evidenceStatus},${p.lastUpdated}`
            )
          ].join("\n");
        } else {
          csvContent = [
            `DBN ${report?.name} Report`,
            `Generated: ${date}`,
            ``,
            `Project ID,PFI,Enterprise,Sector,State,Amount,Taxonomy,ESG %`,
            ...projects.map(p => 
              `${p.projectId},${p.pfiName},${p.enterpriseName},${p.sector},${p.state},${formatCurrencyShort(p.loanAmount)},${p.taxonomyStatus},${p.esgCompleteness}%`
            )
          ].join("\n");
        }
        
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      } else {
        alert(`${format} export for "${report?.name}" initiated.`);
      }
      
      setExportingStates(prev => ({ ...prev, [key]: false }));
    }, 1200);
  };

  const handleQuickExport = (type: string) => {
    if (type === "Complete_Portfolio") {
      exportPDF("portfolio");
    } else if (type === "All_Project_Data") {
      exportPDF("projects");
    } else if (type === "Complete_Dataset") {
      const date = new Date().toISOString().split('T')[0];
      const csvContent = [
        `DBN Complete Dataset Export`,
        `Generated: ${date}`,
        ``,
        `Project ID,PFI ID,PFI Name,Sector,Enterprise,Size,City,State,Funding Type,Start Year,Loan Amount,ESG %,Reporting,Taxonomy,Evidence,Scope 1,Scope 2,Scope 3,Total CO2,Target Year,Progress,Carbon Status,Data Quality`,
        ...projects.map(p => 
          `${p.projectId},${p.pfiId},${p.pfiName},${p.sector},${p.enterpriseName},${p.enterpriseSize},${p.city},${p.state},${p.fundingType},${p.projectStartYear},${p.loanAmount},${p.esgCompleteness}%,${p.reportingStatus},${p.taxonomyStatus},${p.evidenceStatus},${p.scope1},${p.scope2},${p.scope3},${p.totalEmissions},${p.targetYear},${p.currentProgress}%,${p.carbonStatus},${p.dataQualityScore}%`
        )
      ].join("\n");
      
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `DBN_Complete_Dataset_${date}.csv`;
      link.click();
    }
  };

  const filteredReports = generatedReports.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Generate, schedule, and export comprehensive ESG reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              New Report
            </Button>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{generatedReports.length}</p>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{generatedReports.filter(r => r.status === "Ready").length}</p>
                <p className="text-xs text-muted-foreground">Ready</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{scheduledReports.filter(r => r.active).length}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalProjects}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Templates Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Report Templates
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {reportCards.map((report) => {
              const Icon = report.icon;
              return (
                <div 
                  key={report.id} 
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  {/* Gradient Header */}
                  <div className={cn("h-2 bg-gradient-to-r", report.gradient)} />
                  
                  <div className="p-5">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-md",
                        report.gradient
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground truncate">{report.name}</h3>
                          {report.badge && (
                            <Badge variant={report.badge === "Popular" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                              {report.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{report.description}</p>
                      </div>
                    </div>
                    
                    {/* Export Buttons */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                      {report.formats.map((format) => {
                        const formatStyle = getFormatStyles(format);
                        const FormatIcon = formatStyle.icon;
                        const isExporting = exportingStates[`${report.id}-${format}`];
                        
                        return (
                          <Button
                            key={format}
                            variant="outline"
                            size="sm"
                            className={cn(
                              "gap-2 flex-1 min-w-[100px] group/btn transition-all",
                              "hover:border-primary hover:bg-primary/5"
                            )}
                            onClick={() => handleExport(report.id, format, report.pdfType)}
                            disabled={isExporting}
                          >
                            {isExporting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <FormatIcon className={cn("w-4 h-4", formatStyle.text)} />
                            )}
                            <span>{isExporting ? "Exporting..." : format}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Export Section */}
        <div className="bg-gradient-to-br from-primary/5 via-card to-accent/5 rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Quick Export</h3>
              <p className="text-sm text-muted-foreground">One-click export for common reports</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => handleQuickExport("Complete_Portfolio")} 
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <FileText className="w-4 h-4" />
              Portfolio Pack (PDF)
            </Button>
            <Button 
              onClick={() => handleQuickExport("All_Project_Data")} 
              variant="outline" 
              className="gap-2 hover:border-primary hover:bg-primary/5"
            >
              <FolderOpen className="w-4 h-4" />
              Project Drilldown (PDF)
            </Button>
            <Button 
              onClick={() => handleQuickExport("Complete_Dataset")} 
              variant="outline" 
              className="gap-2 hover:border-success hover:bg-success/5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Complete Dataset (CSV)
            </Button>
          </div>
        </div>

        {/* Generated Reports & Scheduled Reports */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Generated Reports - Takes 2 columns */}
          <div className="xl:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  Generated Reports
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 bg-background"
                  />
                </div>
              </div>
            </div>
            <div className="divide-y divide-border">
              {filteredReports.map((report) => {
                const statusStyle = getStatusStyles(report.status);
                const StatusIcon = statusStyle.icon;
                
                return (
                  <div 
                    key={report.id} 
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground truncate">{report.name}</h4>
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                          statusStyle.bg, statusStyle.text, statusStyle.border
                        )}>
                          {StatusIcon && (
                            <StatusIcon className={cn("w-3 h-3", report.status === "Generating" && "animate-spin")} />
                          )}
                          {report.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {report.date}
                        </span>
                        <span className="text-xs text-muted-foreground">{report.type}</span>
                        <span className="text-xs text-muted-foreground">{report.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-success/10 hover:text-success">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/30">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Scheduled Reports
              </h3>
            </div>
            <div className="divide-y divide-border">
              {scheduledReports.map((report, idx) => (
                <div key={idx} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-foreground text-sm">{report.name}</h4>
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5",
                      report.active ? "bg-success" : "bg-muted-foreground"
                    )} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{report.type}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {report.frequency}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {report.recipients}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Next: {report.nextRun}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Schedule New Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
