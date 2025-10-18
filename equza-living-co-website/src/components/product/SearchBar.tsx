'use client';

import { FC, useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/lib/hooks';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'collection' | 'material';
  count?: number;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  loading?: boolean;
  className?: string;
  showSuggestions?: boolean;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  debounceMs?: number;
}

export const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search products, collections, materials...',
  suggestions = [],
  loading = false,
  className = '',
  showSuggestions = true,
  onSuggestionClick,
  debounceMs = 300,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce the search value
  const debouncedValue = useDebounce(value, debounceMs);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (onSearch && debouncedValue !== value) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch, value]);

  // Show suggestions when focused and has value
  useEffect(() => {
    setShowSuggestionsList(
      isFocused && showSuggestions && value.length > 0 && suggestions.length > 0
    );
  }, [isFocused, showSuggestions, value, suggestions]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      setSelectedSuggestionIndex(-1);
    },
    [onChange]
  );

  // Handle input focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // Handle input blur
  const handleBlur = useCallback((e: React.FocusEvent) => {
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setIsFocused(false);
        setShowSuggestionsList(false);
        setSelectedSuggestionIndex(-1);
      }
    }, 150);
  }, []);

  // Handle clear search
  const handleClear = useCallback(() => {
    onChange('');
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  }, [onChange, onSearch]);

  // Handle enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestionsList) {
        if (e.key === 'Enter' && onSearch) {
          onSearch(value);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;

        case 'Enter':
          e.preventDefault();
          if (
            selectedSuggestionIndex >= 0 &&
            selectedSuggestionIndex < suggestions.length
          ) {
            const suggestion = suggestions[selectedSuggestionIndex];
            if (suggestion) {
              handleSuggestionClick(suggestion);
            }
          } else if (onSearch) {
            onSearch(value);
          }
          break;

        case 'Escape':
          e.preventDefault();
          setShowSuggestionsList(false);
          setSelectedSuggestionIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [showSuggestionsList, suggestions, selectedSuggestionIndex, value, onSearch]
  );

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion) => {
      onChange(suggestion.text);
      setShowSuggestionsList(false);
      setSelectedSuggestionIndex(-1);
      inputRef.current?.blur();

      if (onSuggestionClick) {
        onSuggestionClick(suggestion);
      } else if (onSearch) {
        onSearch(suggestion.text);
      }
    },
    [onChange, onSuggestionClick, onSearch]
  );

  // Get suggestion type icon
  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return '🏺';
      case 'collection':
        return '📂';
      case 'material':
        return '🧵';
      default:
        return '🔍';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          {loading ? (
            <Loader2 className='w-5 h-5 text-stone-400 animate-spin' />
          ) : (
            <Search className='w-5 h-5 text-stone-400' />
          )}
        </div>

        <Input
          ref={inputRef}
          type='text'
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className='pl-10 pr-10 h-12 text-lg'
        />

        {value && (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleClear}
              className='h-auto p-1 hover:bg-stone-100'
              aria-label='Clear search'
            >
              <X className='w-4 h-4 text-stone-400 hover:text-stone-600' />
            </Button>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestionsList && (
        <div
          ref={suggestionsRef}
          className='absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto'
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`
                w-full flex items-center justify-between px-4 py-3 text-left hover:bg-stone-50 transition-colors
                ${selectedSuggestionIndex === index ? 'bg-stone-100' : ''}
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === suggestions.length - 1 ? 'rounded-b-lg' : 'border-b border-stone-100'}
              `}
            >
              <div className='flex items-center gap-3'>
                <span className='text-lg'>
                  {getSuggestionIcon(suggestion.type)}
                </span>
                <div>
                  <div className='font-medium text-stone-900'>
                    {suggestion.text}
                  </div>
                  <div className='text-sm text-stone-500 capitalize'>
                    {suggestion.type}
                  </div>
                </div>
              </div>
              {suggestion.count !== undefined && (
                <span className='text-sm text-stone-400'>
                  {suggestion.count} {suggestion.count === 1 ? 'item' : 'items'}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

SearchBar.displayName = 'SearchBar';
