import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Shield, Lock, User, Eye, EyeOff } from 'lucide-react';
import { TechDiagram } from '@/components/tech-diagram';
import { MonitopLogo } from '@/components/monitop-logo';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <Head title="Iniciar Sesión - Monitop" />

            <div className="min-h-screen flex">
                {/* Left Side - Tech Diagram */}
                <div className="hidden lg:flex lg:w-1/2 relative">
                    <TechDiagram />

                    {/* Overlay with welcome text */}
                    <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4 text-slate-800 drop-shadow-lg">
                                Bienvenido a Monitop
                            </h1>
                            <p className="text-xl text-slate-700 drop-shadow-md max-w-md mx-auto">
                                Sistema de monitoreo inteligente para tu infraestructura tecnológica
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex-1 flex items-center justify-center p-8" style={{
                    background: `linear-gradient(to bottom right, var(--monitop-slate-900), var(--monitop-purple-900), var(--monitop-slate-900))`
                }}>
                    <div className="w-full max-w-md space-y-8">
                        {/* Logo and Header */}
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="p-6 rounded-2xl" style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}>
                                    <MonitopLogo size="lg" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--monitop-white)' }}>
                                Iniciar Sesión
                            </h2>
                            <p style={{ color: 'var(--monitop-slate-300)' }}>
                                Accede a tu panel de control
                            </p>
                        </div>

                        {/* Login Form */}
                        <Form
                            method="post"
                            action={route('login')}
                            resetOnSuccess={['password']}
                            onSubmit={() => setIsLoading(true)}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Username Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-sm font-medium" style={{ color: 'var(--monitop-white)' }}>
                                            Usuario
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5" style={{ color: 'var(--monitop-slate-400)' }} />
                                            </div>
                                            <Input
                                                id="username"
                                                type="text"
                                                name="username"
                                                required
                                                autoFocus
                                                autoComplete="username"
                                                placeholder="Ingresa tu usuario"
                                                className={cn(
                                                    "pl-10 text-white transition-all duration-200",
                                                    errors.username && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                )}
                                                style={{
                                                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                                                    borderColor: errors.username ? 'var(--monitop-red-500)' : 'var(--monitop-slate-600)',
                                                    color: 'var(--monitop-white)',
                                                    '--tw-focus-border-color': 'var(--monitop-purple-500)',
                                                    '--tw-focus-ring-color': 'var(--monitop-purple-500)'
                                                } as React.CSSProperties}
                                            />
                                        </div>
                                        {errors.username && (
                                            <p className="text-sm flex items-center gap-1" style={{ color: 'var(--monitop-red-400)' }}>
                                                <Shield className="h-4 w-4" />
                                                {errors.username}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium" style={{ color: 'var(--monitop-white)' }}>
                                            Contraseña
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5" style={{ color: 'var(--monitop-slate-400)' }} />
                                            </div>
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                placeholder="Ingresa tu contraseña"
                                                className={cn(
                                                    "pl-10 text-white transition-all duration-200",
                                                    errors.password && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                )}
                                                style={{
                                                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                                                    borderColor: errors.password ? 'var(--monitop-red-500)' : 'var(--monitop-slate-600)',
                                                    color: 'var(--monitop-white)',
                                                    '--tw-focus-border-color': 'var(--monitop-purple-500)',
                                                    '--tw-focus-ring-color': 'var(--monitop-purple-500)'
                                                } as React.CSSProperties}
                                                error={errors.password}
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm flex items-center gap-1" style={{ color: 'var(--monitop-red-400)' }}>
                                                <Shield className="h-4 w-4" />
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                className="cursor-pointer"
                                                style={{
                                                    borderColor: 'var(--monitop-slate-600)',
                                                    backgroundColor: 'rgba(30, 41, 59, 0.5)'
                                                }}
                                            />
                                            <Label htmlFor="remember" className="text-sm" style={{ color: 'var(--monitop-slate-300)' }}>
                                                Recordarme
                                            </Label>
                                        </div>
                                        {canResetPassword && (
                                            <a
                                                href={route('password.request')}
                                                className="text-sm transition-colors duration-200 cursor-pointer"
                                                style={{ color: 'var(--monitop-purple-400)' }}
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </a>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={processing || isLoading}
                                        className={cn(
                                            "w-full text-white font-semibold py-3 px-4 rounded-lg",
                                            "transition-all duration-200 transform hover:scale-[1.02]",
                                            "focus:ring-2 focus:ring-offset-2",
                                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                                            "cursor-pointer"
                                        )}
                                        style={{
                                            background: `linear-gradient(to right, var(--monitop-purple-600), var(--monitop-purple-700))`,
                                            '--tw-focus-ring-color': 'var(--monitop-purple-500)',
                                            '--tw-focus-ring-offset-color': 'var(--monitop-slate-900)'
                                        } as React.CSSProperties}
                                    >
                                        {(processing || isLoading) ? (
                                            <div className="flex items-center gap-2">
                                                <LoaderCircle className="h-5 w-5 animate-spin" />
                                                Iniciando sesión...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Lock className="h-5 w-5" />
                                                Acceder
                                            </div>
                                        )}
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* Status Message */}
                        {status && (
                            <div className="p-4 border rounded-lg" style={{
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                borderColor: 'rgba(34, 197, 94, 0.2)'
                            }}>
                                <p className="text-sm text-center" style={{ color: 'var(--monitop-green-400)' }}>{status}</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="text-center">
                            <p className="text-sm" style={{ color: 'var(--monitop-slate-400)' }}>
                                © {new Date().getFullYear()} Monitop. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
