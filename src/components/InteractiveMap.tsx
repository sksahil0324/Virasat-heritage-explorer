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

  // Improved Indian states with better coordinates for visualization
  const statePositions: Record<string, { x: number; y: number }> = {
    "Jammu and Kashmir": { x: 25, y: 8 },
    "Himachal Pradesh": { x: 28, y: 14 },
    "Punjab": { x: 25, y: 16 },
    "Uttarakhand": { x: 32, y: 16 },
    "Haryana": { x: 28, y: 20 },
    "Delhi": { x: 30, y: 21 },
    "Uttar Pradesh": { x: 36, y: 26 },
    "Rajasthan": { x: 22, y: 28 },
    "Bihar": { x: 44, y: 28 },
    "Gujarat": { x: 16, y: 36 },
    "Madhya Pradesh": { x: 30, y: 36 },
    "Jharkhand": { x: 46, y: 36 },
    "West Bengal": { x: 50, y: 33 },
    "Maharashtra": { x: 24, y: 48 },
    "Chhattisgarh": { x: 38, y: 46 },
    "Odisha": { x: 46, y: 48 },
    "Telangana": { x: 32, y: 56 },
    "Andhra Pradesh": { x: 34, y: 62 },
    "Karnataka": { x: 28, y: 60 },
    "Goa": { x: 24, y: 58 },
    "Tamil Nadu": { x: 32, y: 70 },
    "Kerala": { x: 28, y: 72 },
    "Assam": { x: 58, y: 28 },
    "Meghalaya": { x: 56, y: 31 },
    "Manipur": { x: 60, y: 33 },
    "Tripura": { x: 56, y: 34 },
    "Mizoram": { x: 58, y: 36 },
    "Nagaland": { x: 60, y: 30 },
    "Arunachal Pradesh": { x: 62, y: 24 },
    "Sikkim": { x: 50, y: 26 },
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
          <div className="relative w-full h-[600px] bg-gradient-to-br from-muted/20 via-muted/10 to-background rounded-lg overflow-hidden border-2 border-primary/20">
            {/* Accurate India Map Background */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <svg viewBox="0 0 200 280" className="w-full h-full opacity-15" preserveAspectRatio="xMidYMid meet">
                {/* Detailed India outline - more geographically accurate */}
                <path
                  d="M 85,5 L 90,8 L 95,10 L 100,9 L 105,12 L 110,15 L 115,18 L 120,20 L 125,25 L 130,30 L 135,35 L 138,40 L 140,45 L 142,50 L 143,55 L 142,60 L 140,65 L 138,70 L 135,75 L 132,80 L 130,85 L 128,90 L 126,95 L 124,100 L 122,105 L 120,110 L 118,115 L 116,120 L 114,125 L 112,130 L 110,135 L 108,140 L 106,145 L 104,150 L 102,155 L 100,160 L 98,165 L 96,170 L 94,175 L 92,180 L 90,185 L 88,190 L 86,195 L 84,200 L 82,205 L 80,210 L 78,215 L 76,220 L 74,225 L 72,230 L 70,235 L 68,240 L 66,245 L 64,250 L 62,255 L 60,260 L 58,265 L 56,268 L 54,270 L 52,268 L 50,265 L 48,262 L 46,258 L 44,254 L 42,250 L 40,246 L 38,242 L 36,238 L 34,234 L 32,230 L 30,226 L 28,222 L 26,218 L 24,214 L 22,210 L 20,206 L 18,202 L 16,198 L 14,194 L 12,190 L 10,186 L 8,182 L 6,178 L 5,174 L 4,170 L 3,166 L 2,162 L 2,158 L 3,154 L 4,150 L 6,146 L 8,142 L 10,138 L 12,134 L 15,130 L 18,126 L 21,122 L 24,118 L 27,114 L 30,110 L 33,106 L 36,102 L 39,98 L 42,94 L 45,90 L 48,86 L 51,82 L 54,78 L 57,74 L 60,70 L 63,66 L 66,62 L 69,58 L 72,54 L 75,50 L 78,46 L 80,42 L 82,38 L 84,34 L 85,30 L 86,26 L 86,22 L 85,18 L 84,14 L 83,10 L 84,8 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary/40"
                />
                {/* Add Kashmir region */}
                <path
                  d="M 85,5 L 88,3 L 92,2 L 96,3 L 98,5 L 99,8 L 98,11 L 96,13 L 93,14 L 90,13 L 87,11 L 85,8 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary/40"
                />
                {/* Add Northeast region detail */}
                <path
                  d="M 140,45 L 145,48 L 150,52 L 153,56 L 155,60 L 156,64 L 155,68 L 153,72 L 150,75 L 146,77 L 142,78 L 140,75 L 139,70 L 139,65 L 140,60 L 141,55 L 140,50 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary/40"
                />
                {/* Add Andaman & Nicobar Islands */}
                <path
                  d="M 130,200 L 132,202 L 133,205 L 132,208 L 130,210 L 128,208 L 127,205 L 128,202 Z M 128,215 L 130,217 L 131,220 L 130,223 L 128,225 L 126,223 L 125,220 L 126,217 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary/40"
                />
                {/* Add Lakshadweep Islands */}
                <path
                  d="M 15,180 L 17,181 L 17,183 L 16,184 L 14,183 L 14,181 Z M 12,185 L 14,186 L 14,188 L 13,189 L 11,188 L 11,186 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary/40"
                />
              </svg>
            </div>

            {/* Site Markers with improved spacing */}
            {sites?.map((site, index) => {
              const position = statePositions[site.state] || { x: 50, y: 50 };
              const stateIndex = sitesByState?.[site.state]?.indexOf(site) || 0;
              const totalInState = sitesByState?.[site.state]?.length || 1;
              
              // Better circular distribution for multiple sites in same state
              const angle = (stateIndex / totalInState) * Math.PI * 2;
              const radius = totalInState > 1 ? 2 : 0;
              const offsetX = Math.cos(angle) * radius;
              const offsetY = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={site._id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.02, type: "spring", stiffness: 200 }}
                  className="absolute cursor-pointer group z-10"
                  style={{
                    left: `${position.x + offsetX}%`,
                    top: `${position.y + offsetY}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => setSelectedSite(site)}
                  onMouseEnter={() => setHoveredState(site.state)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <motion.div
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    <MapPin
                      className={`h-7 w-7 drop-shadow-2xl transition-all duration-300 ${
                        site.isUNESCO
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-primary fill-primary"
                      } ${selectedSite?._id === site._id ? "scale-125" : ""}`}
                    />
                    {/* Pulse effect for selected site */}
                    {selectedSite?._id === site._id && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <div className={`w-full h-full rounded-full ${
                          site.isUNESCO ? "bg-yellow-400" : "bg-primary"
                        }`} />
                      </motion.div>
                    )}
                    {hoveredState === site.state && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-background/95 backdrop-blur border-2 border-primary/30 rounded-lg shadow-xl whitespace-nowrap text-xs font-medium z-20"
                      >
                        {site.name}
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Enhanced Legend */}
            <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-md border-2 border-primary/20 rounded-xl p-4 shadow-2xl">
              <div className="text-xs font-semibold mb-3 text-primary">Legend</div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">UNESCO Site</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary fill-primary" />
                  <span className="font-medium">Heritage Site</span>
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
                    className="p-4 border-2 border-primary/20 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
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