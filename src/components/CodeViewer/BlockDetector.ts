import type { CodeBlock } from "./types";

export class BlockDetector {
  private lines: string[];
  private language: string;

  constructor(lines: string[], language: string) {
    this.lines = lines;
    this.language = language.toLowerCase();
  }

  detectBlocks(): CodeBlock[] {
    if (this.isJavaScriptLike()) {
      return this.detectJavaScriptBlocks();
    } else if (this.isPython()) {
      return this.detectPythonBlocks();
    }
    return [];
  }

  private isJavaScriptLike(): boolean {
    return ["javascript", "typescript", "js", "ts", "jsx", "tsx"].includes(
      this.language
    );
  }

  private isPython(): boolean {
    return ["python", "py"].includes(this.language);
  }

  private detectJavaScriptBlocks(): CodeBlock[] {
    const blocks: CodeBlock[] = [];
    const braceStack: Array<{
      line: number;
      type: string;
      name?: string;
      indent: number;
      braceCount: number;
    }> = [];
    let currentBraceCount = 0;

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i].trim();
      const fullLine = this.lines[i];
      const indent = fullLine.length - fullLine.trimStart().length;

      if (!line || line.match(/^\s*\/\//) || line.match(/^\s*\/\*/)) {
        continue;
      }

      const openBraces = (fullLine.match(/{/g) || []).length;
      const closeBraces = (fullLine.match(/}/g) || []).length;
      currentBraceCount += openBraces;

      // JSX Block Detection
      if (this.isOpeningTag(fullLine)) {
        const jsxBlock = this.findJSXBlock(this.lines, i);
        if (jsxBlock) {
          blocks.push({
            id: `${jsxBlock.startLine}-${
              jsxBlock.endLine
            }-jsx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            startLine: jsxBlock.startLine,
            endLine: jsxBlock.endLine,
            type: "jsx" as CodeBlock["type"],
            name: this.extractTagName(fullLine) || undefined,
          });
          i = jsxBlock.endLine; // Skip to end of block
          continue;
        }
      }

      // Non-JSX Block Start
      if (openBraces > 0) {
        const blockInfo = this.detectBlockStart(fullLine, i);
        if (blockInfo && blockInfo.type !== "jsx") {
          braceStack.push({
            line: i,
            type: blockInfo.type,
            name: blockInfo.name,
            indent,
            braceCount: currentBraceCount,
          });
        }
      }

      // Export Statement
      if (this.isExportStatement(fullLine) && braceStack.length === 0) {
        if (i > 0 && !blocks.some((b) => b.startLine === i)) {
          blocks.push({
            id: `${i}-${i}-export-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 5)}`,
            startLine: i,
            endLine: i,
            type: "export" as CodeBlock["type"],
            name: "export",
          });
        }
      }

      // Non-JSX Block End
      if (closeBraces > 0) {
        for (let j = braceStack.length - 1; j >= 0; j--) {
          const block = braceStack[j];
          if (currentBraceCount - closeBraces < block.braceCount) {
            const endLine = i;
            if (endLine > block.line) {
              blocks.push({
                id: `${block.line}-${endLine}-${
                  block.type
                }-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                startLine: block.line,
                endLine,
                type: block.type as CodeBlock["type"],
                name: block.name,
              });
            }
            braceStack.splice(j, 1);
          }
        }
        currentBraceCount -= closeBraces;
      }
    }

    while (braceStack.length > 0) {
      const block = braceStack.pop()!;
      if (this.lines.length - 1 > block.line) {
        blocks.push({
          id: `${block.line}-${this.lines.length - 1}-${
            block.type
          }-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          startLine: block.line,
          endLine: this.lines.length - 1,
          type: block.type as CodeBlock["type"],
          name: block.name,
        });
      }
    }

    return blocks.sort((a, b) => a.startLine - b.startLine);
  }

  private extractTagName(line: string): string | null {
    const match = line.match(/^<([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  private isSelfClosing(line: string): boolean {
    return /\/>\s*$/.test(line);
  }

  private isOpeningTag(line: string): boolean {
    return (
      /^<([a-zA-Z0-9]+)(\s|>)/.test(line) &&
      !this.isSelfClosing(line) &&
      !/^<\/[a-zA-Z0-9]+>/.test(line)
    );
  }

  private isClosingTag(line: string): boolean {
    return /^<\/([a-zA-Z0-9]+)>/.test(line);
  }

  private findJSXBlock(
    lines: string[],
    startLine: number
  ): { startLine: number; endLine: number } | null {
    let stack: string[] = [];
    for (let i = startLine; i < lines.length; i++) {
      const line = lines[i].trim();

      if (this.isOpeningTag(line)) {
        const tagName = this.extractTagName(line);
        if (tagName) {
          stack.push(tagName);
        }
      } else if (this.isClosingTag(line)) {
        const tagName = line.match(/^<\/([a-zA-Z0-9]+)>/)![1];
        if (stack.length > 0 && stack[stack.length - 1] === tagName) {
          stack.pop();
          if (stack.length === 0) {
            return { startLine, endLine: i };
          }
        }
      } else if (this.isSelfClosing(line)) {
        // Self-closing, do nothing (no stack push/pop needed)
      }

      // Edge case: Inline multiple tags in one line like <div><span>Text</span></div>
      // You can enhance this later to parse per tag in line rather than per line.
    }

    return null; // No closing found
  }

  private isExportStatement(line: string): boolean {
    return line.trim().match(/^\s*export\s+(default|const|function)/) !== null;
  }

  private detectBlockStart(
    line: string,
    lineIndex: number
  ): { type: string; name?: string } | null {
    const trimmed = line.trim();

    if (
      trimmed.match(
        /^\s*(const|let|var)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*use[A-Z][a-zA-Z]*\s*\(/
      )
    ) {
      return { type: "hook", name: this.extractVariableName(trimmed) };
    }

    if (this.isFunctionLine(trimmed)) {
      return { type: "function", name: this.extractFunctionName(trimmed) };
    }

    if (this.isClassLine(trimmed)) {
      return { type: "class", name: this.extractClassName(trimmed) };
    }

    if (this.isInterfaceLine(trimmed)) {
      return { type: "interface", name: this.extractInterfaceName(trimmed) };
    }

    if (this.isControlStructureLine(trimmed)) {
      return { type: this.extractControlType(trimmed) };
    }

    if (this.isTryCatchLine(trimmed)) {
      return { type: this.extractTryCatchType(trimmed) };
    }

    if (this.isSwitchLine(trimmed)) {
      return { type: "switch" };
    }

    if (this.isOpeningTag(trimmed)) {
      // Replaced isJSXStart with isOpeningTag
      return { type: "jsx", name: this.extractTagName(trimmed) || undefined };
    }

    if (
      trimmed.match(/^\s*(public|private|protected)?\s*ng[A-Z][a-zA-Z]*\s*\(/)
    ) {
      return { type: "angular", name: this.extractAngularMethodName(trimmed) };
    }

    if (this.isObjectArrayLine(trimmed)) {
      return {
        type: trimmed.includes("[") ? "array" : "object",
        name: this.extractVariableName(trimmed),
      };
    }

    return null;
  }

  private isFunctionLine(line: string): boolean {
    const patterns = [
      /^\s*(export\s+)?(default\s+)?(async\s+)?function\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/,
      /^\s*(export\s+)?(const|let|var)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*(async\s+)?\([^)]*\)\s*=>.*\{/,
      /^\s*(export\s+)?(const|let|var)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*(async\s+)?function\s*\(/,
      /^\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\([^)]*\)\s*\{/,
      /^\s*(static\s+)?(?:async\s+)?(?:get\s+|set\s+)?[a-zA-Z_$][a-zA-Z0-9_$]*\s*\([^)]*\)\s*\{/,
      /^\s*(export\s+)?(const|function)\s+[A-Z][a-zA-Z0-9_$]*\s*[=(].*\{/,
    ];
    return patterns.some((pattern) => pattern.test(line));
  }

  private isClassLine(line: string): boolean {
    return /^\s*(export\s+)?(default\s+)?(abstract\s+)?class\s+[A-Z][a-zA-Z0-9_$]*/.test(
      line
    );
  }

  private isInterfaceLine(line: string): boolean {
    return /^\s*(export\s+)?(interface|type)\s+[A-Z][a-zA-Z0-9_$]*/.test(line);
  }

  private isControlStructureLine(line: string): boolean {
    return /^\s*(if|for|while|do)\s*\(/.test(line);
  }

  private isTryCatchLine(line: string): boolean {
    return /^\s*(try|catch|finally)\b/.test(line);
  }

  private isSwitchLine(line: string): boolean {
    return /^\s*switch\s*\(/.test(line);
  }

  private isObjectArrayLine(line: string): boolean {
    const patterns = [
      /^\s*(export\s+)?(?:const|let|var)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*\{\s*$/,
      /^\s*(export\s+)?(?:const|let|var)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*\[\s*$/,
      /^\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*\{\s*$/,
      /^\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*\[\s*$/,
    ];
    return patterns.some((pattern) => pattern.test(line));
  }

  private extractFunctionName(line: string): string {
    const patterns = [
      /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/,
      /^\s*(?:export\s+)?(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/,
      /^\s*(?:async\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/,
      /^\s*(?:static\s+)?(?:async\s+)?(?:get\s+|set\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/,
    ];
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match && match[1]) return match[1];
    }
    return "function";
  }

  private extractClassName(line: string): string {
    const match = line.match(/class\s+([A-Z][a-zA-Z0-9_$]*)/);
    return match?.[1] || "Class";
  }

  private extractInterfaceName(line: string): string {
    const match = line.match(/(interface|type)\s+([A-Z][a-zA-Z0-9_$]*)/);
    return match?.[2] || "Interface";
  }

  private extractControlType(line: string): string {
    const match = line.match(/^\s*(\w+)/);
    return match?.[1] || "block";
  }

  private extractTryCatchType(line: string): string {
    const match = line.match(/^\s*(\w+)/);
    return match?.[1] || "try";
  }

  private extractVariableName(line: string): string {
    const match =
      line.match(
        /^\s*(?:export\s+)?(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/
      ) || line.match(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/);
    return match?.[1] || "variable";
  }

  private extractJSXName(line: string): string {
    const match = line.match(/^\s*<\s*(\w+)/);
    return match?.[1] || "jsx";
  }

  private extractAngularMethodName(line: string): string {
    const match = line.match(
      /^\s*(?:public|private|protected)?\s*(ng[A-Z][a-zA-Z]*)/
    );
    return match?.[1] || "angularMethod";
  }

  private detectPythonBlocks(): CodeBlock[] {
    const blocks: CodeBlock[] = [];
    const stack: Array<{
      line: number;
      type: string;
      name?: string;
      indent: number;
    }> = [];

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const trimmed = line.trim();
      const indent = line.length - line.trimStart().length;

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      if (
        trimmed.match(
          /^(def|class|if|for|while|try|with|elif|else|except|finally)\s/
        )
      ) {
        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
          const block = stack.pop()!;
          if (i > block.line + 1) {
            blocks.push({
              id: `${block.line}-${i - 1}-${
                block.type
              }-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              startLine: block.line,
              endLine: i - 1,
              type: block.type as CodeBlock["type"],
              name: block.name,
            });
          }
        }

        const typeMatch = trimmed.match(/^(\w+)/);
        const nameMatch = trimmed.match(/^(?:def|class)\s+(\w+)/);

        stack.push({
          line: i,
          type: typeMatch?.[1] || "block",
          name: nameMatch?.[1],
          indent,
        });
      }
    }

    while (stack.length > 0) {
      const block = stack.pop()!;
      if (this.lines.length - 1 > block.line + 1) {
        blocks.push({
          id: `${block.line}-${this.lines.length - 1}-${
            block.type
          }-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          startLine: block.line,
          endLine: this.lines.length - 1,
          type: block.type as CodeBlock["type"],
          name: block.name,
        });
      }
    }

    return blocks.sort((a, b) => a.startLine - b.startLine);
  }
}
