'use client';

import React, { useEffect } from 'react';

export default function DebugComponent() {
  useEffect(() => {
    console.log('React version:', process.env.NEXT_PUBLIC_REACT_VERSION || 'Unknown');
    console.log('Component rendered successfully');
  }, []);

  return null;
}