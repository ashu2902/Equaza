/**
 * Loading Skeletons for Homepage Sections
 * Provides loading states while content is being fetched
 */

'use client';

import { Container } from '@/components/ui/Container';

interface LoadingSkeletonProps {
  variant:
    | 'hero'
    | 'tiles'
    | 'mega-tiles'
    | 'banner'
    | 'story'
    | 'lookbook'
    | 'contact';
}

export function LoadingSkeleton({ variant }: LoadingSkeletonProps) {
  const skeletonClass = 'bg-gray-200 animate-pulse rounded';

  switch (variant) {
    case 'hero':
      return (
        <section className='min-h-screen bg-gray-50'>
          <Container size='xl' className='min-h-screen flex items-center'>
            <div className='grid lg:grid-cols-2 gap-16 items-center w-full py-20'>
              <div className='space-y-8'>
                <div className={`${skeletonClass} h-4 w-32`} />
                <div className='space-y-4'>
                  <div className={`${skeletonClass} h-12 w-full`} />
                  <div className={`${skeletonClass} h-12 w-3/4`} />
                  <div className={`${skeletonClass} h-6 w-2/3`} />
                </div>
                <div className='flex gap-4'>
                  <div className={`${skeletonClass} h-12 w-40`} />
                  <div className={`${skeletonClass} h-12 w-40`} />
                </div>
              </div>
              <div className={`${skeletonClass} h-96 w-full rounded-2xl`} />
            </div>
          </Container>
        </section>
      );

    case 'tiles':
      return (
        <section className='py-20 bg-white'>
          <Container size='xl'>
            <div className='space-y-16'>
              <div className='text-center space-y-6'>
                <div className={`${skeletonClass} h-4 w-32 mx-auto`} />
                <div className={`${skeletonClass} h-12 w-64 mx-auto`} />
                <div className={`${skeletonClass} h-6 w-96 mx-auto`} />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className='space-y-4'>
                    <div
                      className={`${skeletonClass} h-64 w-full rounded-xl`}
                    />
                    <div className={`${skeletonClass} h-6 w-3/4`} />
                    <div className={`${skeletonClass} h-4 w-1/2`} />
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      );

    case 'mega-tiles':
      return (
        <section className='py-20 bg-gray-50'>
          <Container size='xl'>
            <div className='space-y-16'>
              <div className='text-center space-y-6'>
                <div className={`${skeletonClass} h-4 w-32 mx-auto`} />
                <div className={`${skeletonClass} h-12 w-64 mx-auto`} />
                <div className={`${skeletonClass} h-6 w-96 mx-auto`} />
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className='space-y-4'>
                    <div
                      className={`${skeletonClass} h-80 w-full rounded-2xl`}
                    />
                    <div
                      className={`${skeletonClass} h-16 w-full rounded-xl`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      );

    case 'banner':
      return (
        <section className='py-20 bg-primary-900'>
          <Container size='xl'>
            <div className='grid lg:grid-cols-2 gap-16 items-center'>
              <div className='space-y-8'>
                <div
                  className={`bg-primary-700 animate-pulse rounded h-4 w-32`}
                />
                <div className='space-y-4'>
                  <div
                    className={`bg-primary-700 animate-pulse rounded h-12 w-full`}
                  />
                  <div
                    className={`bg-primary-700 animate-pulse rounded h-12 w-3/4`}
                  />
                  <div
                    className={`bg-primary-700 animate-pulse rounded h-6 w-2/3`}
                  />
                </div>
                <div className='space-y-6'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='flex space-x-4'>
                      <div
                        className={`bg-primary-700 animate-pulse rounded-full w-12 h-12`}
                      />
                      <div className='space-y-2 flex-1'>
                        <div
                          className={`bg-primary-700 animate-pulse rounded h-4 w-1/3`}
                        />
                        <div
                          className={`bg-primary-700 animate-pulse rounded h-3 w-2/3`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`bg-primary-700 animate-pulse rounded-2xl h-96 w-full`}
              />
            </div>
          </Container>
        </section>
      );

    case 'story':
      return (
        <section className='py-20 bg-white'>
          <Container size='xl'>
            <div className='grid lg:grid-cols-2 gap-16 items-center'>
              <div className='space-y-8'>
                <div className={`${skeletonClass} h-4 w-32`} />
                <div className='space-y-4'>
                  <div className={`${skeletonClass} h-12 w-full`} />
                  <div className={`${skeletonClass} h-12 w-3/4`} />
                  <div className={`${skeletonClass} h-6 w-2/3`} />
                </div>
                <div className='grid grid-cols-2 gap-6'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='text-center space-y-3'>
                      <div
                        className={`${skeletonClass} w-12 h-12 rounded-full mx-auto`}
                      />
                      <div className={`${skeletonClass} h-4 w-16 mx-auto`} />
                      <div className={`${skeletonClass} h-3 w-20 mx-auto`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className='space-y-6'>
                <div className={`${skeletonClass} h-80 w-full rounded-2xl`} />
                <div className='grid grid-cols-2 gap-4'>
                  <div className={`${skeletonClass} h-32 w-full rounded-xl`} />
                  <div className={`${skeletonClass} h-32 w-full rounded-xl`} />
                </div>
              </div>
            </div>
          </Container>
        </section>
      );

    case 'lookbook':
      return (
        <section className='py-20 bg-primary-900'>
          <Container size='xl'>
            <div className='grid lg:grid-cols-2 gap-16 items-center'>
              <div className='space-y-8'>
                <div
                  className={`bg-primary-700 animate-pulse rounded h-4 w-32`}
                />
                <div className='space-y-4'>
                  <div
                    className={`bg-primary-700 animate-pulse rounded h-12 w-full`}
                  />
                  <div
                    className={`bg-primary-700 animate-pulse rounded h-12 w-3/4`}
                  />
                  <div
                    className={`bg-primary-700 animate-pulse rounded h-6 w-2/3`}
                  />
                </div>
                <div className='space-y-4'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='flex space-x-4'>
                      <div
                        className={`bg-primary-700 animate-pulse rounded-full w-10 h-10`}
                      />
                      <div className='space-y-2 flex-1'>
                        <div
                          className={`bg-primary-700 animate-pulse rounded h-4 w-1/3`}
                        />
                        <div
                          className={`bg-primary-700 animate-pulse rounded h-3 w-2/3`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className={`bg-primary-700 animate-pulse rounded h-12 w-48`}
                />
              </div>
              <div
                className={`bg-primary-700 animate-pulse rounded-2xl h-96 w-full`}
              />
            </div>
          </Container>
        </section>
      );

    case 'contact':
      return (
        <section className='py-20 bg-gray-50'>
          <Container size='xl'>
            <div className='space-y-16'>
              <div className='text-center space-y-6'>
                <div className={`${skeletonClass} h-4 w-32 mx-auto`} />
                <div className={`${skeletonClass} h-12 w-64 mx-auto`} />
                <div className={`${skeletonClass} h-6 w-96 mx-auto`} />
              </div>

              <div className='grid lg:grid-cols-2 gap-16'>
                <div className='space-y-6'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${skeletonClass} h-24 w-full rounded-xl`}
                    />
                  ))}
                  <div className={`${skeletonClass} h-32 w-full rounded-xl`} />
                </div>

                <div className={`${skeletonClass} h-96 w-full rounded-2xl`} />
              </div>
            </div>
          </Container>
        </section>
      );

    default:
      return (
        <section className='py-20'>
          <Container size='xl'>
            <div className={`${skeletonClass} h-64 w-full rounded-xl`} />
          </Container>
        </section>
      );
  }
}
