'use client';

import { FC, useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { ProductImage } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal, ModalContent } from '@/components/ui/Modal';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export const ImageGallery: FC<ImageGalleryProps> = ({
  images,
  productName,
  className = ''
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Sort images by main first, then by sortOrder
  const sortedImages = [...images].sort((a, b) => {
    if (a.isMain && !b.isMain) return -1;
    if (!a.isMain && b.isMain) return 1;
    return a.sortOrder - b.sortOrder;
  });

  const currentImage = sortedImages[selectedIndex];

  // Handle thumbnail selection
  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsZoomed(false);
  }, []);

  // Handle navigation
  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => 
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
    setIsZoomed(false);
  }, [sortedImages.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => 
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
    setIsZoomed(false);
  }, [sortedImages.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          e.preventDefault();
          setIsModalOpen(false);
          setIsZoomed(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, goToPrevious, goToNext]);

  // Handle mouse move for zoom
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)) 
    });
  }, [isZoomed]);

  // Toggle zoom
  const toggleZoom = useCallback(() => {
    setIsZoomed(!isZoomed);
  }, [isZoomed]);

  // Open modal
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsZoomed(false);
  }, []);

  if (!sortedImages.length) {
    return (
      <div className={`bg-stone-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-stone-200 rounded-lg" />
          <p className="text-stone-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative group">
        <div 
          ref={imageRef}
          className="relative aspect-square overflow-hidden rounded-lg bg-stone-50 cursor-zoom-in"
          onClick={openModal}
          onMouseMove={handleMouseMove}
        >
          {currentImage && (
            <Image
              src={currentImage.url}
              alt={currentImage.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          
          {/* Zoom Indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg">
              <ZoomIn className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Navigation Arrows for Main Image */}
        {sortedImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sortedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`
                relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                ${selectedIndex === index 
                  ? 'border-stone-900 ring-2 ring-stone-900/20' 
                  : 'border-stone-200 hover:border-stone-300'
                }
              `}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="64px"
              />
              {image.isMain && (
                <div className="absolute top-1 left-1">
                  <span className="bg-stone-900 text-white text-xs px-1 rounded">
                    Main
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {sortedImages.length > 1 && (
        <div className="text-center">
          <span className="text-sm text-stone-500">
            {selectedIndex + 1} of {sortedImages.length}
          </span>
        </div>
      )}

      {/* Full Screen Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <ModalContent
          className="max-w-7xl"
          showCloseButton={false}
          onClose={closeModal}
        >
        <div className="relative">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-lg font-semibold">{productName}</h3>
              <p className="text-sm text-stone-500">
                Image {selectedIndex + 1} of {sortedImages.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleZoom}
                aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                aria-label="Close gallery"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Modal Image */}
          <div className="relative">
            <div 
              className={`
                relative h-[70vh] overflow-hidden cursor-${isZoomed ? 'zoom-out' : 'zoom-in'}
              `}
              onClick={toggleZoom}
              onMouseMove={handleMouseMove}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  {currentImage && (
                    <Image
                      src={currentImage.url}
                      alt={currentImage.alt}
                      fill
                      className={`
                        object-contain transition-transform duration-300
                        ${isZoomed ? 'scale-200' : 'scale-100'}
                      `}
                      style={isZoomed ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                      } : undefined}
                      sizes="100vw"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Modal Navigation */}
            {sortedImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>

          {/* Modal Thumbnails */}
          {sortedImages.length > 1 && (
            <div className="p-4 border-t">
              <div className="flex gap-2 justify-center overflow-x-auto">
                {sortedImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`
                      relative flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all
                      ${selectedIndex === index 
                        ? 'border-stone-900' 
                        : 'border-stone-200 hover:border-stone-300'
                      }
                    `}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

ImageGallery.displayName = 'ImageGallery';