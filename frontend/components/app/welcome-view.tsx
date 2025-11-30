'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/livekit/button';
import { ShoppingBag, Phone, CreditCard, Package } from '@phosphor-icons/react';

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref} className="bg-white h-full w-full overflow-auto">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 relative">
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30"
        />

        {/* Animated Shopping Bag Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative mb-8 z-10"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 blur-2xl opacity-40"
          />
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30"
          >
            <ShoppingBag className="w-16 h-16 text-white" weight="fill" />
          </motion.div>
        </motion.div>

        {/* Title with Letter Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-6xl font-bold text-slate-900 z-10"
        >
          <motion.span
            animate={{ color: ['#1e40af', '#4f46e5', '#1e40af'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Voice Shopping Store
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-600 max-w-2xl mb-4 text-2xl font-light z-10"
        >
          Shop with Your Voice
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 max-w-xl mb-12 text-lg z-10"
        >
          Experience the future of online shopping with our AI-powered voice assistant. Browse products, add to cart, and checkout - all hands-free!
        </motion.p>

        {/* Connect Button with Pulse Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="relative z-10"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-blue-500 blur-xl"
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onStartCall}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-16 py-8 text-xl rounded-full shadow-2xl shadow-blue-500/50 transition-all duration-300"
            >
              <motion.span
                className="relative z-10 flex items-center gap-3"
                animate={{
                  x: [0, 2, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Phone size={28} weight="bold" />
                </motion.div>
                {startButtonText}
              </motion.span>
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid with Stagger Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl z-10"
        >
          {/* Feature 1 */}
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/20 transition-all"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4 mx-auto shadow-lg"
            >
              <Phone className="w-8 h-8 text-white" weight="bold" />
            </motion.div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">Voice Shopping</h3>
            <p className="text-slate-600">
              Browse and buy products using natural voice commands. No typing required!
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white border-2 border-indigo-200 rounded-2xl p-8 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/20 transition-all"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-4 mx-auto shadow-lg"
            >
              <CreditCard className="w-8 h-8 text-white" weight="bold" />
            </motion.div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">Easy Checkout</h3>
            <p className="text-slate-600">
              Complete your purchase with simple voice confirmation. Fast and secure!
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/20 transition-all"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4 mx-auto shadow-lg"
            >
              <Package className="w-8 h-8 text-white" weight="bold" />
            </motion.div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">Track Orders</h3>
            <p className="text-slate-600">
              View your order history and track deliveries with voice queries.
            </p>
          </motion.div>
        </motion.div>

        {/* Stats with Counter Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16 flex flex-wrap justify-center gap-12 text-center z-10"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="bg-blue-50 rounded-2xl px-8 py-6 border-2 border-blue-200"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl font-bold text-blue-600 mb-2"
            >
              100+
            </motion.div>
            <div className="text-slate-600 text-sm font-medium">Products Available</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="bg-indigo-50 rounded-2xl px-8 py-6 border-2 border-indigo-200"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="text-4xl font-bold text-indigo-600 mb-2"
            >
              24/7
            </motion.div>
            <div className="text-slate-600 text-sm font-medium">Voice Assistant</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="bg-blue-50 rounded-2xl px-8 py-6 border-2 border-blue-200"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              className="text-4xl font-bold text-blue-600 mb-2"
            >
              Fast
            </motion.div>
            <div className="text-slate-600 text-sm font-medium">Delivery</div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};
