import { Marked } from "marked";
import type { MetaFunction } from "@remix-run/node";
import { FileDown } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { HighlightCard } from "~/components/highlight/HighlightCard";
import { HighlightToolbar } from "~/components/highlight/HighlightToolbar";
import { useHighlight } from "~/hooks/useHighlight";
import { useFileOperations } from "~/hooks/useFileOperations";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const marked = new Marked();
  
  const {
    highlights,
    showToolbar,
    toolbarPosition,
    handleSelection,
    handleHighlight,
    handleRemoveHighlight,
    handleAddComment,
    setHighlights,
  } = useHighlight();
  
  const { content, handleFileUpload, handleDownload, removeHighlightFromContent } =
    useFileOperations(setHighlights);
    
  const originalHandleRemoveHighlight = handleRemoveHighlight;
  const enhancedHandleRemoveHighlight = (id: string) => {
    // ハイライトのテキスト内容を取得
    const highlight = highlights.find(h => h.id === id);
    const highlightText = highlight?.text || "";
    
    originalHandleRemoveHighlight(id);
    if (removeHighlightFromContent) {
      removeHighlightFromContent(id, highlightText);
    }
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen overflow-hidden"
    >
      <ResizablePanel defaultSize={80} minSize={50}>
        <div className="overflow-y-auto h-full">
          <div className="sticky top-0 bg-white px-4 py-2 border-b z-10 flex items-center justify-between">
            <div className="flex w-full max-w-sm items-center gap-1.5">
              <Input
                type="file"
                accept=".md"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <FileDown className="h-4 w-4" />
            </Button>
          </div>

          <div
            className="prose mx-auto py-12 px-6"
            dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
            onMouseUp={handleSelection}
          />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={20} minSize={20}>
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 bg-white px-4 py-2 border-b z-10 h-[57px] flex items-center">
            <h2 className="text-lg font-semibold">Highlights</h2>
          </div>
          <div className="space-y-4 p-6">
            {highlights.map((highlight) => (
              <HighlightCard
                key={highlight.id}
                highlight={highlight}
                onRemove={enhancedHandleRemoveHighlight}
                onCommentChange={handleAddComment}
              />
            ))}
          </div>
        </div>
      </ResizablePanel>

      {showToolbar && (
        <HighlightToolbar
          position={toolbarPosition}
          onHighlight={handleHighlight}
        />
      )}
    </ResizablePanelGroup>
  );
}
