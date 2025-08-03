/**
 * UI Components Index
 * Central export file for all base UI components
 */

// Base UI Components - IMPLEMENTED ✅
export { Button, buttonVariants } from './Button';
export type { ButtonProps } from './Button';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './Card';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';

export { Label } from './Label';
export type { LabelProps } from './Label';

export {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from './Modal';

// TODO: Additional Base UI Components (to be implemented)
// export { Dropdown } from './Dropdown';
// export { Tabs } from './Tabs';
// export { Accordion } from './Accordion';
// export { Toast } from './Toast';

// Layout Components - IMPLEMENTED ✅
export { Container } from './Container';
export type { ContainerProps } from './Container';

export { Grid } from './Grid';
export type { GridProps } from './Grid';

// TODO: Additional Layout Components
// export { Stack } from './Stack';
// export { Flex } from './Flex';

// Typography Components - IMPLEMENTED ✅
export { Typography, Heading, Text, Caption } from './Typography';
export type { TypographyProps } from './Typography';

// Animation Components - IMPLEMENTED ✅
export { MotionWrapper, FadeIn, SlideUp, ScaleIn } from './MotionWrapper';
export type { MotionWrapperProps } from './MotionWrapper';

// TODO: Additional Animation Components
// export { PageTransition } from './PageTransition';
// export { HoverCard } from './HoverCard';

// Utility exports
export { cn } from '@/lib/utils/cn'; 