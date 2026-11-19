import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variantStyles = {
    default: 'bg-surfaceBorder text-gray-300 border-gray-600',
    primary: 'bg-indigo-950/60 text-indigo-300 border-indigo-700/50',
    cyan: 'bg-sky-950/60 text-sky-300 border-sky-700/50',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-700/50',
    danger: 'bg-rose-950/60 text-rose-300 border-rose-700/50',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-700/50',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-md border ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {children}
    </span>
  );
};

export const ComplexityBadge = ({ complexity, type = 'time' }) => {
  if (!complexity) return null;

  let variant = 'primary';
  const c = complexity.toLowerCase();

  if (c.includes('1') && !c.includes('n')) {
    variant = 'success';
  } else if (c.includes('log')) {
    variant = 'cyan';
  } else if (c.includes('n') && !c.includes('^') && !c.includes('2^')) {
    variant = 'primary';
  } else if (c.includes('n^2') || c.includes('n2')) {
    variant = 'warning';
  } else if (c.includes('2^n') || c.includes('n!') || c.includes('^3')) {
    variant = 'danger';
  }

  return (
    <Badge variant={variant} size="lg" className="shadow-sm">
      <span className="text-gray-400 mr-1.5 uppercase tracking-wider text-[10px] font-sans">
        {type}:
      </span>
      {complexity}
    </Badge>
  );
};

export const DifficultyBadge = ({ difficulty }) => {
  const d = (difficulty || '').toLowerCase();
  let variant = 'success';
  if (d === 'medium') variant = 'warning';
  if (d === 'hard') variant = 'danger';

  return (
    <Badge variant={variant} size="sm">
      {difficulty}
    </Badge>
  );
};
