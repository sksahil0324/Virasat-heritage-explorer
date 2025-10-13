import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Navigation, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

interface Site {
  _id: Id<"heritageSites">;
  name: string;
  city: string;
  state: string;
  category: string;
  isUNESCO: boolean;
  latitude?: number;
  longitude?: number;
  description: string;
}

export default function InteractiveMap() {
  const navigate = useNavigate();
  const sites = useQuery(api.heritageSites.list, {});
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Group sites by state
  const sitesByState = sites?.reduce((acc, site) => {
    if (!acc[site.state]) {
      acc[site.state] = [];
    }
    acc[site.state].push(site);
    return acc;
  }, {} as Record<string, typeof sites>);

  // Indian states with approximate coordinates for visualization
  const statePositions: Record<string, { x: number; y: number }> = {
    "Jammu and Kashmir": { x: 20, y: 10 },
    "Himachal Pradesh": { x: 25, y: 15 },
    "Punjab": { x: 22, y: 18 },
    "Uttarakhand": { x: 30, y: 18 },
    "Haryana": { x: 25, y: 22 },
    "Delhi": { x: 26, y: 23 },
    "Uttar Pradesh": { x: 35, y: 28 },
    "Rajasthan": { x: 18, y: 30 },
    "Bihar": { x: 45, y: 30 },
    "Gujarat": { x: 12, y: 38 },
    "Madhya Pradesh": { x: 30, y: 38 },
    "Jharkhand": { x: 48, y: 38 },
    "West Bengal": { x: 52, y: 35 },
    "Maharashtra": { x: 20, y: 50 },
    "Chhattisgarh": { x: 38, y: 48 },
    "Odisha": { x: 48, y: 50 },
    "Telangana": { x: 32, y: 58 },
    "Andhra Pradesh": { x: 35, y: 62 },
    "Karnataka": { x: 25, y: 62 },
    "Goa": { x: 20, y: 60 },
    "Tamil Nadu": { x: 32, y: 72 },
    "Kerala": { x: 25, y: 72 },
    "Assam": { x: 60, y: 30 },
    "Meghalaya": { x: 58, y: 33 },
    "Manipur": { x: 62, y: 35 },
    "Tripura": { x: 58, y: 38 },
    "Mizoram": { x: 60, y: 40 },
    "Nagaland": { x: 62, y: 32 },
    "Arunachal Pradesh": { x: 65, y: 25 },
    "Sikkim": { x: 52, y: 25 },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Visualization */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Heritage Sites Across India
          </CardTitle>
          <CardDescription>
            Click on markers to explore sites • {sites?.length || 0} sites mapped
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[600px] bg-muted/30 rounded-lg overflow-hidden border">
            {/* Simplified India Map Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M 20,10 L 30,15 L 35,20 L 40,18 L 50,25 L 55,30 L 60,28 L 65,35 L 60,40 L 55,45 L 50,50 L 45,55 L 40,60 L 35,65 L 30,70 L 28,75 L 32,78 L 35,75 L 40,72 L 42,68 L 38,65 L 35,62 L 30,60 L 25,58 L 22,55 L 20,50 L 18,45 L 15,40 L 12,35 L 15,30 L 18,25 L 20,20 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            {/* Site Markers */}
            {sites?.map((site, index) => {
              const position = statePositions[site.state] || { x: 50, y: 50 };
              const offset = (index % 3) * 3; // Slight offset for multiple sites in same state

              return (
                <motion.div
                  key={site._id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${position.x + offset}%`,
                    top: `${position.y + offset}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => setSelectedSite(site)}
                  onMouseEnter={() => setHoveredState(site.state)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    <MapPin
                      className={`h-6 w-6 ${
                        site.isUNESCO
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-primary fill-primary"
                      } drop-shadow-lg transition-colors`}
                    />
                    {hoveredState === site.state && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background border rounded shadow-lg whitespace-nowrap text-xs z-10"
                      >
                        {site.name}
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur border rounded-lg p-3 shadow-lg">
              <div className="text-xs font-medium mb-2">Legend</div>
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>UNESCO Site</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary fill-primary" />
                  <span>Heritage Site</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Details Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {selectedSite ? "Site Details" : "Select a Site"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {selectedSite ? (
              <motion.div
                key={selectedSite._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{selectedSite.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedSite.city}, {selectedSite.state}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedSite(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {selectedSite.category}
                  </Badge>
                  {selectedSite.isUNESCO && <Badge>UNESCO</Badge>}
                </div>

                <ScrollArea className="h-[300px]">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedSite.description}
                  </p>
                </ScrollArea>

                <Button
                  className="w-full"
                  onClick={() => navigate(`/site/${selectedSite._id}`)}
                >
                  View Full Details
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click on any marker on the map to view site details
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* States List */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Sites by State</CardTitle>
          <CardDescription>Browse heritage sites organized by location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sitesByState &&
              Object.entries(sitesByState)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([state, stateSites]) => (
                  <motion.div
                    key={state}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setHoveredState(state)}
                  >
                    <h4 className="font-medium mb-2">{state}</h4>
                    <p className="text-sm text-muted-foreground">
                      {stateSites.length} {stateSites.length === 1 ? "site" : "sites"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {stateSites.slice(0, 3).map((site) => (
                        <Badge key={site._id} variant="outline" className="text-xs">
                          {site.name.split(" ")[0]}
                        </Badge>
                      ))}
                      {stateSites.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{stateSites.length - 3}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
