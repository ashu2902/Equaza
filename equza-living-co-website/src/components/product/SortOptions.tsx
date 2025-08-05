'use client';

import { FC, useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

export type SortOption = 
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'featured'
  | 'newest'
  | 'oldest';

interface SortConfig {
  id: SortOption;
  label: string;
  description?: string;
}

interface SortOptionsProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  options?: SortConfig[];
  className?: string;
  variant?: 'dropdown' | 'buttons';
  showLabel?: boolean;
  disabled?: boolean;
}

const defaultSortOptions: SortConfig[] = [
  {
    id: 'featured',
    label: 'Featured',
    description: 'Our curated selection'
  },
  {
    id: 'name-asc',
    label: 'Name A-Z',
    description: 'Alphabetical order'
  },
  {
    id: 'name-desc',
    label: 'Name Z-A',
    description: 'Reverse alphabetical'
  },
  {
    id: 'price-asc',
    label: 'Price: Low to High',
    description: 'Lowest price first'
  },
  {
    id: 'price-desc',
    label: 'Price: High to Low',
    description: 'Highest price first'
  },
  {
    id: 'newest',
    label: 'Newest First',
    description: 'Recently added'
  },
  {
    id: 'oldest',
    label: 'Oldest First',
    description: 'Classic pieces'
  }
];

export const SortOptions: FC<SortOptionsProps> = ({
  value,
  onChange,
  options = defaultSortOptions,
  className = '',
  variant = 'dropdown',
  showLabel = true,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentOption = options.find(option => option.id === value) || options[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex(option => option.id === value);
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          const nextOption = options[nextIndex];
          if (nextOption) {
            onChange(nextOption.id);
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex(option => option.id === value);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          const prevOption = options[prevIndex];
          if (prevOption) {
            onChange(prevOption.id);
          }
        }
        break;
    }
  }, [disabled, isOpen, value, onChange, options]);

  const handleOptionSelect = useCallback((optionId: SortOption) => {
    onChange(optionId);
    setIsOpen(false);
    buttonRef.current?.focus();
  }, [onChange]);

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {showLabel && (
          <Typography
            variant="body2"
            className="font-medium text-stone-900 self-center mr-2"
          >
            Sort by:
          </Typography>
        )}
        {options.map((option) => (
          <Button
            key={option.id}
            variant={value === option.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(option.id)}
            disabled={disabled}
            className="transition-all"
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {showLabel && (
        <Typography
          variant="body2"
          className="font-medium text-stone-900 mb-2"
        >
          Sort by:
        </Typography>
      )}
      
      {/* Dropdown Button */}
      <Button
        ref={buttonRef}
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full justify-between h-12 px-4
          ${isOpen ? 'ring-2 ring-stone-900/20' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="sort-label"
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-stone-600" />
          <span>{currentOption?.label || 'Sort by'}</span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-stone-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-50 overflow-hidden"
            role="listbox"
            aria-labelledby="sort-label"
          >
            {options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-left transition-colors
                  hover:bg-stone-50 focus:bg-stone-50 focus:outline-none
                  ${value === option.id ? 'bg-stone-100' : ''}
                  ${index === options.length - 1 ? '' : 'border-b border-stone-100'}
                `}
                role="option"
                aria-selected={value === option.id}
              >
                <div>
                  <Typography
                    variant="body2"
                    className={`font-medium ${
                      value === option.id ? 'text-stone-900' : 'text-stone-700'
                    }`}
                  >
                    {option.label}
                  </Typography>
                  {option.description && (
                    <Typography
                      variant="caption"
                      className="text-stone-500 mt-0.5"
                    >
                      {option.description}
                    </Typography>
                  )}
                </div>
                {value === option.id && (
                  <Check className="w-4 h-4 text-stone-900" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

SortOptions.displayName = 'SortOptions';