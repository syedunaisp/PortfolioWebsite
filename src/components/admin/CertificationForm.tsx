'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { createCertification, updateCertification } from '@/lib/actions';

interface CertificationFormProps {
    onClose: () => void;
    certification?: any;
}

export default function CertificationForm({ onClose, certification }: CertificationFormProps) {
    const [state, formAction] = useActionState(
        certification ? updateCertification.bind(null, certification.id) : createCertification,
        null
    );

    // Close modal and refresh on success
    useEffect(() => {
        if (state?.success) {
            setTimeout(() => {
                onClose();
            }, 1000);
        }
    }, [state?.success, onClose]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-glass-border rounded-2xl p-8 max-w-lg w-full"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">
                        {certification ? 'Edit Certification' : 'Add Certification'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form action={formAction} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Certification Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={certification?.name}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="AWS Certified Solutions Architect"
                        />
                        {state?.errors?.name && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
                        )}
                    </div>

                    {/* Issuer */}
                    <div>
                        <label htmlFor="issuer" className="block text-sm font-medium mb-2">
                            Issuer *
                        </label>
                        <input
                            type="text"
                            id="issuer"
                            name="issuer"
                            defaultValue={certification?.issuer}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="Amazon Web Services"
                        />
                        {state?.errors?.issuer && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.issuer}</p>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium mb-2">
                            Date *
                        </label>
                        <input
                            type="text"
                            id="date"
                            name="date"
                            defaultValue={certification?.date}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="e.g., Dec 2024"
                        />
                        {state?.errors?.date && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.date}</p>
                        )}
                    </div>

                    {/* Credential URL */}
                    <div>
                        <label htmlFor="credentialUrl" className="block text-sm font-medium mb-2">
                            Credential URL (Optional)
                        </label>
                        <input
                            type="url"
                            id="credentialUrl"
                            name="credentialUrl"
                            defaultValue={certification?.credentialUrl || ''}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="https://..."
                        />
                        {state?.errors?.credentialUrl && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.credentialUrl}</p>
                        )}
                    </div>

                    {/* Success/Error Messages */}
                    {state?.success && (
                        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500">
                            {state.message}
                        </div>
                    )}
                    {state?.success === false && state?.message && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
                            {state.message}
                        </div>
                    )}

                    {/* Submit Button */}
                    <SubmitButton isEdit={!!certification} />
                </form>
            </motion.div>
        </div>
    );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus();

    return (
        <div className="flex gap-3 pt-4">
            <button
                type="submit"
                disabled={pending}
                className="flex-1 px-6 py-3 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {pending ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        {isEdit ? 'Updating...' : 'Creating...'}
                    </>
                ) : (
                    <>{isEdit ? 'Update Certification' : 'Add Certification'}</>
                )}
            </button>
        </div>
    );
}
