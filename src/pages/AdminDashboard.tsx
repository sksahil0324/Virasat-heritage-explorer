import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { BarChart3, Eye, Globe, Headphones, Loader2, Plus, Trash2, Edit, Upload, Music } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type SiteFormData = {
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
  ticketPrice: string;
  openingHours: string;
  bestTimeToVisit: string;
  timezone: string;
  view360Url: string;
  view3dUrl: string;
  folkTales: string;
  culturalHeritage: string;
  cuisine: string;
  stories: string;
  community: string;
};

export default function AdminDashboard() {
  const { isLoading: authLoading, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSiteId, setEditingSiteId] = useState<Id<"heritageSites"> | null>(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Only fetch data if user is authenticated and is an admin
  const isAdmin = user?.role === "admin";
  const sites = useQuery(api.heritageSites.listAll, isAdmin ? {} : "skip");
  const stats = useQuery(api.heritageSites.getStats, isAdmin ? {} : "skip");
  const editingSite = useQuery(
    api.heritageSites.getById,
    editingSiteId && isAdmin ? { id: editingSiteId } : "skip"
  );
  
  const createSite = useMutation(api.heritageSites.create);
  const updateSite = useMutation(api.heritageSites.update);
  const deleteSite = useMutation(api.heritageSites.remove);
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const addMedia = useMutation(api.media.add);
  const generateAudioUploadUrl = useMutation(api.audio.generateUploadUrl);
  const addAudio = useMutation(api.audio.add);

  const [formData, setFormData] = useState<SiteFormData>({
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
    ticketPrice: "",
    openingHours: "",
    bestTimeToVisit: "",
    timezone: "",
    view360Url: "",
    view3dUrl: "",
    folkTales: "",
    culturalHeritage: "",
    cuisine: "",
    stories: "",
    community: "",
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page with admin redirect parameter
    window.location.href = "/auth?redirect=/admin";
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              Admin privileges required
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm mb-3">
                You are logged in as: <strong>{user.email || "Guest (No email)"}</strong>
              </p>
              {user.email ? (
                <>
                  <p className="text-sm mb-3">
                    To gain admin access, run this command in your terminal:
                  </p>
                  <code className="block p-3 bg-background rounded text-xs break-all">
                    npx convex run makeAdmin:makeUserAdmin '{"{"}\"email\": \"{user.email}\"{"}"}' 
                  </code>
                  <p className="text-sm mt-3 text-muted-foreground">
                    After running the command, click "Refresh Page" below.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm mb-3 text-amber-600 font-medium">
                    ⚠️ You are signed in as a guest. Guests cannot become admins.
                  </p>
                  <p className="text-sm mb-3">
                    Please sign out and sign in with an email account to gain admin access.
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {!user.email && (
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={async () => {
                    await signOut();
                    window.location.href = "/auth?redirect=/admin";
                  }}
                >
                  Sign Out & Login with Email
                </Button>
              )}
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate("/")}
              >
                Go Home
              </Button>
              {user.email && (
                <Button 
                  className="flex-1"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const resetForm = () => {
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
      ticketPrice: "",
      openingHours: "",
      bestTimeToVisit: "",
      timezone: "",
      view360Url: "",
      view3dUrl: "",
      folkTales: "",
      culturalHeritage: "",
      cuisine: "",
      stories: "",
      community: "",
    });
  };

  const handleCreateSite = async () => {
    try {
      await createSite({
        ...formData,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        timePeriod: formData.timePeriod || undefined,
        visitorGuidelines: formData.visitorGuidelines || undefined,
        ticketPrice: formData.ticketPrice || undefined,
        openingHours: formData.openingHours || undefined,
        bestTimeToVisit: formData.bestTimeToVisit || undefined,
        timezone: formData.timezone || undefined,
        view360Url: formData.view360Url || undefined,
        view3dUrl: formData.view3dUrl || undefined,
        folkTales: formData.folkTales || undefined,
        culturalHeritage: formData.culturalHeritage || undefined,
        cuisine: formData.cuisine || undefined,
        stories: formData.stories || undefined,
        community: formData.community || undefined,
      });
      toast.success("Heritage site created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to create site");
    }
  };

  const handleEditSite = (siteId: Id<"heritageSites">) => {
    setEditingSiteId(siteId);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSite = async () => {
    if (!editingSiteId) return;

    try {
      await updateSite({
        id: editingSiteId,
        ...formData,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        timePeriod: formData.timePeriod || undefined,
        visitorGuidelines: formData.visitorGuidelines || undefined,
        ticketPrice: formData.ticketPrice || undefined,
        openingHours: formData.openingHours || undefined,
        bestTimeToVisit: formData.bestTimeToVisit || undefined,
        timezone: formData.timezone || undefined,
        view360Url: formData.view360Url || undefined,
        view3dUrl: formData.view3dUrl || undefined,
        folkTales: formData.folkTales || undefined,
        culturalHeritage: formData.culturalHeritage || undefined,
        cuisine: formData.cuisine || undefined,
        stories: formData.stories || undefined,
        community: formData.community || undefined,
      });
      toast.success("Site updated successfully");
      setIsEditDialogOpen(false);
      setEditingSiteId(null);
      resetForm();
    } catch (error) {
      toast.error("Failed to update site");
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

  const handleMediaUpload = async (siteId: Id<"heritageSites">, file: File, type: "image" | "video" | "model3d" | "panorama", isPrimary: boolean = false) => {
    try {
      setUploadingMedia(true);
      
      // Validate file size (max 100MB for 3D models)
      const maxSize = type === "model3d" ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      
      toast.info(`Uploading ${file.name}...`);
      
      const uploadUrl = await generateUploadUrl();
      
      // Use appropriate content type for different file types
      let contentType = file.type;
      if (type === "model3d") {
        // For 3D models, use application/octet-stream if no MIME type is detected
        contentType = file.type || "application/octet-stream";
      }
      
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error(`Upload failed with status ${result.status}`);
      }
      
      const { storageId } = await result.json();
      
      await addMedia({
        siteId,
        type,
        storageId,
        isPrimary,
      });
      
      toast.success(`${type === 'model3d' ? '3D Model' : type === 'panorama' ? '360° Panorama' : 'Media'} uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload media: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleAudioUpload = async (siteId: Id<"heritageSites">, file: File, language: string) => {
    try {
      setUploadingAudio(true);
      const uploadUrl = await generateAudioUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      
      await addAudio({
        siteId,
        storageId,
        language,
      });
      
      toast.success("Audio uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload audio");
    } finally {
      setUploadingAudio(false);
    }
  };

  // Populate form when editing
  if (editingSite && isEditDialogOpen && formData.name === "") {
    setFormData({
      name: editingSite.name,
      description: editingSite.description,
      historicalSignificance: editingSite.historicalSignificance,
      category: editingSite.category,
      state: editingSite.state,
      city: editingSite.city,
      latitude: editingSite.latitude,
      longitude: editingSite.longitude,
      isUNESCO: editingSite.isUNESCO,
      timePeriod: editingSite.timePeriod || "",
      visitorGuidelines: editingSite.visitorGuidelines || "",
      isPublished: editingSite.isPublished,
      ticketPrice: editingSite.ticketPrice || "",
      openingHours: editingSite.openingHours || "",
      bestTimeToVisit: editingSite.bestTimeToVisit || "",
      timezone: editingSite.timezone || "",
      view360Url: editingSite.view360Url || "",
      view3dUrl: editingSite.view3dUrl || "",
      folkTales: editingSite.folkTales || "",
      culturalHeritage: editingSite.culturalHeritage || "",
      cuisine: editingSite.cuisine || "",
      stories: editingSite.stories || "",
      community: editingSite.community || "",
    });
  }

  const SiteFormFields = () => (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="visitor">Visitor Info</TabsTrigger>
        <TabsTrigger value="cultural">Cultural</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4 mt-4">
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
              onValueChange={(value: "temple" | "fort" | "palace" | "monument" | "museum" | "archaeological" | "natural" | "other") => 
                setFormData({ ...formData, category: value })
              }
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
            onChange={(e) => setFormData({ ...formData, historicalSignificance: e.target.value })}
            placeholder="Historical context and importance..."
            rows={3}
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
              onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="visitor" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="ticketPrice">Ticket Price</Label>
          <Input
            id="ticketPrice"
            value={formData.ticketPrice}
            onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
            placeholder="₹50 for Indians, ₹1000 for foreigners"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="openingHours">Opening Hours</Label>
          <Input
            id="openingHours"
            value={formData.openingHours}
            onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
            placeholder="6:00 AM - 6:30 PM (Closed on Fridays)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bestTimeToVisit">Best Time to Visit</Label>
          <Input
            id="bestTimeToVisit"
            value={formData.bestTimeToVisit}
            onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
            placeholder="October to March"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            placeholder="Asia/Kolkata"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visitorGuidelines">Visitor Guidelines</Label>
          <Textarea
            id="visitorGuidelines"
            value={formData.visitorGuidelines}
            onChange={(e) => setFormData({ ...formData, visitorGuidelines: e.target.value })}
            placeholder="Guidelines for visitors..."
            rows={3}
          />
        </div>
      </TabsContent>

      <TabsContent value="cultural" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="culturalHeritage">Cultural Heritage</Label>
          <Textarea
            id="culturalHeritage"
            value={formData.culturalHeritage}
            onChange={(e) => setFormData({ ...formData, culturalHeritage: e.target.value })}
            placeholder="Cultural significance and heritage..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="folkTales">Folk Tales</Label>
          <Textarea
            id="folkTales"
            value={formData.folkTales}
            onChange={(e) => setFormData({ ...formData, folkTales: e.target.value })}
            placeholder="Traditional stories and legends..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cuisine">Local Cuisine</Label>
          <Textarea
            id="cuisine"
            value={formData.cuisine}
            onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
            placeholder="Local food and culinary traditions..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stories">Stories</Label>
          <Textarea
            id="stories"
            value={formData.stories}
            onChange={(e) => setFormData({ ...formData, stories: e.target.value })}
            placeholder="Historical stories and anecdotes..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="community">Community</Label>
          <Textarea
            id="community"
            value={formData.community}
            onChange={(e) => setFormData({ ...formData, community: e.target.value })}
            placeholder="Local community and traditions..."
            rows={3}
          />
        </div>
      </TabsContent>

      <TabsContent value="media" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="view360Url">360° View URL</Label>
          <Input
            id="view360Url"
            value={formData.view360Url}
            onChange={(e) => setFormData({ ...formData, view360Url: e.target.value })}
            placeholder="https://example.com/360-view"
          />
          <p className="text-xs text-muted-foreground">
            Embed URL for 360° panoramic view (e.g., from Google Street View, Matterport)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="view3dUrl">3D Model URL</Label>
          <Input
            id="view3dUrl"
            value={formData.view3dUrl}
            onChange={(e) => setFormData({ ...formData, view3dUrl: e.target.value })}
            placeholder="https://example.com/3d-model"
          />
          <p className="text-xs text-muted-foreground">
            Embed URL for 3D model viewer (e.g., Sketchfab)
          </p>
        </div>

        {editingSiteId && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Upload Images/Videos</Label>
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && editingSiteId) {
                    const type = file.type.startsWith("image/") ? "image" : "video";
                    handleMediaUpload(editingSiteId, file, type);
                  }
                }}
                disabled={uploadingMedia}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload 3D Model</Label>
              <Input
                type="file"
                accept=".glb,.gltf,.obj,.fbx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && editingSiteId) {
                    handleMediaUpload(editingSiteId, file, "model3d");
                  }
                }}
                disabled={uploadingMedia}
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: GLB, GLTF, OBJ, FBX
              </p>
            </div>

            <div className="space-y-2">
              <Label>Upload 360° Panorama</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && editingSiteId) {
                    handleMediaUpload(editingSiteId, file, "panorama");
                  }
                }}
                disabled={uploadingMedia}
              />
              <p className="text-xs text-muted-foreground">
                Upload equirectangular panoramic images (360° photos)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Upload Audio Guide</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && editingSiteId) {
                      handleAudioUpload(editingSiteId, file, "English");
                    }
                  }}
                  disabled={uploadingAudio}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );

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
                          onClick={() => handleEditSite(site._id)}
                        >
                          <Edit className="h-4 w-4" />
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
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Heritage Site</DialogTitle>
            <DialogDescription>Create a new heritage site entry with complete information</DialogDescription>
          </DialogHeader>

          <SiteFormFields />

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false);
              resetForm();
            }}>
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

      {/* Edit Site Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingSiteId(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Heritage Site</DialogTitle>
            <DialogDescription>Update site information, media, and audio content</DialogDescription>
          </DialogHeader>

          <SiteFormFields />

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingSiteId(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSite}
              disabled={
                !formData.name ||
                !formData.description ||
                !formData.historicalSignificance ||
                !formData.state ||
                !formData.city
              }
            >
              Update Site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}