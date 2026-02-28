import { X, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function PayModal({ onClose, onSubscribe }: { onClose: () => void, onSubscribe: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white z-10 bg-white/50 dark:bg-black/50 rounded-full backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Free Plan */}
        <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Free Plan</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">For casual users getting started.</p>
          
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            $0 <span className="text-lg font-normal text-gray-500">/mo</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Check className="w-5 h-5 text-gray-400 shrink-0" />
              <span>50 chat messages per day</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Check className="w-5 h-5 text-gray-400 shrink-0" />
              <span>10 free image generations total</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Check className="w-5 h-5 text-gray-400 shrink-0" />
              <span>Standard AI models</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Check className="w-5 h-5 text-gray-400 shrink-0" />
              <span>Basic chat history</span>
            </li>
          </ul>

          <button 
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="flex-1 p-8 md:p-12 bg-gray-50 dark:bg-[#121212] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-black dark:bg-white opacity-5 rounded-bl-full -mr-8 -mt-8" />
          
          <div className="inline-block px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full w-max mb-4 uppercase tracking-wider">
            Pro Plus
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Get Pro Today</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Unlock the full potential of opencry.</p>
          
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            $20.99 <span className="text-lg font-normal text-gray-500">/mo</span>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
              <Check className="w-5 h-5 text-black dark:text-white shrink-0" />
              <span>Unlimited chat messages</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
              <Check className="w-5 h-5 text-black dark:text-white shrink-0" />
              <span>Unlimited image generations</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
              <Check className="w-5 h-5 text-black dark:text-white shrink-0" />
              <span>Access to advanced reasoning models</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
              <Check className="w-5 h-5 text-black dark:text-white shrink-0" />
              <span>Early access to new features</span>
            </li>
          </ul>

          <button 
            onClick={onSubscribe}
            className="w-full py-3 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg shadow-black/10 dark:shadow-white/10"
          >
            Pay Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
