import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorProps {
  content?: string;
  onContentChange?: (content: string) => void;
  className?: string;
}

export default function Editor({
  content = "Start writing your thoughts here...",
  onContentChange = () => {},
  className = "",
}: EditorProps) {
  const [text, setText] = useState(content);
  const [selection, setSelection] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onContentChange(e.target.value);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd,
    });
  };

  const applyFormat = (format: "bold" | "italic" | "bullet") => {
    const textArea = document.querySelector("textarea");
    if (!textArea) return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = text.substring(start, end);

    let newText = text;
    if (format === "bold") {
      newText =
        text.substring(0, start) + `**${selectedText}**` + text.substring(end);
    } else if (format === "italic") {
      newText =
        text.substring(0, start) + `_${selectedText}_` + text.substring(end);
    } else if (format === "bullet") {
      newText =
        text.substring(0, start) + `\n- ${selectedText}` + text.substring(end);
    }

    setText(newText);
    onContentChange(newText);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center w-full max-w-3xl mx-auto p-4 bg-background",
        className,
      )}
    >
      <div className="w-full mb-4 flex justify-start gap-2 border-b pb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => applyFormat("bold")}
          className="hover:bg-accent"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => applyFormat("italic")}
          className="hover:bg-accent"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => applyFormat("bullet")}
          className="hover:bg-accent"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <Textarea
        value={text}
        onChange={handleTextChange}
        onSelect={handleSelect}
        className="w-full min-h-[600px] text-lg leading-relaxed resize-none focus-visible:ring-0 border-none shadow-none"
        placeholder="Start writing your thoughts here..."
      />
    </div>
  );
}
