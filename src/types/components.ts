// Save as: src/types/components.ts

import { HTMLAttributes, ReactNode } from 'react';

export interface BaseProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
}

export interface CardProps extends BaseProps {
  variant?: 'default' | 'bordered' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  isHoverable?: boolean;
  isInteractive?: boolean;
}

export interface TimelineProps extends BaseProps {
  showConnections?: boolean;
  enableZoom?: boolean;
  allowFiltering?: boolean;
  interactive?: boolean;
}

export type Theme = 'light' | 'dark' | 'system';
export type Size = 'sm' | 'md' | 'lg';
export type Variant = 'default' | 'bordered' | 'elevated';
