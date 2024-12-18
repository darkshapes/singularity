import { Toaster as ToasterPrimitive } from "sonner"

type ToasterProps = React.ComponentProps<typeof ToasterPrimitive>

export const Toaster = ({ ...props }: ToasterProps) => {
  // const { theme = "system" } = useTheme()

  return (
    <ToasterPrimitive
      // theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        duration: 2500,
      }}
      {...props}
    />
  )
};
