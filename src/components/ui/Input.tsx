import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                <label
                    htmlFor={inputId}
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#a8a29e]"
                >
                    {label}
                    {props.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'h-[46px] w-full rounded-[8px] border px-4 text-sm transition-all',
                        'border-[#2a2a2a] bg-[#131313] text-white',
                        'placeholder:text-[var(--color-text-dim)]',
                        'focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20',
                        'disabled:cursor-not-allowed disabled:opacity-60',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${inputId}-error`} className="mt-1 text-sm text-red-400" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

