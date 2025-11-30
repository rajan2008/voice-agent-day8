'use client';

import { motion } from 'motion/react';
import { User, Headset } from '@phosphor-icons/react';

interface ChatMessageProps {
  message: string;
  isAgent: boolean;
  timestamp?: Date;
}

export function ChatMessage({ message, isAgent, timestamp }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-4 ${isAgent ? 'justify-start' : 'justify-end'}`}
    >
      {isAgent && (
        <div className="flex-shrink-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Headset className="w-6 h-6 text-white" weight="bold" />
          </div>
        </div>
      )}
      
      <div className={`max-w-[75%] ${isAgent ? '' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-5 py-3 shadow-md ${
            isAgent
              ? 'bg-slate-100 border border-slate-200'
              : 'bg-blue-600 border border-blue-700'
          }`}
        >
          <p className={`text-sm leading-relaxed ${isAgent ? 'text-slate-900' : 'text-white'}`}>{message}</p>
        </div>
        {timestamp && (
          <p className={`text-xs text-slate-500 mt-1.5 px-2 ${isAgent ? 'text-left' : 'text-right'}`}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {!isAgent && (
        <div className="flex-shrink-0 order-2">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-500/20">
            <User className="w-6 h-6 text-white" weight="bold" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
