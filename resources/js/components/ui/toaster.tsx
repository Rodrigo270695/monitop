import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, AlertTriangle, Info, Bell } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const getIcon = () => {
          const baseClasses = "h-5 w-5 flex-shrink-0 mt-0.5"

          switch (props.variant) {
            case 'success':
              return (
                <div className="toast-icon flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className={`${baseClasses} text-emerald-600`} />
                </div>
              )
            case 'destructive':
              return (
                <div className="toast-icon flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className={`${baseClasses} text-red-600`} />
                </div>
              )
            case 'warning':
              return (
                <div className="toast-icon flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <AlertTriangle className={`${baseClasses} text-amber-600`} />
                </div>
              )
            case 'info':
              return (
                <div className="toast-icon flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Info className={`${baseClasses} text-blue-600`} />
                </div>
              )
            default:
              return (
                <div className="toast-icon flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                  <Bell className={`${baseClasses} text-slate-600`} />
                </div>
              )
          }
        }

        return (
          <Toast key={id} {...props}>
            <div className="flex items-start gap-4 w-full pr-8">
              {getIcon()}
              <div className="flex-1 min-w-0">
                {title && (
                  <ToastTitle className="font-medium text-base">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-sm mt-1 leading-relaxed">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
