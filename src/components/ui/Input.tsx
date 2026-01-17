import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label
                style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--text-color)',
                    opacity: 0.8
                }}
            >
                {label}
            </label>
            <input
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: error ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: 'var(--text-color)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = error ? 'var(--accent-color)' : 'var(--border-color)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
                {...props}
            />
            {error && (
                <span style={{ color: 'var(--accent-color)', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
