import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Trash } from "lucide-react";
import type { Highlight } from "~/types/highlight";

interface HighlightCardProps {
  highlight: Highlight;
  onRemove: (id: string) => void;
  onCommentChange: (id: string, comment: string) => void;
}

export function HighlightCard({ highlight, onRemove, onCommentChange }: HighlightCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="pt-6 px-6 py-2">
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {highlight.createdAt.toLocaleString()}  
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => onRemove(highlight.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="italic text-xs pl-4 border-l-4"
          style={{ 
            borderLeftColor: highlight.color,
            backgroundColor: 'white'
          }}
        >
          {highlight.text}
        </div>
        <div className="mt-4">
          <Textarea
            id={`comment-${highlight.id}`}
            placeholder="コメントを追加..."
            value={highlight.comment || ''}
            onChange={(e) => onCommentChange(highlight.id, e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
} 