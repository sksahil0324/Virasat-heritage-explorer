import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { BarChart3, Eye, Globe, Headphones, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const sites = useQuery(api.heritageSites.listAll);
  const stats = useQuery(api.heritageSites.getStats);
  const createSite = useMutation(api.heritageSites.create);
  const deleteSite = useMutation(api.heritageSites.remove);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    historicalSignificance: string;
    category: "temple" | "fort" | "palace" | "monument" | "museum" | "archaeological" | "natural" | "other";
    state: string;
    city: string;
    latitude: number | undefined;
    longitude: number | undefined;
    isUNESCO: boolean;
    timePeriod: string;
    visitorGuidelines: string;
    isPublished: boolean;
  }>({
    name: "",
    description: "",
    historicalSignificance: "",
    category: "monument",
    state: "",
    city: "",
    latitude: undefined,
    longitude: undefined,
    isUNESCO: false,
    timePeriod: "",
    visitorGuidelines: "",
    isPublished: false,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const handleCreateSite = async () => {
    try {
      await createSite(formData);
      toast.success("Heritage site created successfully");
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        historicalSignificance: "",
        category: "monument",
        state: "",
        city: "",
        latitude: undefined,
        longitude: undefined,
        isUNESCO: false,
        timePeriod: "",
        visitorGuidelines: "",
        isPublished: false,
      });
    } catch (error) {
      toast.error("Failed to create site");
    }
  };

  const handleDeleteSite = async (id: Id<"heritageSites">) => {
    if (!confirm("Are you sure you want to delete this site?")) return;

    try {
      await deleteSite({ id });
      toast.success("Site deleted successfully");
    } catch (error) {
      toast.error("Failed to delete site");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src="/logo.svg" alt="VIRASAT" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">VIRASAT Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/explore")}>
                View Site
              </Button>
              <Button variant="ghost" onClick={() => navigate("/")}>
                Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
              <p className="text-lg text-muted-foreground">Manage heritage sites and content</p>
            </div>
            <Button size="lg" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Site
            </Button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSites}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.publishedSites} published
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <p className="text-xs text-muted-foreground">Across all sites</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Audio Plays</CardTitle>
                  <Headphones className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAudioPlays}</div>
                  <p className="text-xs text-muted-foreground">Total listens</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">UNESCO Sites</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.unescoSites}</div>
                  <p className="text-xs text-muted-foreground">World Heritage</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sites List */}
          <Card>
            <CardHeader>
              <CardTitle>All Heritage Sites</CardTitle>
              <CardDescription>Manage your heritage site collection</CardDescription>
            </CardHeader>
            <CardContent>
              {sites === undefined ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : sites.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No sites yet. Create your first one!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sites.map((site) => (
                    <div
                      key={site._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{site.name}</h3>
                          <Badge variant="secondary" className="capitalize">
                            {site.category}
                          </Badge>
                          {site.isUNESCO && <Badge>UNESCO</Badge>}
                          {!site.isPublished && <Badge variant="outline">Draft</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {site.city}, {site.state} • {site.viewCount} views
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/site/${site._id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSite(site._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Create Site Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Heritage Site</DialogTitle>
            <DialogDescription>Create a new heritage site entry</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Taj Mahal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: "temple" | "fort" | "palace" | "monument" | "museum" | "archaeological" | "natural" | "other") => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temple">Temple</SelectItem>
                    <SelectItem value="fort">Fort</SelectItem>
                    <SelectItem value="palace">Palace</SelectItem>
                    <SelectItem value="monument">Monument</SelectItem>
                    <SelectItem value="museum">Museum</SelectItem>
                    <SelectItem value="archaeological">Archaeological</SelectItem>
                    <SelectItem value="natural">Natural</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timePeriod">Time Period</Label>
                <Input
                  id="timePeriod"
                  value={formData.timePeriod}
                  onChange={(e) => setFormData({ ...formData, timePeriod: e.target.value })}
                  placeholder="17th Century"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Uttar Pradesh"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Agra"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the site..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="historicalSignificance">Historical Significance *</Label>
              <Textarea
                id="historicalSignificance"
                value={formData.historicalSignificance}
                onChange={(e) =>
                  setFormData({ ...formData, historicalSignificance: e.target.value })
                }
                placeholder="Historical context and importance..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitorGuidelines">Visitor Guidelines</Label>
              <Textarea
                id="visitorGuidelines"
                value={formData.visitorGuidelines}
                onChange={(e) =>
                  setFormData({ ...formData, visitorGuidelines: e.target.value })
                }
                placeholder="Guidelines for visitors..."
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="unesco"
                  checked={formData.isUNESCO}
                  onCheckedChange={(checked) => setFormData({ ...formData, isUNESCO: checked })}
                />
                <Label htmlFor="unesco">UNESCO World Heritage Site</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPublished: checked })
                  }
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSite}
              disabled={
                !formData.name ||
                !formData.description ||
                !formData.historicalSignificance ||
                !formData.state ||
                !formData.city
              }
            >
              Create Site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
