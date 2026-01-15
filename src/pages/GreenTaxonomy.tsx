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

interface TaxonomyProject {
  id: string;
  projectId: string;
  name: string;
  sector: string;
  classification: "Green" | "Transition" | "Not Green";
  evidenceStatus: "Provided" | "Missing";
  lastUpdated: string;
  evidenceFile?: string;
}

const mockProjects: TaxonomyProject[] = [
  { id: "1", projectId: "DBN-2024-001", name: "Lagos Solar Farm Development", sector: "Renewable Energy", classification: "Green", evidenceStatus: "Provided", lastUpdated: "2025-01-15", evidenceFile: "solar_farm_evidence.pdf" },
  { id: "2", projectId: "DBN-2024-004", name: "Rivers State Water Treatment", sector: "Water & Sanitation", classification: "Green", evidenceStatus: "Provided", lastUpdated: "2025-01-12", evidenceFile: "water_treatment_docs.pdf" },
  { id: "3", projectId: "DBN-2024-003", name: "Abuja Green Building Initiative", sector: "Real Estate", classification: "Green", evidenceStatus: "Missing", lastUpdated: "2025-01-10" },
  { id: "4", projectId: "DBN-2024-002", name: "Kano Agricultural Expansion", sector: "Agriculture", classification: "Transition", evidenceStatus: "Provided", lastUpdated: "2025-01-08", evidenceFile: "agri_assessment.pdf" },
  { id: "5", projectId: "DBN-2023-018", name: "Ogun Manufacturing Hub", sector: "Manufacturing", classification: "Not Green", evidenceStatus: "Provided", lastUpdated: "2025-01-05", evidenceFile: "manufacturing_report.pdf" },
  { id: "6", projectId: "DBN-2024-006", name: "Kaduna Wind Farm Project", sector: "Renewable Energy", classification: "Green", evidenceStatus: "Missing", lastUpdated: "2024-12-28" },
  { id: "7", projectId: "DBN-2024-007", name: "Enugu Clean Transport", sector: "Transportation", classification: "Transition", evidenceStatus: "Missing", lastUpdated: "2024-12-20" },
  { id: "8", projectId: "DBN-2024-005", name: "Delta Oil Remediation", sector: "Environmental Services", classification: "Not Green", evidenceStatus: "Provided", lastUpdated: "2024-12-15", evidenceFile: "remediation_evidence.pdf" },
];

const taxonomyRules = [
  "Climate Change Mitigation",
  "Climate Change Adaptation", 
  "Water & Marine Resources Protection",
  "Circular Economy Transition",
  "Pollution Prevention & Control",
  "Biodiversity & Ecosystems Protection",
  "Do No Significant Harm (DNSH)",
  "Minimum Social Safeguards",
  "Technical Screening Criteria",
  "Substantial Contribution",
  "Environmental Impact Assessment",
  "Social Impact Assessment",
];

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
    return mockProjects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchText.toLowerCase()) ||
        project.sector.toLowerCase().includes(searchText.toLowerCase());
      const matchesClassification = classificationFilter === "all" || project.classification === classificationFilter;
      return matchesSearch && matchesClassification;
    });
  }, [searchText, classificationFilter]);

  // Calculate overview stats
  const overviewStats = useMemo(() => {
    const total = mockProjects.length;
    const green = mockProjects.filter(p => p.classification === "Green").length;
    const transition = mockProjects.filter(p => p.classification === "Transition").length;
    const notGreen = mockProjects.filter(p => p.classification === "Not Green").length;
    const evidenceProvided = mockProjects.filter(p => p.evidenceStatus === "Provided").length;
    const evidenceMissing = mockProjects.filter(p => p.evidenceStatus === "Missing").length;
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
    
    const headers = ["Project ID", "Project Name", "Sector", "Classification", "Evidence Status", "Last Updated"];
    const rows = filteredProjects.map(p => [p.projectId, p.name, p.sector, p.classification, p.evidenceStatus, p.lastUpdated]);

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
      `Taxonomy Rules:`,
      ...taxonomyRules.map((rule, i) => `${i+1}. ${rule}`),
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

  const exportToPDF = () => {
    // Simulated PDF export - in real app would use jsPDF
    alert("PDF export initiated. In production, this would generate a formatted PDF report.");
  };

  const exportBoth = () => {
    exportToCSV();
    setTimeout(() => exportToPDF(), 500);
  };

  const handleUploadEvidence = (projectId: string) => {
    // Simulated upload - would trigger file picker in real app
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
              View and manage green taxonomy classifications for projects
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
              <DropdownMenuItem onClick={exportToPDF} className="gap-2">
                <File className="w-4 h-4" />
                Export as PDF (.pdf)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportBoth} className="gap-2">
                <Download className="w-4 h-4" />
                Export Both Formats
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
              placeholder="Search by Project ID, Name, Sector..."
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

        {/* Classification Table per Documentation */}
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
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Project Name</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Sector</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Classification</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Evidence Status</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Last Updated</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground sticky right-0 bg-card">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-mono text-sm sticky left-0 bg-card">{project.projectId}</td>
                    <td className="py-3 font-medium">{project.name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{project.sector}</td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                        getClassificationColor(project.classification)
                      )}>
                        {getClassificationIcon(project.classification)}
                        {project.classification}
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
                        {project.evidenceFile && (
                          <Button variant="ghost" size="sm" className="gap-1">
                            <FileText className="w-3 h-3" />
                            View
                          </Button>
                        )}
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
        </div>

        {/* Taxonomy Rules Reference */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Taxonomy Classification Criteria
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {taxonomyRules.map((rule, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {idx + 1}
                </div>
                <span className="text-sm">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
