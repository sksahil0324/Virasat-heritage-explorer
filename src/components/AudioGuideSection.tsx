import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2, Play, Pause, Plus, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface AudioGuide {
  _id: Id<"audioSummaries">;
  language: string;
  url: string;
  duration?: number;
  playCount: number;
}

interface AudioGuideSectionProps {
  siteId: Id<"heritageSites">;
  audios: AudioGuide[];
  isAdmin?: boolean;
  onAudioAdded?: () => void;
}

export default function AudioGuideSection({
  siteId,
  audios,
  isAdmin = false,
  onAudioAdded,
}: AudioGuideSectionProps) {
  const [playingId, setPlayingId] = useState<Id<"audioSummaries"> | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const incrementPlayCount = useMutation(api.audio.incrementPlayCount);
  const removeAudio = useMutation(api.audio.remove);

  const handlePlayAudio = async (audio: AudioGuide) => {
    if (audioRef.current) {
      if (playingId === audio._id) {
        audioRef.current.pause();
        setPlayingId(null);
      } else {
        audioRef.current.src = audio.url;
        audioRef.current.play();
        setPlayingId(audio._id);
        try {
          await incrementPlayCount({ id: audio._id });
        } catch (error) {
          console.error("Failed to increment play count:", error);
        }
      }
    }
  };

  const handleRemoveAudio = async (audioId: Id<"audioSummaries">) => {
    try {
      await removeAudio({ id: audioId });
      toast.success("Audio removed successfully");
      onAudioAdded?.();
    } catch (error) {
      toast.error("Failed to remove audio");
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      english: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      hindi: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      spanish: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      french: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      german: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      japanese: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      chinese: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      arabic: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    };
    return colors[language.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  if (!audios || audios.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Audio Guides
        </CardTitle>
        <CardDescription>Listen to the site's story in multiple languages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {audios.map((audio) => (
          <div
            key={audio._id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePlayAudio(audio)}
                className="shrink-0"
              >
                {playingId === audio._id ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`capitalize ${getLanguageColor(audio.language)}`}>
                    {audio.language}
                  </Badge>
                  {audio.duration && (
                    <span className="text-xs text-muted-foreground">
                      {Math.floor(audio.duration / 60)}:{String(Math.floor(audio.duration % 60)).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {audio.playCount} plays
                </p>
              </div>
            </div>
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAudio(audio._id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <audio ref={audioRef} onEnded={() => setPlayingId(null)} />
      </CardContent>
    </Card>
  );
}
