import { useParams } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import PanoramaViewer from "@/components/PanoramaViewer";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";

export default function PanoramaFullscreen() {
  const { id } = useParams<{ id: string }>();
  const site = useQuery(api.heritageSites.getById, id ? { id: id as Id<"heritageSites"> } : "skip");
  
  if (!site) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  const panoramaImage = site.media?.find((m) => m.type === "panorama");

  if (!panoramaImage) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">360° panorama not available</p>
          <Button onClick={() => window.close()}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black relative">
      <PanoramaViewer imageUrl={panoramaImage.url} />
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        onClick={() => window.close()}
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
}
