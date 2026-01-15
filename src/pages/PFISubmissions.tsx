"use client";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Upload,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

const submissions = [
  { id: "1", pfiName: "Lagos Solar Farm", projectId: "DBN-2024-001", date: "2025-01-15", status: "Published", quality: 95, errors: 0, validator: "Admin User" },
  { id: "2", pfiName: "Kano Agri Hub", projectId: "DBN-2024-002", date: "2025-01-12", status: "Approved", quality: 88, errors: 2, validator: "John Doe" },
  { id: "3", pfiName: "Abuja Green Building", projectId: "DBN-2024-003", date: "2025-01-10", status: "Validated", quality: 92, errors: 1, validator: "Jane Smith" },
  { id: "4", pfiName: "Rivers Water Treatment", projectId: "DBN-2024-004", date: "2025-01-08", status: "Submitted", quality: 75, errors: 5, validator: "-" },
  { id: "5", pfiName: "Ogun Manufacturing", projectId: "DBN-2023-018", date: "2025-01-05", status: "Draft", quality: 45, errors: 12, validator: "-" },
];

const errorLog = [
  { id: "1", field: "Carbon Emissions", issue: "Missing Scope 3 data", record: "Q4-2024", severity: "Critical", status: "Open", action: "Contact project manager for data" },
  { id: "2", field: "ESG Score", issue: "Value out of range (>100)", record: "Q3-2024", severity: "Warning", status: "Open", action: "Verify calculation methodology" },
  { id: "3", field: "Project Budget", issue: "Currency mismatch", record: "Annual", severity: "Warning", status: "Resolved", action: "Standardize to NGN" },
  { id: "4", field: "Location Data", issue: "Invalid coordinates", record: "Initial", severity: "Info", status: "Open", action: "Verify GPS coordinates" },
];

const uploadedFiles = [
  { name: "PFI_Q4_2024_Template.xlsx", type: "Excel", date: "2025-01-15", size: "2.4 MB" },
  { name: "ESG_Data_Export.xlsx", type: "Excel", date: "2025-01-12", size: "1.8 MB" },
  { name: "Carbon_Report_2024.xlsx", type: "Excel", date: "2025-01-10", size: "3.2 MB" },
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

export default function PFISubmissions() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch = sub.pfiName.toLowerCase().includes(searchText.toLowerCase()) ||
        sub.projectId.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">PFI Submissions</h1>
            <p className="text-muted-foreground mt-1">
              Manage Project/Facility Information submissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download Template
            </Button>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Upload PFI Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="submissions" className="rounded-lg gap-2 data-[state=active]:bg-background">
              <FileText className="w-4 h-4" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="upload" className="rounded-lg gap-2 data-[state=active]:bg-background">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="errors" className="rounded-lg gap-2 data-[state=active]:bg-background">
              <AlertTriangle className="w-4 h-4" />
              Error Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by PFI name or project ID..."
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">PFI Name</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Project ID</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-center py-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-center py-3 text-sm font-medium text-muted-foreground">Quality</th>
                      <th className="text-center py-3 text-sm font-medium text-muted-foreground">Errors</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Validator</th>
                      <th className="text-center py-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-medium">{sub.pfiName}</td>
                        <td className="py-3 text-sm font-mono">{sub.projectId}</td>
                        <td className="py-3 text-sm">{sub.date}</td>
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
                                  sub.quality >= 80 ? "bg-success" : 
                                  sub.quality >= 60 ? "bg-warning" : "bg-destructive"
                                )}
                                style={{ width: `${sub.quality}%` }}
                              />
                            </div>
                            <span className={cn("text-sm font-medium", getQualityColor(sub.quality))}>
                              {sub.quality}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            sub.errors === 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                          )}>
                            {sub.errors}
                          </span>
                        </td>
                        <td className="py-3 text-sm">{sub.validator}</td>
                        <td className="py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Section */}
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold mb-4">Upload PFI Data</h3>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-medium mb-2">Drag and drop your file here</h4>
                <p className="text-sm text-muted-foreground mb-4">Supports Excel files (.xlsx, .xls)</p>
                <Button variant="outline">Browse Files</Button>
              </div>
            </div>

            {/* Uploaded Files */}
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{file.date} • {file.size}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            {/* Error Log */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Error Log
                </h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Errors
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Field</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Issue</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Record</th>
                      <th className="text-center py-3 text-sm font-medium text-muted-foreground">Severity</th>
                      <th className="text-center py-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorLog.map((error) => (
                      <tr key={error.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-medium">{error.field}</td>
                        <td className="py-3 text-sm">{error.issue}</td>
                        <td className="py-3 text-sm">{error.record}</td>
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
                        <td className="py-3 text-sm text-muted-foreground">{error.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
