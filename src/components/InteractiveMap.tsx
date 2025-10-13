import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

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

// Custom marker icons
const createCustomIcon = (isUNESCO: boolean) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${isUNESCO ? "#ffd166" : "#5bc0be"};
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function InteractiveMap() {
  const navigate = useNavigate();
  const sites = useQuery(api.heritageSites.list, {});
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [indiaGeoJson, setIndiaGeoJson] = useState<any>(null);

  // Load India GeoJSON data
  useEffect(() => {
    fetch("/india-states.geojson")
      .then((response) => response.json())
      .then((data) => setIndiaGeoJson(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  // Group sites by state
  const sitesByState = sites?.reduce((acc, site) => {
    if (!acc[site.state]) {
      acc[site.state] = [];
    }
    acc[site.state].push(site);
    return acc;
  }, {} as Record<string, typeof sites>);

  // Style function for GeoJSON features
  const geoJsonStyle = (feature: any) => {
    const isSelected = selectedState === feature.properties.NAME_1 || selectedState === feature.properties.st_nm;
    return {
      fillColor: isSelected ? "#ffd166" : "#4a6fa5",
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: isSelected ? 0.7 : 0.5,
    };
  };

  // Handle feature interactions
  const onEachFeature = (feature: any, layer: any) => {
    const stateName = feature.properties.NAME_1 || feature.properties.st_nm;
    
    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({
          weight: 3,
          color: "#666",
          dashArray: "",
          fillOpacity: 0.7,
        });
      },
      mouseout: (e: any) => {
        e.target.setStyle(geoJsonStyle(feature));
      },
      click: (e: any) => {
        setSelectedState(stateName);
        setSelectedSite(null);
      },
    });

    if (stateName) {
      layer.bindTooltip(stateName, {
        permanent: false,
        direction: "center",
        className: "state-tooltip",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Visualization */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Heritage Sites Across India
          </CardTitle>
          <CardDescription>
            Click on states or markers to explore sites • {sites?.length || 0} sites mapped
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[600px] rounded-lg overflow-hidden border-2 border-primary/20">
            {indiaGeoJson ? (
              <MapContainer
                center={[22.9734, 78.6569]}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <GeoJSON
                  data={indiaGeoJson}
                  style={geoJsonStyle}
                  onEachFeature={onEachFeature}
                />
                {sites?.map((site) => {
                  // Use approximate coordinates if not available
                  const lat = site.latitude || 28.6139;
                  const lng = site.longitude || 77.209;
                  
                  return (
                    <Marker
                      key={site._id}
                      position={[lat, lng]}
                      icon={createCustomIcon(site.isUNESCO)}
                      eventHandlers={{
                        click: () => setSelectedSite(site),
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-sm mb-1">{site.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            {site.city}, {site.state}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/site/${site._id}`)}
                            className="w-full"
                          >
                            View Details
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            )}
          </div>

          {/* State Info Display */}
          {selectedState && sitesByState?.[selectedState] && (
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
              <div className="mt-3">
                <p className="text-sm font-medium mb-1">
                  {sitesByState[selectedState].length} Heritage{" "}
                  {sitesByState[selectedState].length === 1 ? "Site" : "Sites"}
                </p>
              </div>
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