import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { BookOpen, Users } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface UserStoriesDisplayProps {
  siteId: Id<"heritageSites">;
  type: "story" | "community";
}

export default function UserStoriesDisplay({
  siteId,
  type,
}: UserStoriesDisplayProps) {
  const stories = useQuery(api.userStories.getStoriesBySite, {
    siteId,
    type,
  });

  if (!stories || stories.length === 0) {
    return null;
  }

  const icon = type === "story" ? BookOpen : Users;
  const Icon = icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">
          {type === "story" ? "Community Stories" : "Community Experiences"}
        </h3>
      </div>
      <div className="grid gap-4">
        {stories.map((story) => (
          <Card key={story._id} className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{story.userName}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {type === "story" ? "Story" : "Experience"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {story.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
