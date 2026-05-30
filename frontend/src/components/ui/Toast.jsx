import { AnimatePresence, motion } from 'framer-motion'
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiX } from 'react-icons/hi'
import { useToast } from '../../context/ToastContext'

const icons = {
  success: HiCheckCircle,
  error: HiExclamationCircle,
  info: HiInformationCircle,
}

const colors = {
  success: 'bg-brand-600',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

export default function Toast() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = icons[toast.type] || icons.info
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="flex items-center gap-3 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3"
            >
              <div className={`w-8 h-8 ${colors[toast.type]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-800 flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="p-1 hover:bg-gray-100 rounded-lg">
                <HiX className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
