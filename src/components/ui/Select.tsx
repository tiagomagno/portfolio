import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', id, ...props }, ref) => {
        const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                <label
                    htmlFor={selectId}
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#a8a29e]"
                >
                    {label}
                    {props.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        'h-[46px] w-full appearance-none rounded-[8px] border px-4 text-sm transition-all',
                        'border-[#2a2a2a] bg-[#131313] text-white',
                        'focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20',
                        'disabled:cursor-not-allowed disabled:opacity-60',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${selectId}-error` : undefined}
                    {...props}
                >
                    <option value="" style={{ color: '#6b7280', backgroundColor: '#ffffff' }}>
                        Selecione uma opção
                    </option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            style={{ color: '#111827', backgroundColor: '#ffffff' }}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p id={`${selectId}-error`} className="mt-1 text-sm text-red-400" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Select.displayName = 'Select';

