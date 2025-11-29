'use client';

import { motion } from 'motion/react';
import { User, Sparkle } from '@phosphor-icons/react';

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
      className={`flex gap-3 mb-4 ${isAgent ? 'justify-start' : 'justify-end'}`}
    >
      {isAgent && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkle className="w-6 h-6 text-white" weight="fill" />
          </div>
        </div>
      )}
      
      <div className={`max-w-[70%] ${isAgent ? '' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isAgent
              ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20'
              : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20'
          }`}
        >
          <p className="text-sm text-foreground">{message}</p>
        </div>
        {timestamp && (
          <p className="text-xs text-muted-foreground mt-1 px-2">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {!isAgent && (
        <div className="flex-shrink-0 order-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" weight="fill" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
