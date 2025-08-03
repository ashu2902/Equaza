'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Package, Ruler, MapPin, Clock, Palette } from 'lucide-react';
import { ProductSpecifications } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

interface ProductSpecsProps {
  specifications: ProductSpecifications;
  className?: string;
  layout?: 'grid' | 'list';
  showIcons?: boolean;
}

interface SpecItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | string[];
  showIcon?: boolean;
}

const SpecItem: FC<SpecItemProps> = ({ icon, label, value, showIcon = true }) => {
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 p-4 rounded-lg border border-stone-200 hover:border-stone-300 transition-colors"
    >
      {showIcon && (
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 text-stone-600">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <Typography
          variant="body2"
          className="font-medium text-stone-900 mb-1"
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          className="text-stone-600 break-words"
        >
          {displayValue}
        </Typography>
      </div>
    </motion.div>
  );
};

export const ProductSpecs: FC<ProductSpecsProps> = ({
  specifications,
  className = '',
  layout = 'grid',
  showIcons = true
}) => {
  const specs = [
    {
      icon: <Palette className="w-4 h-4" />,
      label: 'Materials',
      value: specifications.materials,
      key: 'materials'
    },
    {
      icon: <Package className="w-4 h-4" />,
      label: 'Weave Type',
      value: specifications.weaveType,
      key: 'weaveType'
    },
    {
      icon: <Ruler className="w-4 h-4" />,
      label: 'Available Sizes',
      value: specifications.availableSizes.map(size => 
        size.isCustom ? `${size.dimensions} (Custom)` : size.dimensions
      ),
      key: 'sizes'
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: 'Origin',
      value: specifications.origin,
      key: 'origin'
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: 'Craft Time',
      value: specifications.craftTime,
      key: 'craftTime'
    }
  ];

  // Filter out empty specifications
  const validSpecs = specs.filter(spec => {
    if (Array.isArray(spec.value)) {
      return spec.value.length > 0;
    }
    return spec.value && spec.value.trim() !== '';
  });

  if (validSpecs.length === 0) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <Typography
          variant="body1"
          className="text-stone-500"
        >
          Specifications not available
        </Typography>
      </Card>
    );
  }

  const gridCols = layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
    : 'space-y-4';

  return (
    <div className={className}>
      <div className="mb-6">
        <Typography
          variant="h3"
          className="font-serif text-stone-900 mb-2"
        >
          Specifications
        </Typography>
        <Typography
          variant="body1"
          className="text-stone-600"
        >
          Detailed information about this handcrafted piece
        </Typography>
      </div>

      <div className={gridCols}>
        {validSpecs.map((spec) => (
          <SpecItem
            key={spec.key}
            icon={spec.icon}
            label={spec.label}
            value={spec.value}
            showIcon={showIcons}
          />
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-8 p-4 bg-stone-50 rounded-lg">
        <Typography
          variant="body2"
          className="text-stone-600 text-center"
        >
          All our pieces are handcrafted and may have slight variations that add to their unique character.
          Custom sizes and materials may be available upon request.
        </Typography>
      </div>
    </div>
  );
};

ProductSpecs.displayName = 'ProductSpecs';