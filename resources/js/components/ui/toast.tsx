import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[9999] flex max-h-screen w-full flex-col-reverse p-4 md:max-w-[420px] md:top-8 md:right-8 md:flex-col",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-300 ease-out data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full shadow-2xl",
  {
    variants: {
      variant: {
        default: "border-slate-200/50 bg-white/95 text-slate-900 shadow-slate-900/10",
        destructive: "border-red-200/50 bg-red-50/95 text-red-900 shadow-red-900/20",
        success: "border-emerald-200/50 bg-gradient-to-br from-emerald-50/95 to-emerald-100/95 text-emerald-900 shadow-emerald-900/20",
        warning: "border-amber-200/50 bg-gradient-to-br from-amber-50/95 to-amber-100/95 text-amber-900 shadow-amber-900/20",
        info: "border-blue-200/50 bg-gradient-to-br from-blue-50/95 to-blue-100/95 text-blue-900 shadow-blue-900/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), "p-6 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2", className)}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      data-variant={variant}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-full p-2 text-slate-400 opacity-70 transition-all duration-200 hover:opacity-100 hover:bg-slate-100/80 hover:text-slate-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1 group-hover:opacity-100 active:scale-95",
      "group-[.destructive]:text-red-400 group-[.destructive]:hover:bg-red-100/80 group-[.destructive]:hover:text-red-600 group-[.destructive]:focus:ring-red-300",
      "group-[.success]:text-emerald-400 group-[.success]:hover:bg-emerald-100/80 group-[.success]:hover:text-emerald-600 group-[.success]:focus:ring-emerald-300",
      "group-[.warning]:text-amber-400 group-[.warning]:hover:bg-amber-100/80 group-[.warning]:hover:text-amber-600 group-[.warning]:focus:ring-amber-300",
      "group-[.info]:text-blue-400 group-[.info]:hover:bg-blue-100/80 group-[.info]:hover:text-blue-600 group-[.info]:focus:ring-blue-300",
      className
    )}
    toast-close=""
    aria-label="Cerrar notificación"
    {...props}
  >
    <X className="h-4 w-4" aria-hidden="true" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-tight tracking-tight", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-80 leading-relaxed mt-1", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
