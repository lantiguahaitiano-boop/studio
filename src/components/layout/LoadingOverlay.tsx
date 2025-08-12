'use client';

import { useLoading } from '@/hooks/use-loading';
import { LearnProLogo } from '@/components/icons/LearnProLogo';
import { AnimatePresence, motion } from 'framer-motion';

export function LoadingOverlay() {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
                <div className="absolute inset-0 h-full w-full animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                <LearnProLogo className="h-16 w-16 p-3 text-primary" />
            </div>
            <p className="text-lg font-semibold text-muted-foreground animate-pulse">Cargando...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
