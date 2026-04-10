import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge classnames with Tailwind CSS conflict resolution
 * Uses clsx for conditional class handling and tailwind-merge for deduplication
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;
