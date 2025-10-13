import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Navigation, Info, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useState } from "react";
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
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [showConnections, setShowConnections] = useState(true);

  // Group sites by state
  const sitesByState = sites?.reduce((acc, site) => {
    if (!acc[site.state]) {
      acc[site.state] = [];
    }
    acc[site.state].push(site);
    return acc;
  }, {} as Record<string, typeof sites>);

  // State definitions with positions and info
  const stateData: Record<string, { x: number; y: number; width: number; height: number; color: string; desc: string; highlights: string }> = {
    "Jammu and Kashmir": { x: 400, y: 50, width: 120, height: 80, color: "#4a6fa5", desc: "Known for its stunning Himalayan landscapes, Dal Lake, and rich cultural heritage.", highlights: "Dal Lake, Gulmarg, Vaishno Devi" },
    "Himachal Pradesh": { x: 450, y: 140, width: 100, height: 60, color: "#5b8ead", desc: "Famous for hill stations like Shimla and Manali, and adventure sports.", highlights: "Shimla, Manali, Dharamshala" },
    "Punjab": { x: 400, y: 210, width: 80, height: 50, color: "#ff9a76", desc: "The land of five rivers, known for its vibrant culture and delicious cuisine.", highlights: "Golden Temple, Wagah Border, Bhangra" },
    "Haryana": { x: 480, y: 210, width: 70, height: 50, color: "#ffb396", desc: "Known for its agricultural prosperity and historical sites.", highlights: "Chandigarh, Kurukshetra, Surajkund" },
    "Uttarakhand": { x: 520, y: 140, width: 70, height: 70, color: "#6d98ba", desc: "The 'Land of the Gods', home to Char Dham pilgrimage sites.", highlights: "Rishikesh, Haridwar, Nainital" },
    "Uttar Pradesh": { x: 450, y: 270, width: 140, height: 80, color: "#ff6b6b", desc: "India's most populous state, home to the Taj Mahal and Varanasi.", highlights: "Taj Mahal, Varanasi, Lucknow" },
    "Madhya Pradesh": { x: 350, y: 360, width: 150, height: 100, color: "#ff9a76", desc: "The 'Heart of India', known for its historical monuments and wildlife.", highlights: "Khajuraho, Sanchi, Kanha National Park" },
    "Rajasthan": { x: 250, y: 270, width: 180, height: 80, color: "#ffb396", desc: "The 'Land of Kings', famous for its palaces, forts, and desert.", highlights: "Jaipur, Udaipur, Jaisalmer" },
    "Gujarat": { x: 180, y: 360, width: 150, height: 60, color: "#4a6fa5", desc: "Birthplace of Mahatma Gandhi, known for its business culture and festivals.", highlights: "Statue of Unity, Rann of Kutch, Gir Forest" },
    "Maharashtra": { x: 250, y: 430, width: 130, height: 80, color: "#5b8ead", desc: "India's financial capital, known for Bollywood and diverse culture.", highlights: "Mumbai, Pune, Ajanta & Ellora Caves" },
    "Karnataka": { x: 280, y: 520, width: 120, height: 70, color: "#6d98ba", desc: "Known for its IT industry, historical sites, and diverse landscapes.", highlights: "Bangalore, Mysore, Hampi" },
    "Tamil Nadu": { x: 350, y: 600, width: 100, height: 80, color: "#4a6fa5", desc: "Famous for its Dravidian-style temples, classical arts, and cuisine.", highlights: "Chennai, Madurai, Mahabalipuram" },
    "Kerala": { x: 250, y: 600, width: 90, height: 60, color: "#5b8ead", desc: "'God's Own Country', known for backwaters, beaches, and Ayurveda.", highlights: "Backwaters, Kochi, Munnar" },
    "Andhra Pradesh": { x: 320, y: 520, width: 80, height: 70, color: "#6d98ba", desc: "Known for Tirupati temple, spicy cuisine, and Kuchipudi dance.", highlights: "Tirupati, Amaravati, Araku Valley" },
    "West Bengal": { x: 550, y: 360, width: 80, height: 60, color: "#ff6b6b", desc: "Known for its cultural capital Kolkata, literature, and Durga Puja.", highlights: "Kolkata, Darjeeling, Sundarbans" },
    "Bihar": { x: 550, y: 430, width: 70, height: 50, color: "#ff9a76", desc: "One of India's oldest inhabited places, with rich historical significance.", highlights: "Bodh Gaya, Nalanda, Patna" },
    "Odisha": { x: 500, y: 490, width: 80, height: 60, color: "#ffb396", desc: "Famous for Jagannath Temple, classical dance, and tribal culture.", highlights: "Puri, Konark, Bhubaneswar" },
    "Assam": { x: 630, y: 360, width: 70, height: 50, color: "#4a6fa5", desc: "Known for tea plantations, Kaziranga National Park, and silk.", highlights: "Kaziranga, Guwahati, Majuli Island" },
    "Delhi": { x: 500, y: 240, width: 40, height: 40, color: "#ffd166", desc: "India's capital, a blend of ancient history and modern development.", highlights: "Red Fort, Qutub Minar, India Gate" },
  };

  const handleZoomIn = () => setScale(Math.min(scale + 0.2, 3));
  const handleZoomOut = () => setScale(Math.max(scale - 0.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setSelectedState(null);
    setSelectedSite(null);
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
            Click on states or markers to explore sites • {sites?.length || 0} sites mapped
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[600px] bg-gradient-to-br from-primary/5 via-secondary/5 to-background rounded-lg overflow-hidden border-2 border-primary/20">
            {/* SVG Map */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <svg 
                viewBox="0 0 1000 800" 
                className="w-full h-full"
                style={{ transform: `scale(${scale})`, transition: "transform 0.3s ease" }}
              >
                <defs>
                  <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="oklch(0.12 0.02 240)" />
                    <stop offset="100%" stopColor="oklch(0.15 0.02 240)" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Background */}
                <rect width="100%" height="100%" fill="url(#bgGradient)" opacity="0.3" />

                {/* Animated connections */}
                {showConnections && (
                  <g stroke="rgba(91, 192, 190, 0.3)" strokeWidth="2" fill="none">
                    <motion.path
                      d="M460,90 Q500,120 540,150"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M500,200 Q520,230 540,260"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M380,310 Q400,340 420,370"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M320,330 Q350,400 380,470"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M450,500 Q480,550 510,600"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
                    />
                  </g>
                )}

                {/* States */}
                {Object.entries(stateData).map(([stateName, data]) => (
                  <motion.rect
                    key={stateName}
                    x={data.x}
                    y={data.y}
                    width={data.width}
                    height={data.height}
                    rx="10"
                    fill={selectedState === stateName ? "#ffd166" : data.color}
                    filter="url(#glow)"
                    className="cursor-pointer transition-all"
                    whileHover={{ scale: 1.05, opacity: 0.9 }}
                    onClick={() => setSelectedState(stateName)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}

                {/* Heritage Site Markers */}
                {sites?.map((site, index) => {
                  const stateInfo = stateData[site.state];
                  if (!stateInfo) return null;

                  const stateIndex = sitesByState?.[site.state]?.indexOf(site) || 0;
                  const totalInState = sitesByState?.[site.state]?.length || 1;
                  
                  const angle = (stateIndex / totalInState) * Math.PI * 2;
                  const radius = totalInState > 1 ? 15 : 0;
                  const offsetX = Math.cos(angle) * radius;
                  const offsetY = Math.sin(angle) * radius;

                  const x = stateInfo.x + stateInfo.width / 2 + offsetX;
                  const y = stateInfo.y + stateInfo.height / 2 + offsetY;

                  return (
                    <g
                      key={site._id}
                      transform={`translate(${x}, ${y})`}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSite(site);
                      }}
                    >
                      <motion.circle
                        r="6"
                        fill={site.isUNESCO ? "#ffd166" : "#5bc0be"}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
                      </motion.circle>
                      {selectedSite?._id === site._id && (
                        <motion.circle
                          r="12"
                          fill="none"
                          stroke="#ffd166"
                          strokeWidth="2"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </g>
                  );
                })}

                {/* Major Cities */}
                <g>
                  <g transform="translate(500, 260)">
                    <circle r="5" fill="#ffd166">
                      <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="10" y="5" fill="#ffd166" fontSize="12">Delhi</text>
                  </g>
                  <g transform="translate(300, 470)">
                    <circle r="5" fill="#ffd166">
                      <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="10" y="5" fill="#ffd166" fontSize="12">Mumbai</text>
                  </g>
                  <g transform="translate(400, 650)">
                    <circle r="5" fill="#ffd166">
                      <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="10" y="5" fill="#ffd166" fontSize="12">Chennai</text>
                  </g>
                  <g transform="translate(580, 390)">
                    <circle r="5" fill="#ffd166">
                      <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="10" y="5" fill="#ffd166" fontSize="12">Kolkata</text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => setShowConnections(!showConnections)}
              >
                {showConnections ? "Hide" : "Show"} Connections
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-md border-2 border-primary/20 rounded-xl p-3 shadow-2xl">
              <div className="text-xs font-semibold mb-2 text-primary">Legend</div>
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffd166]" />
                  <span>UNESCO Site</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#5bc0be]" />
                  <span>Heritage Site</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffd166] animate-pulse" />
                  <span>Major City</span>
                </div>
              </div>
            </div>
          </div>

          {/* State Info Display */}
          {selectedState && stateData[selectedState] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-secondary/20 rounded-lg border border-primary/20"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-lg text-primary">{selectedState}</h4>
                <Button size="sm" variant="ghost" onClick={() => setSelectedState(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{stateData[selectedState].desc}</p>
              <div className="flex flex-wrap gap-2">
                {stateData[selectedState].highlights.split(", ").map((highlight) => (
                  <Badge key={highlight} variant="secondary" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
              {sitesByState?.[selectedState] && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">
                    {sitesByState[selectedState].length} Heritage {sitesByState[selectedState].length === 1 ? "Site" : "Sites"}
                  </p>
                </div>
              )}
            </motion.div>
          )}
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
                  Click on any marker or state on the map to view details
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Sites by State */}
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
                    onClick={() => setSelectedState(state)}
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