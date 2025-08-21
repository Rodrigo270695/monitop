import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export function PasswordInput({ className, error, ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                {...props}
                type={showPassword ? 'text' : 'password'}
                className={cn(
                    'pr-12',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                    className
                )}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4" style={{
                        color: 'var(--monitop-slate-400)',
                        '--tw-hover-color': 'var(--monitop-slate-600)'
                    } as React.CSSProperties} />
                ) : (
                    <Eye className="h-4 w-4" style={{
                        color: 'var(--monitop-slate-400)',
                        '--tw-hover-color': 'var(--monitop-slate-600)'
                    } as React.CSSProperties} />
                )}
            </Button>
        </div>
    );
}
