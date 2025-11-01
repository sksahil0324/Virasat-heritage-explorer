import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Heart, Loader2, MapPin, Search, Globe, Image as ImageIcon, BookOpen, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import InteractiveMap from "@/components/InteractiveMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubmitStoryDialog from "@/components/SubmitStoryDialog";
import UserStoriesDisplay from "@/components/UserStoriesDisplay";

export default function Explore() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [state, setState] = useState<string>("all");
  const [unescoOnly, setUnescoOnly] = useState(false);

  // Get active section from URL params, default to "explore"
  const activeSection = searchParams.get("section") || "explore";

  const sites = useQuery(api.heritageSites.list, {
    category: category === "all" ? undefined : category,
    state: state === "all" ? undefined : state,
    unescoOnly,
  });

  const searchResults = useQuery(
    api.heritageSites.search,
    searchTerm.length > 2 ? { searchTerm } : "skip"
  );

  const displaySites = searchTerm.length > 2 ? searchResults : sites;

  // Handle navigation section changes
  const handleSectionChange = (section: string) => {
    setSearchParams({ section });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Tagline */}
            <div className="flex flex-col cursor-pointer" onClick={() => navigate("/")}>
              <div className="flex items-center gap-3">
                <img src="./logo_bg.svg" alt="VIRASAT" className="h-10 w-10" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight">VIRASAT</span>
                  <span className="text-xs text-muted-foreground">Where Heritage Meets Technology</span>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="hidden lg:flex items-center gap-1">
              <Button variant="ghost" onClick={() => navigate("/")} className="text-sm">
                Home
              </Button>
              <Button 
                variant={activeSection === "explore" ? "default" : "ghost"} 
                onClick={() => handleSectionChange("explore")} 
                className="text-sm"
              >
                Explore
              </Button>
              <Button 
                variant={activeSection === "map" ? "default" : "ghost"} 
                onClick={() => handleSectionChange("map")} 
                className="text-sm"
              >
                Heritage Map
              </Button>
              <Button 
                variant={activeSection === "360" ? "default" : "ghost"} 
                onClick={() => handleSectionChange("360")} 
                className="text-sm"
              >
                360° Experience
              </Button>
              <Button 
                variant={activeSection === "gallery" ? "default" : "ghost"} 
                onClick={() => handleSectionChange("gallery")} 
                className="text-sm"
              >
                Gallery
              </Button>
              <Button 
                variant={activeSection === "stories" ? "default" : "ghost"} 
                onClick={() => handleSectionChange("stories")} 
                className="text-sm"
              >
                Stories
              </Button>
              <Button 
                variant={activeSection === "community" ? "default" : "ghost"} 
                onClick={() => handleSectionChange("community")} 
                className="text-sm"
              >
                Community
              </Button>
              <Button 
                variant={activeSection === "about" ? "default" : "ghost"} 
                onClick={() => handleSectionChange("about")} 
                className="text-sm"
              >
                About
              </Button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <>
                  <Button variant="ghost" onClick={() => navigate("/favorites")}>
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/admin")} className="border-primary/50">
                    <Globe className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </>
              )}
              {!isAuthenticated && (
                <Button variant="outline" onClick={() => navigate("/admin")} className="border-amber-500/50">
                  <Globe className="h-4 w-4 mr-2" />
                  Admin Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Explore Section */}
        {activeSection === "explore" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl font-bold tracking-tight mb-4">Explore Heritage Sites</h1>
              <p className="text-lg text-muted-foreground">
                Discover India's magnificent cultural treasures
              </p>
            </motion.div>

            <Tabs defaultValue="list" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-6">
                {/* Filters */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8 space-y-4"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, state, or keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
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

                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant={unescoOnly ? "default" : "outline"}
                      onClick={() => setUnescoOnly(!unescoOnly)}
                    >
                      UNESCO Sites Only
                    </Button>
                  </div>
                </motion.div>

                {/* Sites Grid */}
                {displaySites === undefined ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : displaySites.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No heritage sites found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displaySites.map((site, index) => (
                      <motion.div
                        key={site._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ 
                          scale: 1.03, 
                          y: -5,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }}
                      >
                        <Card
                          className="h-full cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all duration-300 ease-out hover:shadow-lg"
                          onClick={() => navigate(`/site/${site._id}`)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="secondary" className="capitalize">
                                {site.category}
                              </Badge>
                              {site.isUNESCO && (
                                <Badge variant="default">UNESCO</Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl">{site.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {site.city}, {site.state}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {site.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="map">
                <InteractiveMap />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Heritage Map Section */}
        {activeSection === "map" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <Globe className="h-10 w-10 text-primary" />
                Heritage Map
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore heritage sites across India on an interactive map
              </p>
            </motion.div>
            <InteractiveMap />
          </>
        )}

        {/* 360° Experience Section */}
        {activeSection === "360" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <Globe className="h-10 w-10 text-primary" />
                360° Experience
              </h1>
              <p className="text-lg text-muted-foreground">
                Immerse yourself in virtual tours of heritage sites
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites?.filter(site => site.view360Url).map((site, index) => (
                <motion.div
                  key={site._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -5,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <Card
                    className="h-full cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all duration-300 ease-out hover:shadow-lg"
                    onClick={() => navigate(`/site/${site._id}`)}
                  >
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2">360° Available</Badge>
                      <CardTitle className="text-xl">{site.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {site.city}, {site.state}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        Experience this heritage site in immersive 360° view
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Gallery Section */}
        {activeSection === "gallery" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <ImageIcon className="h-10 w-10 text-primary" />
                Heritage Gallery
              </h1>
              <p className="text-lg text-muted-foreground">
                Browse stunning images of India's cultural treasures
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites?.map((site, index) => {
                // Prioritize uploaded images (with storageId) over Unsplash images
                const uploadedImages = site.media?.filter((m: any) => m.type === "image" && m.storageId);
                const primaryImage = uploadedImages?.find((m: any) => m.isPrimary) || 
                                    uploadedImages?.[0] || 
                                    site.media?.find((m: any) => m.isPrimary && m.type === "image") || 
                                    site.media?.find((m: any) => m.type === "image");
                return (
                  <motion.div
                    key={site._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.03, 
                      y: -5,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <Card
                      className="h-full cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all duration-300 ease-out hover:shadow-lg overflow-hidden"
                      onClick={() => navigate(`/site/${site._id}`)}
                    >
                      {primaryImage ? (
                        <img
                          src={primaryImage.url}
                          alt={site.name}
                          className="w-full aspect-video object-cover transition-all duration-300 ease-out hover:scale-105"
                          onError={(e) => {
                            console.error(`Failed to load image for ${site.name}:`, primaryImage.url);
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="aspect-video bg-muted flex items-center justify-center transition-all duration-300 ease-out hover:bg-muted/80"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>`;
                            }
                          }}
                        />
                      ) : (
                        <div className="aspect-video bg-muted flex items-center justify-center transition-all duration-300 ease-out hover:bg-muted/80">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg">{site.name}</CardTitle>
                        <CardDescription>{site.city}, {site.state}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Stories Section */}
        {activeSection === "stories" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <BookOpen className="h-10 w-10 text-primary" />
                Heritage Stories
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover the tales and legends behind India's heritage
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sites?.filter(site => site.folkTales || site.stories).map((site, index) => (
                <motion.div
                  key={site._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <Card
                    className="border-2 border-transparent hover:border-primary/50 transition-all duration-300 ease-out hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{site.category}</Badge>
                          {site.isUNESCO && <Badge>UNESCO</Badge>}
                        </div>
                        {isAuthenticated && (
                          <SubmitStoryDialog siteId={site._id} siteName={site.name} type="story" />
                        )}
                      </div>
                      <CardTitle className="text-xl cursor-pointer hover:text-primary" onClick={() => navigate(`/site/${site._id}`)}>{site.name}</CardTitle>
                      <CardDescription>{site.city}, {site.state}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {site.folkTales || site.stories}
                      </p>
                      <UserStoriesDisplay siteId={site._id} type="story" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Community Section */}
        {activeSection === "community" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <Users className="h-10 w-10 text-primary" />
                Heritage Community
              </h1>
              <p className="text-lg text-muted-foreground">
                Learn about the communities preserving India's heritage
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sites?.filter(site => site.community).map((site, index) => (
                <motion.div
                  key={site._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <Card
                    className="cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all duration-300 ease-out hover:shadow-lg"
                    onClick={() => navigate(`/site/${site._id}`)}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{site.name}</CardTitle>
                      <CardDescription>{site.city}, {site.state}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {site.community}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* About Section */}
        {activeSection === "about" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold tracking-tight mb-8">About VIRASAT</h1>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  VIRASAT is dedicated to preserving and showcasing India's rich cultural heritage through cutting-edge technology. 
                  We believe that heritage should be accessible to everyone, everywhere, and our platform brings India's magnificent 
                  monuments, temples, forts, and cultural sites to life through immersive 3D models, 360° views, and comprehensive 
                  historical information.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>What We Offer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Interactive Exploration</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore heritage sites through interactive maps, detailed descriptions, and rich media content.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Immersive Experiences</h3>
                  <p className="text-sm text-muted-foreground">
                    Experience sites in 360° panoramic views and 3D models, bringing you closer to India's heritage.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cultural Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn about folk tales, cultural heritage, local cuisine, and the communities that preserve these treasures.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Visitor Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Get practical information including ticket prices, opening hours, best times to visit, and local time zones.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Join Our Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Whether you're a heritage enthusiast, researcher, student, or traveler, VIRASAT provides you with the tools 
                  and information to explore, learn, and appreciate India's incredible cultural legacy.
                </p>
                <Button onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}