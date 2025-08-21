import { useEffect, useState } from 'react';

export function TechDiagram() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden" style={{
            background: `linear-gradient(to bottom right, var(--monitop-slate-50), var(--monitop-blue-50), var(--monitop-indigo-100))`
        }}>
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, var(--monitop-slate-500) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                }} />
            </div>

            {/* Animated Elements */}
            <div className={`relative h-full w-full transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {/* Main Server Blocks */}
                <div className="absolute left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        {/* Red Server */}
                        <div className="absolute -top-8 -left-4 h-16 w-8 rounded-lg shadow-lg animate-pulse" style={{
                            background: `linear-gradient(to bottom, var(--monitop-red-400), var(--monitop-red-600))`,
                            animationDelay: '0s'
                        }} />
                        {/* Green Server */}
                        <div className="absolute -top-4 left-4 h-12 w-6 rounded-lg shadow-lg animate-pulse" style={{
                            background: `linear-gradient(to bottom, var(--monitop-green-400), var(--monitop-green-600))`,
                            animationDelay: '0.5s'
                        }} />
                        {/* Blue Server */}
                        <div className="absolute top-0 -left-2 h-20 w-10 rounded-lg shadow-lg animate-pulse" style={{
                            background: `linear-gradient(to bottom, var(--monitop-blue-400), var(--monitop-blue-600))`,
                            animationDelay: '1s'
                        }} />
                    </div>
                </div>

                {/* Connection Lines */}
                <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
                    {/* Main connections */}
                    <line x1="25%" y1="25%" x2="75%" y2="25%" stroke="var(--monitop-slate-800)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                    <line x1="25%" y1="25%" x2="75%" y2="75%" stroke="var(--monitop-slate-800)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <line x1="75%" y1="25%" x2="75%" y2="75%" stroke="var(--monitop-slate-800)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" style={{ animationDelay: '0.6s' }} />

                    {/* Data flow arrows */}
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="var(--monitop-blue-500)" />
                        </marker>
                    </defs>

                    <line x1="30%" y1="30%" x2="70%" y2="30%" stroke="var(--monitop-blue-500)" strokeWidth="3" markerEnd="url(#arrowhead)" className="animate-pulse" style={{ animationDelay: '0.9s' }} />
                    <line x1="30%" y1="70%" x2="70%" y2="70%" stroke="var(--monitop-blue-500)" strokeWidth="3" markerEnd="url(#arrowhead)" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
                </svg>

                {/* Floating Elements */}
                <div className="absolute top-1/3 right-1/4">
                    <div className="h-4 w-4 rounded-full animate-bounce" style={{
                        backgroundColor: 'var(--monitop-yellow-400)',
                        animationDelay: '0.2s'
                    }} />
                </div>
                <div className="absolute bottom-1/3 left-1/3">
                    <div className="h-3 w-3 rounded-full animate-bounce" style={{
                        backgroundColor: 'var(--monitop-purple-400)',
                        animationDelay: '0.7s'
                    }} />
                </div>
                <div className="absolute top-2/3 right-1/3">
                    <div className="h-5 w-5 rounded-full animate-bounce" style={{
                        backgroundColor: 'var(--monitop-cyan-400)',
                        animationDelay: '1.1s'
                    }} />
                </div>

                {/* Network Nodes */}
                <div className="absolute top-1/4 right-1/4">
                    <div className="relative">
                        <div className="h-8 w-8 rounded-full shadow-lg border-2" style={{
                            backgroundColor: 'var(--monitop-white)',
                            borderColor: 'var(--monitop-blue-200)'
                        }} />
                        <div className="absolute inset-0 h-8 w-8 rounded-full opacity-20 animate-ping" style={{
                            backgroundColor: 'var(--monitop-blue-400)'
                        }} />
                    </div>
                </div>

                <div className="absolute bottom-1/4 left-1/4">
                    <div className="relative">
                        <div className="h-6 w-6 rounded-full shadow-lg border-2" style={{
                            backgroundColor: 'var(--monitop-white)',
                            borderColor: 'var(--monitop-green-400)'
                        }} />
                        <div className="absolute inset-0 h-6 w-6 rounded-full opacity-20 animate-ping" style={{
                            backgroundColor: 'var(--monitop-green-400)',
                            animationDelay: '0.5s'
                        }} />
                    </div>
                </div>

                {/* Data Processing Units */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="h-3 w-3 rounded animate-pulse" style={{ backgroundColor: 'var(--monitop-indigo-400)' }} />
                        <div className="h-3 w-3 rounded animate-pulse" style={{
                            backgroundColor: 'var(--monitop-indigo-400)',
                            animationDelay: '0.3s'
                        }} />
                        <div className="h-3 w-3 rounded animate-pulse" style={{
                            backgroundColor: 'var(--monitop-indigo-400)',
                            animationDelay: '0.6s'
                        }} />
                        <div className="h-3 w-3 rounded animate-pulse" style={{
                            backgroundColor: 'var(--monitop-indigo-400)',
                            animationDelay: '0.9s'
                        }} />
                    </div>
                </div>

                {/* Brand Name */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="text-center">
                        <div className="text-sm font-medium tracking-wider" style={{ color: 'var(--monitop-slate-600)' }}>MONITOP</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--monitop-slate-400)' }}>Sistema de Monitoreo Inteligente</div>
                    </div>
                </div>

                {/* Directional Arrows */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce" style={{ color: 'var(--monitop-blue-400)' }}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce" style={{
                        color: 'var(--monitop-blue-400)',
                        animationDelay: '0.5s'
                    }}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 17a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L9 13.586V4a1 1 0 012 0v9.586l1.293-1.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 17z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
