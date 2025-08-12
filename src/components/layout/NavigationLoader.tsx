'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/hooks/use-loading';
import { LoadingOverlay } from './LoadingOverlay';

export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    // When the route changes, we set loading to false.
    // The loading state is triggered by the custom Link component before navigation starts.
    if (setIsLoading) {
      setIsLoading(false);
    }
  }, [pathname, searchParams, setIsLoading]);

  return <LoadingOverlay />;
}
