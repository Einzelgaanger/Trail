"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Building2, 
  Shield, 
  Users, 
  Key,
  Mail,
  Phone,
  Globe,
  Save
} from "lucide-react";

export default function Settings() {
  const [profile, setProfile] = useState({
    firstName: "Garden",
    lastName: "Ventures",
    email: "info@gardenventures.org",
    phone: "+234 803 747 6543",
    organization: "Garden Ventures Ltd",
    organizationType: "Finance",
    website: "www.gardenventures.org",
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="view-title">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and organization settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg gap-2 data-[state=active]:bg-background">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="organization" className="rounded-lg gap-2 data-[state=active]:bg-background">
              <Building2 className="w-4 h-4" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg gap-2 data-[state=active]:bg-background">
              <Users className="w-4 h-4" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg gap-2 data-[state=active]:bg-background">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="dashboard-card">
              <h2 className="text-lg font-semibold mb-6">Personal Information</h2>
              
              {/* Profile Picture */}
              <div className="flex items-center gap-6 pb-6 border-b border-border mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{profile.firstName} {profile.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">Upload Photo</Button>
                    <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <div className="dashboard-card">
              <h2 className="text-lg font-semibold mb-6">Organization Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="orgName" 
                      value={profile.organization}
                      onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Input 
                    id="orgType" 
                    value={profile.organizationType}
                    onChange={(e) => setProfile({ ...profile, organizationType: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="website" 
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Team Members</h2>
                <Button className="gap-2">
                  <Users className="w-4 h-4" />
                  Invite Member
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "John Doe", email: "john@gardenventures.org", role: "Administrator" },
                  { name: "Jane Smith", email: "jane@gardenventures.org", role: "Editor" },
                  { name: "Mike Johnson", email: "mike@gardenventures.org", role: "Viewer" },
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="dashboard-card">
              <h2 className="text-lg font-semibold mb-6">Change Password</h2>
              
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="currentPassword" type="password" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="newPassword" type="password" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="confirmPassword" type="password" className="pl-9" />
                  </div>
                </div>
                <Button className="gap-2">
                  <Shield className="w-4 h-4" />
                  Update Password
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
