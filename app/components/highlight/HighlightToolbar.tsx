import { Button } from "~/components/ui/button";
import { Highlighter } from "lucide-react";

interface HighlightToolbarProps {
  position: { top: number; left: number };
  onHighlight: (color: string) => void;
}

export function HighlightToolbar({ position, onHighlight }: HighlightToolbarProps) {
  const highlightColors = [
    { color: '#FFF9B1', textColor: 'yellow' },
    { color: '#FFCEE0', textColor: 'red' },
    { color: '#A6CCF5', textColor: 'blue' },
    { color: '#D5F692', textColor: 'green' },
  ];

  return (
    <div 
      className="fixed z-50 bg-white shadow-lg rounded-lg p-2 transform -translate-x-1/2 -translate-y-full flex gap-1"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {highlightColors.map(({ color, textColor }) => (
        <Button
          key={color}
          variant="ghost"
          size="icon"
          className={`p-1 bg-[${color}] hover:bg-[${color}]/80 transition-colors duration-200`}
          onClick={() => onHighlight(color)}
        >
          <Highlighter className={`h-4 w-4 text-${textColor}-600`} />
        </Button>
      ))}
    </div>
  );
} 