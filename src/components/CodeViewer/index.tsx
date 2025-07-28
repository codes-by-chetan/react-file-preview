import { useState, useMemo, useRef, useEffect } from "react";
import { Copy, Check, Code } from "lucide-react";
import { Button } from "../ui/Button";
import { BlockDetector } from "./BlockDetector";
import { LineRenderer } from "./LineRenderer";
import type { BaseViewerProps } from "../../types";
import type { BracketPair, LineInfo } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
interface CodeViewerProps extends BaseViewerProps {
  content: string;
  language: string;
  fileName?: string;
  height?: string;
}

export function CodeViewer({
  content,
  language,
  fileName,
  className = "",
  height = "100%",
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [hoveredBracket, setHoveredBracket] = useState<number | null>(null);
  const [remainingHeight, setRemainingHeight] = useState<number>(0);
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(
    new Set()
  );
  const contentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const lines = useMemo(() => content.split("\n"), [content]);

  // Detect code blocks
  const codeBlocks = useMemo(() => {
    const detector = new BlockDetector(lines, language);
    return detector.detectBlocks();
  }, [lines, language]);

  // Find bracket pairs
  const bracketPairs = useMemo(() => {
    const pairs: BracketPair[] = [];
    const stack: Array<{ char: string; pos: number; line: number }> = [];

    lines.forEach((line, lineIndex) => {
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const pos = lineIndex * 1000 + i;

        if (["(", "[", "{"].includes(char)) {
          stack.push({ char, pos, line: lineIndex });
        } else if ([")", "]", "}"].includes(char)) {
          const expectedOpen = char === ")" ? "(" : char === "]" ? "[" : "{";
          for (let j = stack.length - 1; j >= 0; j--) {
            if (stack[j].char === expectedOpen) {
              const openBracket = stack.splice(j, 1)[0];
              const type = (expectedOpen + char) as BracketPair["type"];
              pairs.push({
                open: openBracket.pos,
                close: pos,
                type,
                line: lineIndex,
                depth: stack.length,
              });
              break;
            }
          }
        }
      }
    });

    return pairs;
  }, [lines]);

  // Create line info with visibility and block information
  const lineInfos = useMemo(() => {
    const infos: LineInfo[] = [];

    lines.forEach((line, index) => {
      const isInCollapsedBlock = codeBlocks.some(
        (block) =>
          collapsedBlocks.has(block.id) &&
          index > block.startLine &&
          block.endLine &&
          index <= block.endLine
      );

      const block = codeBlocks.find((b) => b.startLine === index);
      const isBlockStart = !!block;
      const isCollapsed = block ? collapsedBlocks.has(block.id) : false;

      infos.push({
        originalIndex: index,
        content: line,
        isVisible: !isInCollapsedBlock,
        block,
        isBlockStart,
        isCollapsed,
      });
    });

    return infos;
  }, [lines, codeBlocks, collapsedBlocks]);

  const toggleCodeBlock = (blockId: string) => {
    setCollapsedBlocks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(blockId)) {
        newSet.delete(blockId);
      } else {
        newSet.add(blockId);
      }
      return newSet;
    });
    // Immediately recalculate height after toggle
    const element: any = contentRef.current;
    if (element) {
      const visibleLines = lineInfos.filter((info) => info.isVisible).length;
      const lineHeight = 24; // Assuming each line is ~24px (min-h-[24px])
      const visibleHeight = visibleLines * lineHeight + 48; // +32 for padding (py-4)
      const containerHeight = element.clientHeight;
      const newRemainingHeight = containerHeight - visibleHeight;
      setRemainingHeight(newRemainingHeight > 0 ? newRemainingHeight : 0);
      setIsOverflowing(newRemainingHeight <= 0);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const getLanguageDisplayName = (lang: string): string => {
    const languageMap: { [key: string]: string } = {
      js: "JavaScript",
      jsx: "JavaScript (JSX)",
      ts: "TypeScript",
      tsx: "TypeScript (TSX)",
      py: "Python",
      css: "CSS",
      html: "HTML",
      xml: "XML",
      json: "JSON",
      md: "Markdown",
      yml: "YAML",
      yaml: "YAML",
      sql: "SQL",
      java: "Java",
      cpp: "C++",
      c: "C",
    };
    return languageMap[lang.toLowerCase()] || lang.toUpperCase();
  };

  // Check if the content is overflowing and set placeholder height
  useEffect(() => {
    const checkOverflow = () => {
      const element: any = contentRef.current;
      if (element) {
        const visibleLines = lineInfos.filter((info) => info.isVisible).length;
        const lineHeight = 24; // Assuming each line is ~24px (min-h-[24px])
        const visibleHeight = visibleLines * lineHeight + 48; // +32 for padding (py-4)
        const containerHeight = element.clientHeight; // Actual height of the container
        const newRemainingHeight = containerHeight - visibleHeight;
        console.log(
          "visibleHeight: ",
          visibleHeight,
          "\ncontainerHeight: ",
          containerHeight,
          "\nnewRemainingHeight: ",
          newRemainingHeight
        );

        setRemainingHeight(newRemainingHeight > 0 ? newRemainingHeight : 0);
        setIsOverflowing(newRemainingHeight <= 0);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [content, lineInfos, collapsedBlocks]);

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">
            {fileName || getLanguageDisplayName(language)}
          </span>
          {fileName && (
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              {getLanguageDisplayName(language)}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>

      {/* Code Content */}
      <ScrollArea
        ref={contentRef}
        className="bg-gray-50 max-h-96"
        style={{ maxHeight: height || "100%" }}
      >
        <div
          className=""
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          }}
        >
          {lineInfos.map((lineInfo) => (
            <LineRenderer
              key={lineInfo.originalIndex}
              lineInfo={lineInfo}
              language={language}
              hoveredBracket={hoveredBracket}
              bracketPairs={bracketPairs}
              onBracketHover={setHoveredBracket}
              onToggleBlock={toggleCodeBlock}
            />
          ))}
        </div>
        <div
          className={`flex ${isOverflowing ? "h-0" : ""}`}
          style={{ minHeight: isOverflowing ? 0 : `${remainingHeight}px` }}
        >
          <div className="bg-gray-100 px-2 text-xs text-gray-500 font-mono select-none border-r min-w-[60px] flex items-start pt-1 flex-shrink-0"></div>
          <div className="flex-1 px-4 text-sm font-mono py-1">
            <div className="leading-6" style={{ whiteSpace: "pre-wrap" }}></div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-3 py-2 border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
        <span>
          {lines.length} lines • {content.length} characters
        </span>
        <span>{codeBlocks.length} collapsible blocks</span>
      </div>
    </div>
  );
}
