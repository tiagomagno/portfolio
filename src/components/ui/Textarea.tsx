import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                <label htmlFor={textareaId} className="briefing-label">
                    {label}
                    {props.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={4}
                    className={`briefing-input resize-y ${error ? 'border-red-500' : ''} ${className}`}
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
