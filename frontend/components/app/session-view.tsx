'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { AppConfig } from '@/app-config';
import {
  AgentControlBar,
  type ControlBarControls,
} from '@/components/livekit/agent-control-bar/agent-control-bar';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useConnectionTimeout } from '@/hooks/useConnectionTimout';
import { useDebugMode } from '@/hooks/useDebug';
import { ScrollArea } from '../livekit/scroll-area/scroll-area';
import { VoiceVisualizer } from './voice-visualizer';
import { ChatMessage } from './chat-message';
import { cn } from '@/lib/utils';
import { useChat } from '@livekit/components-react';

const MotionBottom = motion.create('div');

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const BOTTOM_VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
      translateY: '0%',
    },
    hidden: {
      opacity: 0,
      translateY: '100%',
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.3,
    delay: 0.5,
    ease: 'easeOut',
  },
};

interface FadeProps {
  top?: boolean;
  bottom?: boolean;
  className?: string;
}

export function Fade({ top = false, bottom = false, className }: FadeProps) {
  return (
    <div
      className={cn(
        'from-background pointer-events-none h-4 bg-linear-to-b to-transparent',
        top && 'bg-linear-to-b',
        bottom && 'bg-linear-to-t',
        className
      )}
    />
  );
}
interface SessionViewProps {
  appConfig: AppConfig;
}

export const SessionView = ({
  appConfig,
  ...props
}: React.ComponentProps<'section'> & SessionViewProps) => {
  useConnectionTimeout(200_000);
  useDebugMode({ enabled: IN_DEVELOPMENT });

  const messages = useChatMessages();
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [textInput, setTextInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { send: sendChat } = useChat();

  const controls: ControlBarControls = {
    leave: true,
    microphone: true,
    chat: false,
    camera: false,
    screenShare: false,
  };

  const handleSendText = () => {
    if (textInput.trim()) {
      sendChat(textInput);
      setTextInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  useEffect(() => {
    const lastMessage = messages.at(-1);
    const lastMessageIsLocal = lastMessage?.from?.isLocal === true;

    if (scrollAreaRef.current && lastMessageIsLocal) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }

    // Detect speaking
    if (lastMessage) {
      if (lastMessageIsLocal) {
        setUserSpeaking(true);
        setTimeout(() => setUserSpeaking(false), 2000);
      } else {
        setAgentSpeaking(true);
        setTimeout(() => setAgentSpeaking(false), 2000);
      }
    }
  }, [messages]);

  return (
    <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative z-10 h-full w-full overflow-hidden flex flex-col" {...props}>
      {/* Voice Visualizers with Mic in Center */}
      <div className="relative px-8 py-8 border-b border-slate-800">
        <div className="flex items-center justify-center gap-4">
          {/* Agent Wave - Left */}
          <div className="flex-1">
            <p className="text-xs text-slate-400 mb-3 text-center">Agent Speaking</p>
            <VoiceVisualizer isActive={agentSpeaking} side="left" />
          </div>

          {/* Center Mic Button with Animated Rings */}
          <div className="flex flex-col items-center gap-4 px-8">
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Constant outer glow - always visible, no animation */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.15) 50%, transparent 70%)',
                  filter: 'blur(30px)',
                }}
              />
              
              {/* Animated gradient rings - only when speaking */}
              {(agentSpeaking || userSpeaking) && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: agentSpeaking
                        ? 'conic-gradient(from 0deg, rgba(236, 72, 153, 0.5), rgba(139, 92, 246, 0.5), rgba(59, 130, 246, 0.5), rgba(34, 211, 238, 0.5), rgba(236, 72, 153, 0.5))'
                        : 'conic-gradient(from 0deg, rgba(34, 211, 238, 0.5), rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5), rgba(236, 72, 153, 0.5), rgba(34, 211, 238, 0.5))',
                      filter: 'blur(25px)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-6 rounded-full"
                    style={{
                      background: agentSpeaking
                        ? 'conic-gradient(from 180deg, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.4), rgba(251, 146, 60, 0.4), rgba(139, 92, 246, 0.4))'
                        : 'conic-gradient(from 180deg, rgba(59, 130, 246, 0.4), rgba(34, 211, 238, 0.4), rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.4))',
                      filter: 'blur(20px)',
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-12 rounded-full"
                    style={{
                      background: agentSpeaking
                        ? 'conic-gradient(from 90deg, rgba(251, 146, 60, 0.3), rgba(236, 72, 153, 0.3), rgba(139, 92, 246, 0.3), rgba(251, 146, 60, 0.3))'
                        : 'conic-gradient(from 90deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))',
                      filter: 'blur(15px)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  />
                </>
              )}
              
              {/* Mic button - no pulsing animation */}
              <button
                className="relative w-36 h-36 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-4 border-slate-700/50 shadow-2xl overflow-hidden"
              >
                {/* Inner glow - constant */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20" />
                
                {/* Mic icon */}
                <svg className="relative w-16 h-16 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-slate-300 font-medium">
              {agentSpeaking ? '🎧 Agent Speaking...' : userSpeaking ? '🎤 You Speaking...' : '⚡ Ready to Talk'}
            </p>
          </div>

          {/* User Wave - Right */}
          <div className="flex-1">
            <p className="text-xs text-slate-400 mb-3 text-center">You Speaking</p>
            <VoiceVisualizer isActive={userSpeaking} side="right" />
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 py-6">
        <div className="mx-auto max-w-4xl">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.message}
              isAgent={!msg.from?.isLocal}
              timestamp={new Date(msg.timestamp)}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Bottom Control Bar with Text Input */}
      <MotionBottom
        {...BOTTOM_VIEW_MOTION_PROPS}
        className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm"
      >
        <div className="relative mx-auto max-w-4xl px-6 py-4">
          {/* Text Input Box */}
          <div className="mb-3 flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice..."
              className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSendText}
              disabled={!textInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Send
            </button>
          </div>
          
          {/* Voice Controls */}
          <div className="flex justify-center">
            <AgentControlBar controls={controls} />
          </div>
        </div>
      </MotionBottom>
    </section>
  );
};
