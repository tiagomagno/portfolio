import React, { forwardRef } from 'react';

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
                <label htmlFor={selectId} className="briefing-label">
                    {label}
                    {props.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <select
                    ref={ref}
                    id={selectId}
                    className={`briefing-input ${error ? 'border-red-500' : ''} ${className}`}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${selectId}-error` : undefined}
                    {...props}
                >
                    <option value="">Selecione uma opção</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
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
