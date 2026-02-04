"use client";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Leaf,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Upload,
  ChevronDown,
  FileSpreadsheet,
  File
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projects, taxonomyRules } from "@/data/esgData";
import { exportPDF } from "@/lib/pdfExport";

const getClassificationColor = (classification: string) => {
  switch (classification) {
    case "Green": return "bg-success text-white";
    case "Transition": return "bg-warning text-white";
    case "Not Green": return "bg-destructive text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

const getEvidenceColor = (status: string) => {
  return status === "Provided" 
    ? "bg-success/10 text-success border-success/20" 
    : "bg-destructive/10 text-destructive border-destructive/20";
};

const getClassificationIcon = (classification: string) => {
  switch (classification) {
    case "Green": return <CheckCircle className="w-4 h-4" />;
    case "Transition": return <AlertCircle className="w-4 h-4" />;
    case "Not Green": return <XCircle className="w-4 h-4" />;
    default: return null;
  }
};

export default function GreenTaxonomy() {
  const [searchText, setSearchText] = useState("");
  const [classificationFilter, setClassificationFilter] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.enterpriseName.toLowerCase().includes(searchText.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchText.toLowerCase()) ||
        project.sector.toLowerCase().includes(searchText.toLowerCase());
      const matchesClassification = classificationFilter === "all" || project.taxonomyStatus === classificationFilter;
      return matchesSearch && matchesClassification;
    });
  }, [searchText, classificationFilter]);

  // Calculate overview stats
  const overviewStats = useMemo(() => {
    const total = projects.length;
    const green = projects.filter(p => p.taxonomyStatus === "Green").length;
    const transition = projects.filter(p => p.taxonomyStatus === "Transition").length;
    const notGreen = projects.filter(p => p.taxonomyStatus === "Not Green").length;
    const evidenceProvided = projects.filter(p => p.evidenceStatus === "Provided").length;
    const evidenceMissing = projects.filter(p => p.evidenceStatus === "Missing").length;
    return {
      total,
      green,
      transition,
      notGreen,
      greenPercentage: Math.round((green / total) * 100),
      transitionPercentage: Math.round((transition / total) * 100),
      notGreenPercentage: Math.round((notGreen / total) * 100),
      evidenceProvided,
      evidenceMissing,
    };
  }, []);

  const exportToCSV = () => {
    const date = new Date().toISOString().split('T')[0];
    const filename = `DBN_Green_Taxonomy_Report_${date}.csv`;
    
    const headers = ["Project ID", "Enterprise", "Sector", "Classification", "Evidence Status", "Last Updated"];
    const rows = filteredProjects.map(p => [p.projectId, p.enterpriseName, p.sector, p.taxonomyStatus, p.evidenceStatus, p.lastUpdated]);

    const csvContent = [
      `DBN Green Taxonomy Report`,
      `Generated: ${date}`,
      ``,
      `Classification Summary:`,
      `Green: ${overviewStats.green} (${overviewStats.greenPercentage}%)`,
      `Transition: ${overviewStats.transition} (${overviewStats.transitionPercentage}%)`,
      `Not Green: ${overviewStats.notGreen} (${overviewStats.notGreenPercentage}%)`,
      ``,
      `Evidence Status:`,
      `Provided: ${overviewStats.evidenceProvided}`,
      `Missing: ${overviewStats.evidenceMissing}`,
      ``,
      `Classification Criteria:`,
      ...taxonomyRules.map((rule, i) => `${i+1}. ${rule.category}: ${rule.criteria}`),
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

  const handleUploadEvidence = (projectId: string) => {
    alert(`Upload evidence for project ${projectId}. File picker would open here.`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">Green Taxonomy</h1>
            <p className="text-muted-foreground mt-1">
              View and manage green taxonomy classifications
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Report
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV} className="gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Export as Excel (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportPDF("taxonomy")} className="gap-2">
                <File className="w-4 h-4" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Taxonomy Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="stat-card">
            <p className="stat-title">Total Projects</p>
            <p className="stat-value">{overviewStats.total}</p>
          </div>
          <div className="stat-card border-l-4 border-l-success">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-success" />
              <p className="stat-title">Green</p>
            </div>
            <p className="stat-value text-success">{overviewStats.green}</p>
            <p className="text-xs text-muted-foreground">{overviewStats.greenPercentage}% of portfolio</p>
          </div>
          <div className="stat-card border-l-4 border-l-warning">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-warning" />
              <p className="stat-title">Transition</p>
            </div>
            <p className="stat-value text-warning">{overviewStats.transition}</p>
            <p className="text-xs text-muted-foreground">{overviewStats.transitionPercentage}% of portfolio</p>
          </div>
          <div className="stat-card border-l-4 border-l-destructive">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-destructive" />
              <p className="stat-title">Not Green</p>
            </div>
            <p className="stat-value text-destructive">{overviewStats.notGreen}</p>
            <p className="text-xs text-muted-foreground">{overviewStats.notGreenPercentage}% of portfolio</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by Project ID, Enterprise, Sector..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Green", "Transition", "Not Green"].map((classification) => (
              <Button
                key={classification}
                variant={classificationFilter === classification ? "default" : "outline"}
                size="sm"
                onClick={() => setClassificationFilter(classification)}
                className={cn(
                  classificationFilter === classification && "bg-primary text-primary-foreground"
                )}
              >
                {classification === "all" ? "All" : classification}
              </Button>
            ))}
          </div>
        </div>

        {/* Classification Table */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-success" />
            Project Classifications
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground sticky left-0 bg-card">Project ID</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Enterprise</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Sector</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Classification</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Evidence Status</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Last Updated</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground sticky right-0 bg-card">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.slice(0, 20).map((project) => (
                  <tr key={project.projectId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-mono text-sm sticky left-0 bg-card">{project.projectId}</td>
                    <td className="py-3 font-medium">{project.enterpriseName}</td>
                    <td className="py-3 text-sm text-muted-foreground">{project.sector}</td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                        getClassificationColor(project.taxonomyStatus)
                      )}>
                        {getClassificationIcon(project.taxonomyStatus)}
                        {project.taxonomyStatus}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium border",
                        getEvidenceColor(project.evidenceStatus)
                      )}>
                        {project.evidenceStatus}
                      </span>
                    </td>
                    <td className="py-3 text-center text-sm text-muted-foreground">{project.lastUpdated}</td>
                    <td className="py-3 sticky right-0 bg-card">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleUploadEvidence(project.projectId)}
                        >
                          <Upload className="w-3 h-3" />
                          {project.evidenceStatus === "Provided" ? "Replace" : "Upload"}
                        </Button>
                        <Button variant="outline" size="sm">
                          Reclassify
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProjects.length > 20 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Showing 20 of {filteredProjects.length} projects
            </p>
          )}
        </div>

        {/* Taxonomy Rules Reference */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Taxonomy Classification Criteria
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {taxonomyRules.map((rule, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{rule.category}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{rule.criteria}</p>
                    <p className="text-xs text-primary mt-2">Evidence: {rule.evidenceRequired}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
