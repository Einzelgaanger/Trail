"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Download, 
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Mail,
  Leaf,
  Flame,
  BarChart3,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const reportTypes = [
  { id: "esg", name: "ESG Performance Report", icon: <BarChart3 className="w-5 h-5" />, description: "Comprehensive ESG metrics and performance analysis" },
  { id: "portfolio", name: "Portfolio Overview Report", icon: <FileText className="w-5 h-5" />, description: "Summary of all projects and investments" },
  { id: "taxonomy", name: "Green Taxonomy Report", icon: <Leaf className="w-5 h-5" />, description: "Green classification and alignment analysis" },
  { id: "carbon", name: "Carbon Emissions Report", icon: <Flame className="w-5 h-5" />, description: "Carbon footprint and reduction progress" },
  { id: "compliance", name: "Compliance Report", icon: <Shield className="w-5 h-5" />, description: "Regulatory compliance status and gaps" },
];

const generatedReports = [
  { id: "1", name: "Q4 2024 ESG Performance Report", type: "ESG Performance", date: "2025-01-15", generatedBy: "Admin User", status: "Ready" },
  { id: "2", name: "Annual Portfolio Overview 2024", type: "Portfolio Overview", date: "2025-01-10", generatedBy: "Admin User", status: "Ready" },
  { id: "3", name: "Green Taxonomy Assessment Report", type: "Green Taxonomy", date: "2025-01-08", generatedBy: "John Doe", status: "Ready" },
  { id: "4", name: "Carbon Emissions Q4 2024", type: "Carbon Emissions", date: "2025-01-05", generatedBy: "Jane Smith", status: "Generating" },
  { id: "5", name: "Compliance Audit Report", type: "Compliance", date: "2024-12-20", generatedBy: "Admin User", status: "Ready" },
];

const scheduledReports = [
  { name: "Monthly ESG Summary", type: "ESG Performance", frequency: "Monthly", nextRun: "2025-02-01", recipients: 3 },
  { name: "Weekly Portfolio Update", type: "Portfolio Overview", frequency: "Weekly", nextRun: "2025-01-20", recipients: 5 },
  { name: "Quarterly Carbon Report", type: "Carbon Emissions", frequency: "Quarterly", nextRun: "2025-04-01", recipients: 2 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ready": return "bg-success/10 text-success border-success/20";
    case "Generating": return "bg-primary/10 text-primary border-primary/20";
    case "Failed": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export default function Reports() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Generate, view, and export various ESG reports
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Generate New Report
          </Button>
        </div>

        {/* Report Types */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Report Types</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all hover:shadow-md",
                  selectedType === type.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                  selectedType === type.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}>
                  {type.icon}
                </div>
                <h4 className="font-medium text-sm">{type.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
              </button>
            ))}
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
              <Button variant="outline" size="sm">View All</Button>
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
            <Button variant="outline" className="w-full mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Schedule Report
            </Button>
          </div>
        </div>

        {/* Export Options */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Export Options</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Export as PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Export as Excel
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Export as Word
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              Email Report
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
