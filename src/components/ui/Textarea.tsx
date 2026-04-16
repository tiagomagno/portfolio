import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                <label
                    htmlFor={textareaId}
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#a8a29e]"
                >
                    {label}
                    {props.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={4}
                    className={cn(
                        'w-full min-h-[120px] resize-y rounded-[8px] border px-4 py-3 text-sm transition-all',
                        'border-[#2a2a2a] bg-[#131313] text-white',
                        'placeholder:text-[var(--color-text-dim)]',
                        'focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20',
                        'disabled:cursor-not-allowed disabled:opacity-60',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${textareaId}-error` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${textareaId}-error`} className="mt-1 text-sm text-red-400" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

