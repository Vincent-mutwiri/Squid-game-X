"use client";

import { useAppTitle } from '@/hooks/useAppTitle';
import { useEffect } from 'react';

export function DynamicTitle() {
  const { title } = useAppTitle();

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null; // This component doesn't render anything visible
}