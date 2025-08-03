/**
 * Component Showcase
 * A demonstration component showcasing all available UI components
 */

'use client';

import React, { useState } from 'react';

import { ArrowRight, Mail, Search, Star } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Grid,
  Input,
  Label,
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  Textarea,
  Typography,
  Heading,
  Text,
  Caption,
  FadeIn,
  SlideUp,
  ScaleIn,
} from '@/components/ui';

const ComponentShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container size="lg" className="py-16 space-y-16">
      {/* Typography Section */}
      <FadeIn>
        <section className="space-y-8">
          <Heading level={1}>UI Component Showcase</Heading>
          <Text>
            This showcase demonstrates all available UI components in the Equza
            Living Co. design system.
          </Text>

          <div className="space-y-4">
            <Typography variant="h2">Typography System</Typography>
            <div className="space-y-3">
              <Heading level={1}>Heading Level 1</Heading>
              <Heading level={2}>Heading Level 2</Heading>
              <Heading level={3}>Heading Level 3</Heading>
              <Text size="lg">Large body text for emphasis</Text>
              <Text>Regular body text for content</Text>
              <Text size="sm">Small body text for secondary content</Text>
              <Caption>Caption text for metadata</Caption>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Button Section */}
      <SlideUp delay={0.1}>
        <section className="space-y-8">
          <Typography variant="h2">Buttons</Typography>
          <Grid cols={3} gap="md">
            <div className="space-y-4">
              <Typography variant="h3">Variants</Typography>
              <div className="space-y-2">
                <Button className="w-full">Default</Button>
                <Button variant="secondary" className="w-full">
                  Secondary
                </Button>
                <Button variant="outline" className="w-full">
                  Outline
                </Button>
                <Button variant="ghost" className="w-full">
                  Ghost
                </Button>
                <Button variant="premium" className="w-full">
                  Premium
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Typography variant="h3">Sizes</Typography>
              <div className="space-y-2">
                <Button size="sm" className="w-full">
                  Small
                </Button>
                <Button size="default" className="w-full">
                  Default
                </Button>
                <Button size="lg" className="w-full">
                  Large
                </Button>
                <Button size="xl" className="w-full">
                  Extra Large
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Typography variant="h3">States</Typography>
              <div className="space-y-2">
                <Button leftIcon={<Mail className="h-4 w-4" />} className="w-full">
                  With Icon
                </Button>
                <Button
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="w-full"
                >
                  Right Icon
                </Button>
                <Button loading className="w-full">
                  Loading
                </Button>
                <Button disabled className="w-full">
                  Disabled
                </Button>
              </div>
            </div>
          </Grid>
        </section>
      </SlideUp>

      {/* Form Elements Section */}
      <ScaleIn delay={0.2}>
        <section className="space-y-8">
          <Typography variant="h2">Form Elements</Typography>
          <Grid cols={2} gap="lg">
            <Card>
              <CardHeader>
                <CardTitle>Input Fields</CardTitle>
                <CardDescription>Various input field styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Default Input" placeholder="Enter text..." />
                <Input
                  label="With Icon"
                  placeholder="Search..."
                  leftIcon={<Search className="h-4 w-4" />}
                />
                <Input
                  label="Error State"
                  placeholder="Enter email..."
                  error
                  helperText="Please enter a valid email address"
                />
                <Textarea
                  label="Textarea"
                  placeholder="Enter your message..."
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Labels & Typography</CardTitle>
                <CardDescription>Form labels and text elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Standard Label</Label>
                  <Input placeholder="Input with label..." />
                </div>
                <div>
                  <Label required>Required Field</Label>
                  <Input placeholder="Required input..." />
                </div>
                <div className="space-y-2">
                  <Typography variant="overline">Overline Text</Typography>
                  <Typography variant="subtitle1" color="accent">
                    Accent Color Text
                  </Typography>
                  <Typography variant="body2" color="muted">
                    Muted helper text for additional context
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </section>
      </ScaleIn>

      {/* Card Section */}
      <FadeIn delay={0.3}>
        <section className="space-y-8">
          <Typography variant="h2">Cards</Typography>
          <Grid cols={3} gap="md">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>Basic card with header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>This is the main content area of the card.</Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <CardTitle>Featured Card</CardTitle>
                </div>
                <CardDescription>Card with icon in header</CardDescription>
              </CardHeader>
              <CardContent>
                <Text size="sm">
                  This card demonstrates custom header content with an icon.
                </Text>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-brand-50 to-brand-100 border-brand-200">
              <CardHeader>
                <CardTitle className="text-brand-800">Branded Card</CardTitle>
                <CardDescription className="text-brand-600">
                  Custom styling with brand colors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Text size="sm" className="text-brand-700">
                  This card uses the Equza brand color palette.
                </Text>
              </CardContent>
            </Card>
          </Grid>
        </section>
      </FadeIn>

      {/* Modal Section */}
      <SlideUp delay={0.4}>
        <section className="space-y-8">
          <Typography variant="h2">Modal</Typography>
          <div>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
              <ModalContent onClose={() => setIsModalOpen(false)}>
                <ModalHeader>
                  <ModalTitle>Example Modal</ModalTitle>
                  <ModalDescription>
                    This is a demonstration of the modal component with header,
                    content, and close functionality.
                  </ModalDescription>
                </ModalHeader>
                <div className="space-y-4">
                  <Input label="Sample Input" placeholder="Enter something..." />
                  <Textarea
                    label="Sample Textarea"
                    placeholder="Enter a message..."
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setIsModalOpen(false)}>
                      Confirm
                    </Button>
                  </div>
                </div>
              </ModalContent>
            </Modal>
          </div>
        </section>
      </SlideUp>

      {/* Animation Section */}
      <section className="space-y-8">
        <Typography variant="h2">Animations</Typography>
        <Grid cols={3} gap="md">
          <FadeIn delay={0.1}>
            <Card>
              <CardContent className="p-6">
                <Text className="text-center">Fade In Animation</Text>
              </CardContent>
            </Card>
          </FadeIn>
          <SlideUp delay={0.2}>
            <Card>
              <CardContent className="p-6">
                <Text className="text-center">Slide Up Animation</Text>
              </CardContent>
            </Card>
          </SlideUp>
          <ScaleIn delay={0.3}>
            <Card>
              <CardContent className="p-6">
                <Text className="text-center">Scale In Animation</Text>
              </CardContent>
            </Card>
          </ScaleIn>
        </Grid>
      </section>
    </Container>
  );
};

export default ComponentShowcase; 