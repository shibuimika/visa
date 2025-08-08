import type { ReactNode } from 'react';

type Color = 'blue' | 'indigo' | 'gray' | 'green' | 'yellow' | 'purple';

const colorClass: Record<Color, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
  green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

type Props = {
  color?: Color;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Tag({ color = 'gray', icon, children, className = '' }: Props) {
  const c = colorClass[color];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${c.bg} ${c.text} ${c.border} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}


