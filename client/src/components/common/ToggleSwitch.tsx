import React from 'react';

interface ToggleSwitchProps {
    enabled: boolean;
    onToggle: () => void;
    label?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    enabled,
    onToggle,
    label,
    className = '',
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14'
    };

    const thumbSizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    };

    const translateClasses = {
        sm: enabled ? 'translate-x-4' : 'translate-x-0',
        md: enabled ? 'translate-x-5' : 'translate-x-0',
        lg: enabled ? 'translate-x-7' : 'translate-x-0'
    };

    return (
        <div className={`flex items-center ${className}`}>
            {label && (
                <span className="mr-3 text-sm font-medium text-gray-900">
                    {label}
                </span>
            )}
            <button
                type="button"
                className={`
                    ${sizeClasses[size]}
                    ${enabled ? 'bg-green-600' : 'bg-gray-200'}
                    relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                `}
                role="switch"
                aria-checked={enabled}
                onClick={onToggle}
            >
                <span
                    className={`
                        ${thumbSizeClasses[size]}
                        ${translateClasses[size]}
                        pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 
                        transition duration-200 ease-in-out
                    `}
                />
            </button>
        </div>
    );
};