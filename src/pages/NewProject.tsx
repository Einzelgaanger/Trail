"use client";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Upload, 
  X, 
  FileText,
  Image as ImageIcon,
  Calendar,
  DollarSign,
  Building2,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ProjectData {
  // Step 1: Basic Info
  name: string;
  projectId: string;
  sector: string;
  location: string;
  description: string;
  // Step 2: Financial
  amount: string;
  currency: string;
  startDate: string;
  endDate: string;
  fundingSource: string;
  // Step 3: ESG Info
  taxonomyStatus: string;
  esgGoals: string[];
  sdgTargets: string[];
  // Step 4: Documents
  coverImage: File | null;
  documents: File[];
  projectManager: string;
  tags: string[];
}

const steps = [
  { id: 1, title: "Basic Information", icon: Building2 },
  { id: 2, title: "Financial Details", icon: DollarSign },
  { id: 3, title: "ESG & Goals", icon: Target },
  { id: 4, title: "Documents", icon: FileText },
];

const sectors = [
  "Renewable Energy",
  "Agriculture",
  "Real Estate",
  "Water & Sanitation",
  "Manufacturing",
  "Healthcare",
  "Education",
  "Transportation",
  "Financial Services",
];

const nigerianStates = [
  "Lagos", "Abuja", "Kano", "Rivers", "Ogun", "Kaduna", "Enugu", "Oyo", "Delta", "Anambra"
];

export default function NewProject() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectData>({
    name: "",
    projectId: `DBN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
    sector: "",
    location: "",
    description: "",
    amount: "",
    currency: "NGN",
    startDate: "",
    endDate: "",
    fundingSource: "",
    taxonomyStatus: "",
    esgGoals: [],
    sdgTargets: [],
    coverImage: null,
    documents: [],
    projectManager: "",
    tags: [],
  });

  const handleCoverImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/svg+xml", "image/png", "image/jpeg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast({ title: "Invalid file type", description: "Please upload SVG, PNG, JPG, or GIF", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Max size is 5MB", variant: "destructive" });
        return;
      }
      setFormData({ ...formData, coverImage: file });
    }
  }, [formData, toast]);

  const handleDocumentUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    
    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast({ title: "Invalid file type", description: `${file.name} is not a valid document`, variant: "destructive" });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} exceeds 5MB limit`, variant: "destructive" });
        return false;
      }
      return true;
    });

    setFormData({ ...formData, documents: [...formData.documents, ...validFiles] });
  }, [formData, toast]);

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    console.log("Project submitted:", formData);
    toast({ title: "Project Created", description: "Your project has been created successfully." });
    navigate("/programme");
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.sector && formData.location;
      case 2:
        return formData.amount && formData.startDate;
      case 3:
        return formData.taxonomyStatus;
      case 4:
        return true;
      default:
        return true;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="view-title">Create New Project</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details to create a new project/programme
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all",
                    currentStep > step.id
                      ? "bg-success text-white"
                      : currentStep === step.id
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-2 font-medium",
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-16 lg:w-24 h-1 mx-2 rounded",
                  currentStep > step.id ? "bg-success" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="dashboard-card">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectId">Project ID</Label>
                  <Input
                    id="projectId"
                    value={formData.projectId}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sector *</Label>
                  <Select value={formData.sector} onValueChange={(v) => setFormData({ ...formData, sector: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Select value={formData.location} onValueChange={(v) => setFormData({ ...formData, location: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 2: Financial Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Financial Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Project Amount *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="Enter amount"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN (₦)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fundingSource">Funding Source</Label>
                  <Input
                    id="fundingSource"
                    value={formData.fundingSource}
                    onChange={(e) => setFormData({ ...formData, fundingSource: e.target.value })}
                    placeholder="Enter funding source"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: ESG & Goals */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">ESG & Goals</h2>
              
              <div className="space-y-2">
                <Label>Green Taxonomy Status *</Label>
                <Select value={formData.taxonomyStatus} onValueChange={(v) => setFormData({ ...formData, taxonomyStatus: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select taxonomy status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Green">Green</SelectItem>
                    <SelectItem value="Transition">Transition</SelectItem>
                    <SelectItem value="Not Green">Not Green</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>SDG Targets</Label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 17 }, (_, i) => i + 1).map((sdg) => (
                    <button
                      key={sdg}
                      type="button"
                      onClick={() => {
                        const targets = formData.sdgTargets.includes(`SDG ${sdg}`)
                          ? formData.sdgTargets.filter((t) => t !== `SDG ${sdg}`)
                          : [...formData.sdgTargets, `SDG ${sdg}`];
                        setFormData({ ...formData, sdgTargets: targets });
                      }}
                      className={cn(
                        "w-10 h-10 rounded-lg font-medium text-sm transition-all",
                        formData.sdgTargets.includes(`SDG ${sdg}`)
                          ? "bg-primary text-white"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {sdg}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Click to select relevant SDG targets</p>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Documents & Additional Info</h2>
              
              {/* Cover Image Upload */}
              <div className="space-y-2">
                <Label>Project Cover Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  {formData.coverImage ? (
                    <div className="flex items-center justify-center gap-4">
                      <ImageIcon className="w-8 h-8 text-success" />
                      <div className="text-left">
                        <p className="font-medium">{formData.coverImage.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(formData.coverImage.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setFormData({ ...formData, coverImage: null })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-xs text-muted-foreground">SVG, PNG, JPG, GIF (max 5MB)</p>
                      <input
                        type="file"
                        accept=".svg,.png,.jpg,.jpeg,.gif"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <Label>Project Documents</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <label className="cursor-pointer">
                    <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Upload project documents
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (max 5MB each)</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {formData.documents.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(doc.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDocument(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectManager">Project Manager</Label>
                <Input
                  id="projectManager"
                  value={formData.projectManager}
                  onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
                  placeholder="Enter project manager name"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? () => navigate("/programme") : prevStep}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid()}
              className="gap-2 bg-primary"
            >
              {currentStep === 4 ? "Create Project" : "Continue"}
              {currentStep < 4 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
