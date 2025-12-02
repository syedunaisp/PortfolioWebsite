'use client';

import { useActionState } from 'react';
import { login } from '@/lib/actions';
import { Lock } from 'lucide-react';

const initialState = {
    success: false,
    message: '',
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-purple/20 via-background to-background" />

            <div className="relative z-10 w-full max-w-md p-8 bg-card/50 backdrop-blur-xl border border-glass-border rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mb-4 text-neon-purple">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                </div>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full bg-black/50 border border-glass-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="Enter access code"
                        />
                    </div>

                    {state?.message && (
                        <p className="text-neon-red text-sm text-center">{state.message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-neon-purple text-white font-bold py-3 rounded-lg hover:bg-neon-purple/80 transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'Authenticating...' : 'Enter Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}
