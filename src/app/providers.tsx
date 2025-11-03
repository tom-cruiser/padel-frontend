'use client';

import RootProvider from '@/components/providers/RootProvider';
import React from 'react';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootProvider>{children}</RootProvider>;
}