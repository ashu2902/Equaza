'use client';

import { FC, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collection } from '@/types';
import { Typography } from '@/components/ui/Typography';

interface CollectionTabsProps {
  collections: Collection[];
  activeType: 'style' | 'space' | 'all';
  onTypeChange: (type: 'style' | 'space' | 'all') => void;
  className?: string;
  showCounts?: boolean;
}

interface TabConfig {
  id: 'all' | 'style' | 'space';
  label: string;
  description: string;
  icon: string;
}

const tabs: TabConfig[] = [
  {
    id: 'all',
    label: 'All Collections',
    description: 'Browse all our curated collections',
    icon: '🏺',
  },
  {
    id: 'style',
    label: 'Style Collections',
    description: 'Collections organized by design aesthetic',
    icon: '🎨',
  },
  {
    id: 'space',
    label: 'Space Collections',
    description: 'Collections organized by room and function',
    icon: '🏠',
  },
];

export const CollectionTabs: FC<CollectionTabsProps> = ({
  collections,
  activeType,
  onTypeChange,
  className = '',
  showCounts = true,
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const getCounts = useCallback(() => {
    const styleCounts = collections.filter((c) => c.type === 'style').length;
    const spaceCounts = collections.filter((c) => c.type === 'space').length;

    return {
      all: collections.length,
      style: styleCounts,
      space: spaceCounts,
    };
  }, [collections]);

  const counts = getCounts();

  const handleTabClick = useCallback(
    (tabId: 'all' | 'style' | 'space') => {
      onTypeChange(tabId);
    },
    [onTypeChange]
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Navigation */}
      <div className='relative'>
        <div className='flex flex-col md:flex-row gap-2 md:gap-0 md:border-b border-stone-200'>
          {tabs.map((tab) => {
            const isActive = activeType === tab.id;
            const isHovered = hoveredTab === tab.id;
            const count = counts[tab.id];

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`
                  relative flex flex-col md:flex-row items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 
                  font-medium text-sm md:text-base transition-all duration-200 rounded-lg md:rounded-none
                  ${
                    isActive
                      ? 'text-stone-900 bg-stone-50 md:bg-transparent'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 md:hover:bg-transparent'
                  }
                `}
              >
                {/* Icon */}
                <span className='text-xl md:text-lg'>{tab.icon}</span>

                {/* Content */}
                <div className='flex flex-col md:flex-row items-center gap-1 md:gap-2'>
                  <span className='whitespace-nowrap'>{tab.label}</span>
                  {showCounts && count > 0 && (
                    <span
                      className={`
                      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${
                        isActive
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-200 text-stone-600'
                      }
                    `}
                    >
                      {count}
                    </span>
                  )}
                </div>

                {/* Active Indicator for Desktop */}
                {isActive && (
                  <motion.div
                    layoutId='activeTab'
                    className='hidden md:block absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900'
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Hover Effect */}
                {isHovered && !isActive && (
                  <motion.div
                    className='hidden md:block absolute bottom-0 left-0 right-0 h-0.5 bg-stone-300'
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Description */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeType}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className='text-center space-y-2'
        >
          <Typography variant='body1' className='text-stone-600'>
            {tabs.find((tab) => tab.id === activeType)?.description}
          </Typography>

          {/* Collection Summary */}
          {showCounts && (
            <div className='flex justify-center gap-6 text-sm text-stone-500'>
              {activeType === 'all' && (
                <>
                  <span>{counts.style} Style Collections</span>
                  <span>•</span>
                  <span>{counts.space} Space Collections</span>
                </>
              )}
              {activeType === 'style' && (
                <span>{counts.style} Style Collections</span>
              )}
              {activeType === 'space' && (
                <span>{counts.space} Space Collections</span>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Mobile Tab Indicator */}
      <div className='md:hidden flex justify-center'>
        <div className='flex gap-2'>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`
                w-2 h-2 rounded-full transition-colors
                ${activeType === tab.id ? 'bg-stone-900' : 'bg-stone-300'}
              `}
            />
          ))}
        </div>
      </div>

      {/* Filter Summary */}
      {activeType !== 'all' && collections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-stone-50 rounded-lg p-4 border border-stone-200'
        >
          <div className='flex items-center justify-center gap-3'>
            <span className='text-2xl'>
              {tabs.find((tab) => tab.id === activeType)?.icon}
            </span>
            <Typography variant='body2' className='text-stone-700 text-center'>
              Showing {activeType} collections only.
              <button
                onClick={() => handleTabClick('all')}
                className='ml-1 text-stone-900 font-medium hover:underline'
              >
                View all collections
              </button>
            </Typography>
          </div>
        </motion.div>
      )}
    </div>
  );
};

CollectionTabs.displayName = 'CollectionTabs';
