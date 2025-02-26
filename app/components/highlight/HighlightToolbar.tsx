import { Button } from "~/components/ui/button";
import { Highlighter } from "lucide-react";
import { highlightColors } from "~/lib/colors";

interface HighlightToolbarProps {
  position: { top: number; left: number };
  onHighlight: (color: string) => void;
}

export function HighlightToolbar({ position, onHighlight }: HighlightToolbarProps) {
  return (
    <div 
      className="fixed z-50 bg-white shadow-lg rounded-lg p-2 transform -translate-x-1/2 -translate-y-full flex gap-1"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {highlightColors.map(({ color, textColor, rgba }) => (
        <Button
          key={color}
          variant="ghost"
          size="icon"
          style={{ backgroundColor: color }}
          className="p-1 hover:opacity-80 transition-colors duration-200"
          onClick={() => onHighlight(rgba)}
        >
          <Highlighter className={`h-4 w-4 text-${textColor}-600`} />
        </Button>
      ))}
    </div>
  );
} 