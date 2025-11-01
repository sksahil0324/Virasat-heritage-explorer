import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { BookOpen, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface SubmitStoryDialogProps {
  siteId: Id<"heritageSites">;
  siteName: string;
  type: "story" | "community";
}

export default function SubmitStoryDialog({
  siteId,
  siteName,
  type,
}: SubmitStoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitStory = useMutation(api.userStories.submitStory);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Please enter your story");
      return;
    }

    if (content.length < 20) {
      toast.error("Story must be at least 20 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitStory({
        siteId,
        content: content.trim(),
        type,
      });
      toast.success("Story submitted! It will appear after admin approval.");
      setContent("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to submit story");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const icon = type === "story" ? BookOpen : Users;
  const Icon = icon;
  const title = type === "story" ? "Share Your Story" : "Share Community Experience";
  const description =
    type === "story"
      ? `Share a story or legend about ${siteName}`
      : `Share your community experience at ${siteName}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Icon className="h-4 w-4" />
          {type === "story" ? "Add Story" : "Add Experience"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder={
              type === "story"
                ? "Share a story, legend, or historical account..."
                : "Share your community experience or cultural insights..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-32 resize-none"
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground">
            {content.length}/500 characters
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}