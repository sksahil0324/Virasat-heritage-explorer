import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Loader2, MapPin, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function SiteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const site = useQuery(api.heritageSites.getById, id ? { id: id as Id<"heritageSites"> } : "skip");
  const isFavorited = useQuery(
    api.favorites.isFavorited,
    id && isAuthenticated ? { siteId: id as Id<"heritageSites"> } : "skip"
  );

  const incrementView = useMutation(api.heritageSites.incrementViewCount);
  const toggleFavorite = useMutation(api.favorites.toggle);
  const incrementPlayCount = useMutation(api.audio.incrementPlayCount);

  useEffect(() => {
    if (id) {
      incrementView({ id: id as Id<"heritageSites"> });
    }
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save favorites");
      navigate("/auth");
      return;
    }

    try {
      const result = await toggleFavorite({ siteId: id as Id<"heritageSites"> });
      toast.success(result.favorited ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handlePlayAudio = (audioId: Id<"audioSummaries">) => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        incrementPlayCount({ id: audioId });
      }
    }
  };

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const primaryImage = site.media?.find((m) => m.isPrimary && m.type === "image");

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => navigate("/explore")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Explore
            </Button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src="/logo.svg" alt="VIRASAT" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">VIRASAT</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {site.category}
                  </Badge>
                  {site.isUNESCO && <Badge variant="default">UNESCO World Heritage</Badge>}
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">{site.name}</h1>
                <p className="text-lg text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {site.city}, {site.state}
                </p>
              </div>
              <Button
                variant={isFavorited ? "default" : "outline"}
                size="lg"
                onClick={handleFavoriteToggle}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                {isFavorited ? "Saved" : "Save"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Image */}
              {primaryImage && (
                <Card>
                  <CardContent className="p-0">
                    <img
                      src={primaryImage.url}
                      alt={site.name}
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{site.description}</p>
                </CardContent>
              </Card>

              {/* Historical Significance */}
              <Card>
                <CardHeader>
                  <CardTitle>Historical Significance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {site.historicalSignificance}
                  </p>
                </CardContent>
              </Card>

              {/* Visitor Guidelines */}
              {site.visitorGuidelines && (
                <Card>
                  <CardHeader>
                    <CardTitle>Visitor Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{site.visitorGuidelines}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Audio Guide */}
              {site.audio && site.audio.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5" />
                      Audio Guide
                    </CardTitle>
                    <CardDescription>Listen to the site's story</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {site.audio.map((audio) => (
                      <div key={audio._id}>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handlePlayAudio(audio._id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {isPlaying ? "Pause" : "Play"} Audio ({audio.language})
                        </Button>
                        <audio ref={audioRef} src={audio.url} onEnded={() => setIsPlaying(false)} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {site.timePeriod && (
                    <div>
                      <p className="text-sm font-medium">Time Period</p>
                      <p className="text-sm text-muted-foreground">{site.timePeriod}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {site.city}, {site.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground capitalize">{site.category}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Media Gallery */}
              {site.media && site.media.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="grid grid-cols-2 gap-2">
                        {site.media
                          .filter((m) => m.type === "image")
                          .map((media) => (
                            <img
                              key={media._id}
                              src={media.url}
                              alt={media.caption || site.name}
                              className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                            />
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
