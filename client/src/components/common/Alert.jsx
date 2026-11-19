import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const Alert = ({ type = 'info', title, children, className = '' }) => {
  const configs = {
    info: {
      bg: 'bg-sky-950/40 border-sky-800/60 text-sky-200',
      icon: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-amber-950/40 border-amber-800/60 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    },
    danger: {
      bg: 'bg-rose-950/40 border-rose-800/60 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    },
    success: {
      bg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    },
  };

  const config = configs[type] || configs.info;

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-lg border text-sm leading-relaxed ${config.bg} ${className}`}>
      {config.icon}
      <div className="flex-1">
        {title && <div className="font-semibold mb-1 text-gray-100">{title}</div>}
        <div className="text-gray-300 text-xs sm:text-sm">{children}</div>
      </div>
    </div>
  );
};
