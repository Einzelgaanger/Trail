"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
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
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportPDF } from "@/lib/pdfExport";
import { projects, calculatePortfolioStats, formatCurrencyShort } from "@/data/esgData";

// 6 Report Types per Documentation
const reportCards = [
  { 
    id: "portfolio", 
    name: "DBN ESG Portfolio Pack", 
    description: "Comprehensive ESG portfolio summary with KPIs",
    formats: ["PDF", "Excel"],
    icon: FileText,
    color: "#196933",
    pdfType: "portfolio" as const
  },
  { 
    id: "pfi-compliance", 
    name: "PFI Compliance Summary", 
    description: "Summary of all PFI submissions and status",
    formats: ["Excel", "PDF"],
    icon: FileSpreadsheet,
    color: "#27BE63",
    pdfType: "projects" as const
  },
  { 
    id: "carbon-summary", 
    name: "Carbon & Net Zero Summary", 
    description: "Portfolio and project-level carbon emissions",
    formats: ["PDF", "Excel"],
    icon: Flame,
    color: "#D48F05",
    pdfType: "carbon" as const
  },
  { 
    id: "taxonomy", 
    name: "Green Taxonomy Report", 
    description: "Complete taxonomy classifications",
    formats: ["PDF", "Excel"],
    icon: Leaf,
    color: "#196933",
    pdfType: "taxonomy" as const
  },
  { 
    id: "data-quality", 
    name: "ESG Data Quality Report", 
    description: "Data completeness scores and error logs",
    formats: ["Excel", "PDF"],
    icon: BarChart3,
    color: "#4431B4",
    pdfType: "portfolio" as const
  },
  { 
    id: "executive", 
    name: "Executive Dashboard Summary", 
    description: "High-level executive summary",
    formats: ["PDF", "PowerPoint"],
    icon: Shield,
    color: "#196933",
    pdfType: "portfolio" as const
  },
];

const generatedReports = [
  { id: "1", name: "Q4 2024 ESG Performance Report", type: "ESG Portfolio Pack", date: "2025-01-15", generatedBy: "Admin User", status: "Ready" },
  { id: "2", name: "Annual Portfolio Overview 2024", type: "PFI Compliance Summary", date: "2025-01-10", generatedBy: "Admin User", status: "Ready" },
  { id: "3", name: "Green Taxonomy Assessment Report", type: "Green Taxonomy Report", date: "2025-01-08", generatedBy: "John Doe", status: "Ready" },
  { id: "4", name: "Carbon Emissions Q4 2024", type: "Carbon & Net Zero Summary", date: "2025-01-05", generatedBy: "Jane Smith", status: "Generating" },
  { id: "5", name: "Data Quality Audit Report", type: "ESG Data Quality Report", date: "2024-12-20", generatedBy: "Admin User", status: "Ready" },
];

const scheduledReports = [
  { name: "Monthly ESG Summary", type: "ESG Portfolio Pack", frequency: "Monthly", nextRun: "2025-02-01", recipients: 3 },
  { name: "Weekly PFI Update", type: "PFI Compliance Summary", frequency: "Weekly", nextRun: "2025-01-20", recipients: 5 },
  { name: "Quarterly Carbon Report", type: "Carbon & Net Zero Summary", frequency: "Quarterly", nextRun: "2025-04-01", recipients: 2 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ready": return "bg-success/10 text-success border-success/20";
    case "Generating": return "bg-primary/10 text-primary border-primary/20";
    case "Failed": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const getFormatIcon = (format: string) => {
  switch (format) {
    case "PDF": return FileText;
    case "Excel": return FileSpreadsheet;
    case "Word": return FileText;
    case "PowerPoint": return Presentation;
    default: return FileText;
  }
};

export default function Reports() {
  const [exportingStates, setExportingStates] = useState<Record<string, boolean>>({});

  const handleExport = (reportId: string, format: string, pdfType?: "portfolio" | "projects" | "carbon" | "taxonomy") => {
    const key = `${reportId}-${format}`;
    setExportingStates(prev => ({ ...prev, [key]: true }));
    
    setTimeout(() => {
      const date = new Date().toISOString().split('T')[0];
      const report = reportCards.find(r => r.id === reportId);
      
      if (format === "PDF" && pdfType) {
        // Generate real PDF using jsPDF
        exportPDF(pdfType);
      } else if (format === "Excel") {
        // Generate CSV/Excel
        const filename = `DBN_${report?.name.replace(/\s+/g, '_')}_${date}.csv`;
        const stats = calculatePortfolioStats();
        
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
    }, 1000);
  };

  const handleQuickExport = (type: string) => {
    if (type === "Complete_Portfolio") {
      exportPDF("portfolio");
    } else if (type === "All_Project_Data") {
      exportPDF("projects");
    } else if (type === "Complete_Dataset") {
      // Export all data as CSV
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

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Generate, view, and export ESG reports
            </p>
          </div>
        </div>

        {/* 6 Report Cards per Documentation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCards.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="dashboard-card hover:shadow-lg transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${report.color}15`, color: report.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.formats.map((format) => {
                    const FormatIcon = getFormatIcon(format);
                    const isExporting = exportingStates[`${report.id}-${format}`];
                    return (
                      <Button
                        key={format}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleExport(report.id, format, report.pdfType)}
                        disabled={isExporting}
                      >
                        {isExporting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FormatIcon className="w-4 h-4" />
                        )}
                        {isExporting ? "Exporting..." : `Export ${format}`}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Export Actions per Documentation */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Quick Export Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleQuickExport("Complete_Portfolio")} className="gap-2">
              <FileText className="w-4 h-4" />
              Export Portfolio Pack (PDF)
            </Button>
            <Button onClick={() => handleQuickExport("All_Project_Data")} variant="outline" className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Export Project Drilldown (PDF)
            </Button>
            <Button onClick={() => handleQuickExport("Complete_Dataset")} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Complete Dataset (CSV)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generated Reports */}
          <div className="lg:col-span-2 dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Generated Reports
              </h3>
            </div>
            <div className="space-y-3">
              {generatedReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium truncate">{report.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.date}
                      </span>
                      <span className="text-xs text-muted-foreground">{report.generatedBy}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium border",
                      getStatusColor(report.status)
                    )}>
                      {report.status === "Ready" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {report.status}
                        </span>
                      ) : report.status === "Generating" ? (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-spin" />
                          {report.status}
                        </span>
                      ) : (
                        report.status
                      )}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Scheduled Reports
            </h3>
            <div className="space-y-3">
              {scheduledReports.map((report, idx) => (
                <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm">{report.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{report.type}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Frequency: </span>
                      <span className="font-medium">{report.frequency}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {report.recipients} recipients
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Next run: {report.nextRun}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
