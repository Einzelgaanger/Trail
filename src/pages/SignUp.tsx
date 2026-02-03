"use client";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Mail, Lock, Building2, User, Eye, EyeOff, Phone, MapPin, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormData {
  accountType: "organisation" | "personal";
  // Step 1
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2
  firstName: string;
  lastName: string;
  phone: string;
  // Step 3 (Organisation only)
  orgName: string;
  orgAddress: string;
  orgSector: string;
  orgSize: string;
}

const steps = [
  { id: 1, title: "Account", description: "Email & Password" },
  { id: 2, title: "Profile", description: "Personal Details" },
  { id: 3, title: "Organisation", description: "Company Info" },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    accountType: "organisation",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    orgName: "",
    orgAddress: "",
    orgSector: "",
    orgSize: "",
  });

  const maxSteps = formData.accountType === "organisation" ? 3 : 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up submitted:", formData);
    navigate("/dashboard");
  };

  const nextStep = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return (
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword &&
        formData.password.length >= 8
      );
    }
    if (currentStep === 2) {
      return formData.firstName && formData.lastName;
    }
    if (currentStep === 3) {
      return formData.orgName;
    }
    return true;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <TrendingUp className="w-7 h-7" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Trail</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Join Trail ESG<br />Platform Today
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Create your account and start tracking environmental, social, and governance metrics with precision.
          </p>

          {/* Progress Steps */}
          <div className="mt-12 space-y-4">
            {steps.slice(0, maxSteps).map((step, index) => (
              <div 
                key={step.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all",
                  currentStep === step.id ? "bg-white/20 backdrop-blur" : "bg-white/5",
                  currentStep > step.id && "bg-white/10"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                  currentStep > step.id ? "bg-white text-primary" : 
                  currentStep === step.id ? "bg-white/30 text-white" : "bg-white/10 text-white/50"
                )}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-white/60">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 bg-background">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">Trail</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground">Step {currentStep} of {maxSteps}</p>
          </div>

          {/* Account Type Toggle (Step 1) */}
          {currentStep === 1 && (
            <div className="flex gap-3 mb-8">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "organisation" })}
                className={cn(
                  "flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                  formData.accountType === "organisation"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  formData.accountType === "organisation" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className={cn("font-medium", formData.accountType === "organisation" ? "text-foreground" : "text-muted-foreground")}>
                    Organisation
                  </div>
                  <div className="text-xs text-muted-foreground">For teams</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "personal" })}
                className={cn(
                  "flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                  formData.accountType === "personal"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  formData.accountType === "personal" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}>
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className={cn("font-medium", formData.accountType === "personal" ? "text-foreground" : "text-muted-foreground")}>
                    Personal
                  </div>
                  <div className="text-xs text-muted-foreground">Individual use</div>
                </div>
              </button>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-5">
            {/* Step 1: Email & Password */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (min. 8 characters)"
                      className="pl-10 pr-10 h-12"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10 h-12"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-destructive">Passwords do not match</p>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Personal Details */}
            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="First name"
                        className="pl-10 h-12"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      className="h-12"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      className="pl-10 h-12"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Organisation Details */}
            {currentStep === 3 && formData.accountType === "organisation" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organisation Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="orgName"
                      placeholder="Enter organisation name"
                      className="pl-10 h-12"
                      value={formData.orgName}
                      onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orgAddress">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="orgAddress"
                      placeholder="Enter address"
                      className="pl-10 h-12"
                      value={formData.orgAddress}
                      onChange={(e) => setFormData({ ...formData, orgAddress: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgSector">Sector</Label>
                    <Input
                      id="orgSector"
                      placeholder="e.g., Finance"
                      className="h-12"
                      value={formData.orgSector}
                      onChange={(e) => setFormData({ ...formData, orgSector: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgSize">Company Size</Label>
                    <Input
                      id="orgSize"
                      placeholder="e.g., 50-100"
                      className="h-12"
                      value={formData.orgSize}
                      onChange={(e) => setFormData({ ...formData, orgSize: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 h-12 gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 h-12 gap-2 bg-primary hover:bg-primary/90"
                disabled={!isStepValid()}
              >
                {currentStep === maxSteps ? "Create Account" : "Continue"}
                {currentStep < maxSteps && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
