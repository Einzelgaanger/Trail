"use client";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Upload,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  FileSpreadsheet,
  AlertTriangle,
  Send,
  Check,
  FileCheck,
  Globe,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Submission {
  id: string;
  pfiName: string;
  projectId: string;
  submissionDate: string;
  status: "Draft" | "Submitted" | "Validated" | "Approved" | "Published";
  dataQualityScore: number;
  errorCount: number;
  validator: string;
  lastUpdated: string;
}

interface ErrorLogEntry {
  id: string;
  field: string;
  issue: string;
  recordId: string;
  severity: "Critical" | "Warning" | "Info";
  status: "Open" | "Resolved";
}

const submissions: Submission[] = [
  { id: "1", pfiName: "Lagos Solar Farm", projectId: "DBN-2024-001", submissionDate: "2025-01-15", status: "Published", dataQualityScore: 95, errorCount: 0, validator: "Admin User", lastUpdated: "2025-01-15" },
  { id: "2", pfiName: "Kano Agri Hub", projectId: "DBN-2024-002", submissionDate: "2025-01-12", status: "Approved", dataQualityScore: 88, errorCount: 2, validator: "John Doe", lastUpdated: "2025-01-14" },
  { id: "3", pfiName: "Abuja Green Building", projectId: "DBN-2024-003", submissionDate: "2025-01-10", status: "Validated", dataQualityScore: 92, errorCount: 1, validator: "Jane Smith", lastUpdated: "2025-01-12" },
  { id: "4", pfiName: "Rivers Water Treatment", projectId: "DBN-2024-004", submissionDate: "2025-01-08", status: "Submitted", dataQualityScore: 75, errorCount: 5, validator: "-", lastUpdated: "2025-01-08" },
  { id: "5", pfiName: "Ogun Manufacturing", projectId: "DBN-2023-018", submissionDate: "2025-01-05", status: "Draft", dataQualityScore: 45, errorCount: 12, validator: "-", lastUpdated: "2025-01-07" },
];

const errorLog: ErrorLogEntry[] = [
  { id: "1", field: "Carbon Emissions", issue: "Missing Scope 3 data", recordId: "Q4-2024", severity: "Critical", status: "Open" },
  { id: "2", field: "ESG Score", issue: "Value out of range (>100)", recordId: "Q3-2024", severity: "Warning", status: "Open" },
  { id: "3", field: "Project Budget", issue: "Currency mismatch", recordId: "Annual", severity: "Warning", status: "Resolved" },
  { id: "4", field: "Location Data", issue: "Invalid coordinates", recordId: "Initial", severity: "Info", status: "Open" },
  { id: "5", field: "Start Date", issue: "Date format inconsistency", recordId: "Q1-2025", severity: "Info", status: "Open" },
];

const uploadedFiles = [
  { name: "PFI_Q4_2024_Template.xlsx", type: "Excel", date: "2025-01-15", size: "2.4 MB" },
  { name: "ESG_Data_Export.xlsx", type: "Excel", date: "2025-01-12", size: "1.8 MB" },
  { name: "Annual_Report_Form.pdf", type: "PDF", date: "2025-01-10", size: "856 KB" },
];

const workflowSteps = [
  { key: "Draft", icon: FileText, label: "Draft" },
  { key: "Submitted", icon: Send, label: "Submitted" },
  { key: "Validated", icon: FileCheck, label: "Validated" },
  { key: "Approved", icon: Check, label: "Approved" },
  { key: "Published", icon: Globe, label: "Published" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Published": return "bg-success text-white";
    case "Approved": return "bg-primary text-white";
    case "Validated": return "bg-cyan-500 text-white";
    case "Submitted": return "bg-warning text-white";
    case "Draft": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical": return "bg-destructive/10 text-destructive border-destructive/20";
    case "Warning": return "bg-warning/10 text-warning border-warning/20";
    case "Info": return "bg-primary/10 text-primary border-primary/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const getQualityColor = (quality: number) => {
  if (quality >= 80) return "text-success";
  if (quality >= 60) return "text-warning";
  return "text-destructive";
};

const getNextAction = (status: string) => {
  switch (status) {
    case "Draft": return { label: "Submit", action: "submit" };
    case "Submitted": return { label: "Validate", action: "validate" };
    case "Validated": return { label: "Approve", action: "approve" };
    case "Approved": return { label: "Publish", action: "publish" };
    default: return null;
  }
};

export default function PFISubmissions() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [errorSearchText, setErrorSearchText] = useState("");
  const [errorLogOpen, setErrorLogOpen] = useState(true);
  const [uploadType, setUploadType] = useState<"excel" | "form">("excel");

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch = sub.pfiName.toLowerCase().includes(searchText.toLowerCase()) ||
        sub.projectId.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter]);

  const filteredErrors = useMemo(() => {
    return errorLog.filter((error) =>
      error.field.toLowerCase().includes(errorSearchText.toLowerCase()) ||
      error.issue.toLowerCase().includes(errorSearchText.toLowerCase()) ||
      error.recordId.toLowerCase().includes(errorSearchText.toLowerCase())
    );
  }, [errorSearchText]);

  const openErrors = errorLog.filter(e => e.status === "Open").length;

  const exportErrorLog = () => {
    const date = new Date().toISOString().split('T')[0];
    const filename = `DBN_PFI_Error_Log_${date}.csv`;
    
    const headers = ["Field", "Issue", "Row/Record ID", "Severity", "Status"];
    const rows = filteredErrors.map(e => [e.field, e.issue, e.recordId, e.severity, e.status]);

    const csvContent = [
      `DBN PFI Error Log Report`,
      `Generated: ${date}`,
      `Total Errors: ${errorLog.length}`,
      `Open Errors: ${openErrors}`,
      ``,
      `Severity Definitions:`,
      `Critical - Must be resolved before submission`,
      `Warning - Should be reviewed and addressed`,
      `Info - Minor issues for awareness`,
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

  const handleAction = (submissionId: string, action: string) => {
    alert(`Action "${action}" triggered for submission ${submissionId}. In production, this would update the status.`);
  };

  const handleUpload = (type: "excel" | "form") => {
    alert(`${type === "excel" ? "Excel" : "Form"} upload triggered. File picker would open here.`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">PFI Submissions</h1>
            <p className="text-muted-foreground mt-1">
              Manage Project/Facility Information submissions and data validation
            </p>
          </div>
        </div>

        {/* Workflow Steps Display */}
        <div className="dashboard-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Submission Workflow</h3>
          <div className="flex items-center justify-between">
            {workflowSteps.map((step, idx) => (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    "bg-primary/10 text-primary"
                  )}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-2 font-medium">{step.label}</span>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <div className="w-12 sm:w-24 h-0.5 bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Import & Upload Section */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Import & Upload Files</h3>
          
          {/* Upload Type Toggle */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setUploadType("excel")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                uploadType === "excel" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
            >
              <FileSpreadsheet className={cn("w-5 h-5", uploadType === "excel" ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("font-medium", uploadType === "excel" ? "text-foreground" : "text-muted-foreground")}>Excel</span>
            </button>
            <button
              onClick={() => setUploadType("form")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                uploadType === "form" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
            >
              <FileText className={cn("w-5 h-5", uploadType === "form" ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("font-medium", uploadType === "form" ? "text-foreground" : "text-muted-foreground")}>Forms</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleUpload(uploadType)} className="gap-2">
              <Upload className="w-4 h-4" />
              {uploadType === "excel" ? "Import Excel" : "Upload Form"}
            </Button>
            {uploadType === "excel" && (
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download Template
              </Button>
            )}
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Uploaded Files</h4>
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {file.type === "Excel" ? (
                      <FileSpreadsheet className="w-5 h-5 text-success" />
                    ) : (
                      <FileText className="w-5 h-5 text-destructive" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.date} • {file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      file.type === "Excel" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>
                      {file.type}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by PFI Name or Project ID..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "Draft", "Submitted", "Validated", "Approved", "Published"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status === "all" ? "All" : status}
              </Button>
            ))}
          </div>
        </div>

        {/* Submissions Table */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Submissions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground sticky left-0 bg-card">PFI Name</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Project ID</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Submission Date</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Data Quality</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Errors</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Validator</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Last Updated</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground sticky right-0 bg-card">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => {
                  const nextAction = getNextAction(sub.status);
                  return (
                    <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-medium sticky left-0 bg-card">{sub.pfiName}</td>
                      <td className="py-3 text-sm font-mono">{sub.projectId}</td>
                      <td className="py-3 text-sm">{sub.submissionDate}</td>
                      <td className="py-3 text-center">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          getStatusColor(sub.status)
                        )}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                sub.dataQualityScore >= 80 ? "bg-success" : 
                                sub.dataQualityScore >= 60 ? "bg-warning" : "bg-destructive"
                              )}
                              style={{ width: `${sub.dataQualityScore}%` }}
                            />
                          </div>
                          <span className={cn("text-sm font-medium", getQualityColor(sub.dataQualityScore))}>
                            {sub.dataQualityScore}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <button className={cn(
                          "px-2 py-1 rounded text-xs font-medium cursor-pointer hover:underline",
                          sub.errorCount === 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                        )}>
                          {sub.errorCount}
                        </button>
                      </td>
                      <td className="py-3 text-sm">{sub.validator}</td>
                      <td className="py-3 text-sm text-muted-foreground">{sub.lastUpdated}</td>
                      <td className="py-3 sticky right-0 bg-card">
                        <div className="flex items-center justify-center gap-1">
                          {nextAction && (
                            <Button 
                              size="sm" 
                              className="gap-1"
                              onClick={() => handleAction(sub.id, nextAction.action)}
                            >
                              {nextAction.label}
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="w-4 h-4" />
                            View Errors
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error Log Section (Collapsible) */}
        <Collapsible open={errorLogOpen} onOpenChange={setErrorLogOpen}>
          <div className="dashboard-card">
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Error Log
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                    {openErrors} open
                  </span>
                </h3>
                <ChevronDown className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  errorLogOpen && "rotate-180"
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by field, issue, or row ID..."
                      value={errorSearchText}
                      onChange={(e) => setErrorSearchText(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={exportErrorLog} variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export Error Log
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Field</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Issue</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Row/Record ID</th>
                        <th className="text-center py-3 text-sm font-medium text-muted-foreground">Severity</th>
                        <th className="text-center py-3 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredErrors.map((error) => (
                        <tr key={error.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 font-medium">{error.field}</td>
                          <td className="py-3 text-sm">{error.issue}</td>
                          <td className="py-3 text-sm font-mono">{error.recordId}</td>
                          <td className="py-3 text-center">
                            <span className={cn(
                              "px-2 py-1 rounded text-xs font-medium border",
                              getSeverityColor(error.severity)
                            )}>
                              {error.severity}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={cn(
                              "px-2 py-1 rounded text-xs font-medium",
                              error.status === "Resolved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                            )}>
                              {error.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </DashboardLayout>
  );
}
