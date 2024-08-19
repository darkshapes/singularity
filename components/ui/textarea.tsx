import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    multiline: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {

    if (props.multiline && props.style) {
      props.style.height = 128
    }

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] shadow-sm w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-muted-foreground focus:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
