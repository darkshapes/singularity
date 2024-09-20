import React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  multiline?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, multiline = false, ...props }, ref) => {
    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = event.target;
      if (multiline) {
        // Reset height to auto so that it can shrink as well
        textarea.style.height = "auto";

        // Set height based on scroll height to expand the textarea
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!multiline && event.key === "Enter") {
        event.preventDefault(); // Prevent newline in single-line mode
      }
    };

    return (
      <textarea
        className={cn(
          "flex shadow-sm w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-muted-foreground focus:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        rows={multiline ? 3 : 1} // Default to 3 rows for multiline, 1 for single-line
        onInput={multiline ? handleInput : undefined}
        onKeyPress={handleKeyDown} // i have no earthy idea why onKeyDown doesn't fire but it doesn't /shrug
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };