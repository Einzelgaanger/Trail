"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Mail, Lock, Building2, User, Eye, EyeOff, CheckCircle, Shield, BarChart3, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import esgHeroImage from "@/assets/esg-solar-panels.jpg";
// Hardcoded credentials
const VALID_CREDENTIALS = {
  organisation: { email: "admin@trail.com", password: "admin123" },
  personal: { email: "user@trail.com", password: "user123" },
};

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOrgAccount, setIsOrgAccount] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const credentials = isOrgAccount ? VALID_CREDENTIALS.organisation : VALID_CREDENTIALS.personal;
    
    setTimeout(() => {
      if (formData.email === credentials.email && formData.password === credentials.password) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to Trail ESG Platform",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Invalid credentials",
          description: `Try: ${credentials.email} / ${credentials.password}`,
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const features = [
    { icon: <BarChart3 className="w-5 h-5" />, title: "ESG Analytics", desc: "Real-time insights and reporting" },
    { icon: <Leaf className="w-5 h-5" />, title: "Green Taxonomy", desc: "Classify and track green investments" },
    { icon: <Shield className="w-5 h-5" />, title: "Compliance", desc: "Meet regulatory requirements" },
    { icon: <CheckCircle className="w-5 h-5" />, title: "Data Quality", desc: "Validated and accurate data" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding with Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <img 
          src={esgHeroImage} 
          alt="ESG Analytics Dashboard" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/70" />
        
        {/* Decorative Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Trail</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            ESG Integrated<br />Monitoring Solution
          </h1>
          <p className="text-lg text-white/80 max-w-md mb-10">
            Track environmental, social, and governance metrics with precision. 
            Drive sustainable impact and meet your green taxonomy goals.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-10 flex gap-8">
            <div>
              <div className="text-3xl font-bold">42</div>
              <div className="text-sm text-white/70">Active Projects</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-3xl font-bold">87%</div>
              <div className="text-sm text-white/70">ESG Compliance</div>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <div className="text-3xl font-bold">₦12.5B</div>
              <div className="text-sm text-white/70">Portfolio Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to access your dashboard</p>
          </div>

          {/* Account Type Toggle */}
          <div className="flex gap-3 mb-8">
            <button
              type="button"
              onClick={() => setIsOrgAccount(true)}
              className={cn(
                "flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                isOrgAccount 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isOrgAccount ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className={cn("font-medium", isOrgAccount ? "text-foreground" : "text-muted-foreground")}>
                  Organisation
                </div>
                <div className="text-xs text-muted-foreground">For teams</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setIsOrgAccount(false)}
              className={cn(
                "flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                !isOrgAccount 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                !isOrgAccount ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className={cn("font-medium", !isOrgAccount ? "text-foreground" : "text-muted-foreground")}>
                  Personal
                </div>
                <div className="text-xs text-muted-foreground">Individual use</div>
              </div>
            </button>
          </div>

          {/* Demo Credentials Hint */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Demo credentials:</strong><br />
              {isOrgAccount ? (
                <>Email: admin@trail.com | Password: admin123</>
              ) : (
                <>Email: user@trail.com | Password: user123</>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12 border-border"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12 border-border"
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

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Development Bank of Nigeria ESG Platform
            </p>
            <p className="text-center text-xs text-muted-foreground mt-1">
              © 2024 Trail. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
