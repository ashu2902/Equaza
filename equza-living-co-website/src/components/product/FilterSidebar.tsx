'use client';

import { FC, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductFilters } from '@/types';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterSection {
  id: keyof ProductFilters;
  label: string;
  type: 'select' | 'multiselect' | 'toggle';
  options: FilterOption[];
  defaultExpanded?: boolean;
}

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  collections?: FilterOption[];
  materials?: FilterOption[];
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

const filterSections: (collections: FilterOption[], materials: FilterOption[]) => FilterSection[] = (
  collections,
  materials
) => [
  {
    id: 'collectionId',
    label: 'Collections',
    type: 'select',
    options: collections,
    defaultExpanded: true
  },
  // roomTypes removed
  {
    id: 'materials',
    label: 'Materials',
    type: 'multiselect',
    options: materials,
    defaultExpanded: false
  },
  {
    id: 'isFeatured',
    label: 'Featured',
    type: 'toggle',
    options: [{ id: 'true', label: 'Featured Products Only' }],
    defaultExpanded: false
  }
];

export const FilterSidebar: FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  collections = [],
  materials = [],
  className = '',
  isMobile = false,
  onClose
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['collectionId'])
  );

  const sections = filterSections(collections, materials);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId);
      } else {
        newExpanded.add(sectionId);
      }
      return newExpanded;
    });
  }, []);

  const handleFilterChange = useCallback((
    sectionId: keyof ProductFilters,
    value: string,
    type: 'select' | 'multiselect' | 'toggle'
  ) => {
    const newFilters = { ...filters };

    switch (type) {
      case 'select':
        if (sectionId === 'collectionId') {
          newFilters[sectionId] = newFilters[sectionId] === value ? undefined : value;
        }
        break;

      case 'multiselect':
        if (sectionId === 'materials') {
          const currentMaterials = newFilters.materials || [];
          if (currentMaterials.includes(value)) {
            newFilters.materials = currentMaterials.filter(m => m !== value);
          } else {
            newFilters.materials = [...currentMaterials, value];
          }
          if (newFilters.materials.length === 0) {
            delete newFilters.materials;
          }
        }
        break;

      case 'toggle':
        if (sectionId === 'isFeatured') {
          newFilters.isFeatured = newFilters.isFeatured ? undefined : true;
        }
        break;
    }

    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  const clearAllFilters = useCallback(() => {
    onFiltersChange({});
  }, [onFiltersChange]);

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof ProductFilters];
    return value !== undefined && value !== null && 
           (Array.isArray(value) ? value.length > 0 : true);
  });

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.collectionId) count++;
    // roomTypes removed
    if (filters.materials?.length) count++;
    if (filters.isFeatured) count++;
    return count;
  };

  const renderFilterSection = (section: FilterSection) => {
    const isExpanded = expandedSections.has(section.id);

    return (
      <Card key={section.id} className="border border-stone-200">
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50 transition-colors"
        >
          <Typography
            variant="body1"
            className="font-medium text-stone-900"
          >
            {section.label}
          </Typography>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-stone-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-600" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-2">
                {section.options.map((option) => {
                  const isSelected = (() => {
                    switch (section.type) {
                      case 'select':
                        return filters[section.id] === option.id;
                      case 'multiselect':
                        const materials = filters.materials || [];
                        return materials.includes(option.id);
                      case 'toggle':
                        return filters.isFeatured === true;
                      default:
                        return false;
                    }
                  })();

                  return (
                    <label
                      key={option.id}
                      className="flex items-center justify-between cursor-pointer group hover:bg-stone-50 rounded-lg p-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type={section.type === 'multiselect' ? 'checkbox' : 'radio'}
                          name={section.id}
                          value={option.id}
                          checked={isSelected}
                          onChange={() => handleFilterChange(section.id, option.id, section.type)}
                          className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500 focus:ring-2"
                        />
                        <Typography
                          variant="body2"
                          className={`transition-colors ${
                            isSelected ? 'text-stone-900 font-medium' : 'text-stone-600 group-hover:text-stone-900'
                          }`}
                        >
                          {option.label}
                        </Typography>
                      </div>
                      {option.count !== undefined && (
                        <Typography
                          variant="caption"
                          className="text-stone-500"
                        >
                          {option.count}
                        </Typography>
                      )}
                    </label>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  };

  const sidebarContent = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-stone-600" />
          <Typography
            variant="h4"
            className="font-serif text-stone-900"
          >
            Filters
          </Typography>
          {hasActiveFilters && (
            <span className="bg-stone-900 text-white text-xs px-2 py-0.5 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        {isMobile && onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}

      {/* Filter Sections */}
      <div className="space-y-3">
        {sections.map(renderFilterSection)}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Card className="p-4 bg-stone-50 border-stone-200">
          <Typography
            variant="body2"
            className="font-medium text-stone-900 mb-2"
          >
            Active Filters:
          </Typography>
          <div className="space-y-1">
            {filters.collectionId && (
              <div className="flex items-center justify-between">
                <Typography variant="caption" className="text-stone-600">
                  Collection: {collections.find(c => c.id === filters.collectionId)?.label}
                </Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange('collectionId', filters.collectionId!, 'select')}
                  className="h-auto p-1"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {/* roomTypes removed */}
            {filters.materials?.map((materialId) => {
              const material = materials.find(m => m.id === materialId);
              return material ? (
                <div key={materialId} className="flex items-center justify-between">
                  <Typography variant="caption" className="text-stone-600">
                    Material: {material.label}
                  </Typography>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange('materials', materialId, 'multiselect')}
                    className="h-auto p-1"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : null;
            })}
            {filters.isFeatured && (
              <div className="flex items-center justify-between">
                <Typography variant="caption" className="text-stone-600">
                  Featured products only
                </Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange('isFeatured', 'true', 'toggle')}
                  className="h-auto p-1"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className={`${className}`}>
        {sidebarContent}
      </div>
    );
  }

  return (
    <div className={`sticky top-6 ${className}`}>
      {sidebarContent}
    </div>
  );
};

FilterSidebar.displayName = 'FilterSidebar';