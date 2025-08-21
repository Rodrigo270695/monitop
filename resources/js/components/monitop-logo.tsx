interface MonitopLogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function MonitopLogo({ className = '', size = 'md' }: MonitopLogoProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Logo Icon */}
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Central Circle */}
                <div className="absolute inset-0 rounded-full shadow-lg border-2" style={{
                    backgroundColor: 'var(--monitop-white)',
                    borderColor: 'var(--monitop-purple-200)'
                }} />

                {/* Network Nodes */}
                <div className="absolute inset-0">
                    {/* Top Node */}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--monitop-purple-500)' }} />
                    {/* Right Node */}
                    <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--monitop-purple-500)' }} />
                    {/* Bottom Node */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--monitop-purple-500)' }} />
                    {/* Left Node */}
                    <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--monitop-purple-500)' }} />
                </div>

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                    <defs>
                                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--monitop-purple-600)" />
                        <stop offset="100%" stopColor="var(--monitop-purple-700)" />
                    </linearGradient>
                    </defs>
                    {/* Vertical Line */}
                    <line x1="24" y1="8" x2="24" y2="40" stroke="url(#lineGradient)" strokeWidth="1.5" />
                    {/* Horizontal Line */}
                    <line x1="8" y1="24" x2="40" y2="24" stroke="url(#lineGradient)" strokeWidth="1.5" />
                </svg>

                {/* Central Dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--monitop-purple-600)' }} />
                </div>

                {/* Pulse Animation */}
                <div className="absolute inset-0 rounded-full opacity-20 animate-ping" style={{ backgroundColor: 'var(--monitop-purple-400)' }} />
            </div>

            {/* Text Logo */}
            <div className="flex flex-col">
                <span className="text-xl font-bold" style={{
                    color: 'var(--monitop-white)'
                }}>
                    Monitop
                </span>
                <span className="text-xs -mt-1" style={{ color: 'var(--monitop-slate-300)' }}>Sistema Inteligente</span>
            </div>
        </div>
    );
}
