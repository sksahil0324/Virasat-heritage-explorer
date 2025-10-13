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
import { Heart, Loader2, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import InteractiveMap from "@/components/InteractiveMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Explore() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [state, setState] = useState<string>("all");
  const [unescoOnly, setUnescoOnly] = useState(false);

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
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src="./logo.svg" alt="VIRASAT" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">VIRASAT</span>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <Button variant="ghost" onClick={() => navigate("/favorites")}>
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Button>
              )}
              <Button variant="ghost" onClick={() => navigate("/")}>
                Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
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

        {/* Tabs for List/Map View */}
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
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, state, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filter Row */}
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
                  >
                    <Card
                      className="h-full cursor-pointer hover:border-primary/50 transition-colors"
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
      </div>
    </div>
  );
}