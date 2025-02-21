import { useState } from "react";
import type { Highlight } from "~/types/highlight";

export function useHighlight() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const handleSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowToolbar(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    setToolbarPosition({
      top: rect.top - 10,
      left: rect.left + (rect.width / 2),
    });
    setShowToolbar(true);
  };

  const handleHighlight = (color: string) => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const mark = document.createElement('mark');
    mark.style.backgroundColor = color;
    const highlightId = crypto.randomUUID();
    mark.setAttribute('data-highlight-id', highlightId);
    
    try {
      range.surroundContents(mark);
      const newHighlight: Highlight = {
        id: highlightId,
        text: selection.toString(),
        createdAt: new Date(),
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        color: color,
      };
      setHighlights(prev => [...prev, newHighlight]);
    } catch (error) {
      console.error('Failed to highlight text:', error);
    }

    selection.removeAllRanges();
    setShowToolbar(false);
  };

  const handleRemoveHighlight = (id: string) => {
    if (!confirm('このハイライトを削除してもよろしいですか？')) {
      return;
    }

    const markElement = document.querySelector(`mark[data-highlight-id="${id}"]`);
    if (markElement) {
      const textNode = document.createTextNode(markElement.textContent || '');
      markElement.parentNode?.replaceChild(textNode, markElement);
    }

    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  const handleAddComment = (id: string, comment: string) => {
    setHighlights(prev => prev.map(h => 
      h.id === id ? { ...h, comment } : h
    ));
  };

  return {
    highlights,
    showToolbar,
    toolbarPosition,
    handleSelection,
    handleHighlight,
    handleRemoveHighlight,
    handleAddComment,
    setHighlights,
  };
} 