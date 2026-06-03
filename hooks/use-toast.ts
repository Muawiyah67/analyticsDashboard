'use client';

import { toast as sonnerToast } from 'sonner';
import * as React from 'react';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
};

type ToastActionElement = React.ReactNode;

function toast({
  title,
  description,
  variant = 'default',
  duration = 3000,
}: ToastProps) {
  const message = title || description;

  if (variant === 'destructive') {
    return sonnerToast.error(message, { duration });
  }

  if (description && title) {
    return sonnerToast(title, {
      description,
      duration,
    });
  }

  return sonnerToast(message, { duration });
}

function useToast() {
  return {
    toast,
  };
}

export { useToast, toast };