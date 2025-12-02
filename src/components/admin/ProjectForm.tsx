import { useState, useRef, useEffect, useActionState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import { createProject, updateProject } from '@/lib/actions';
import { useFormStatus } from 'react-dom';

interface ProjectFormProps {
    onClose: () => void;
    project?: any;
}

import { useRouter } from 'next/navigation';

export default function ProjectForm({ onClose, project }: ProjectFormProps) {
    const router = useRouter();
    const [state, formAction] = useActionState(
        project ? updateProject.bind(null, project.id) : createProject,
        null
    );
    const [imagePreview, setImagePreview] = useState(project?.imageUrl || '');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Close modal and refresh on success
    useEffect(() => {
        if (state?.success) {
            router.refresh();
            setTimeout(() => {
                onClose();
            }, 1000);
        }
    }, [state?.success, router, onClose]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setImagePreview(data.url);
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-glass-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">
                        {project ? 'Edit Project' : 'Add New Project'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form action={formAction} className="space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Project Image</label>
                        <div className="space-y-3">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg border border-glass-border"
                                />
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-glass-border rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={18} />
                                            Upload Image
                                        </>
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                            <input
                                type="hidden"
                                name="imageUrl"
                                value={imagePreview}
                            />
                            {state?.errors?.imageUrl && (
                                <p className="text-red-500 text-sm">{state.errors.imageUrl}</p>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            Project Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={project?.title}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="My Awesome Project"
                        />
                        {state?.errors?.title && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            defaultValue={project?.description}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors resize-none"
                            placeholder="Describe your project..."
                        />
                        {state?.errors?.description && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            defaultValue={project?.tags?.join(', ')}
                            className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                            placeholder="React, Next.js, TypeScript"
                        />
                        {state?.errors?.tags && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.tags}</p>
                        )}
                    </div>

                    {/* Links */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="link" className="block text-sm font-medium mb-2">
                                Live Link
                            </label>
                            <input
                                type="url"
                                id="link"
                                name="link"
                                defaultValue={project?.link || ''}
                                className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="githubLink" className="block text-sm font-medium mb-2">
                                GitHub Link
                            </label>
                            <input
                                type="url"
                                id="githubLink"
                                name="githubLink"
                                defaultValue={project?.githubLink || ''}
                                className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg focus:outline-none focus:border-neon-purple transition-colors"
                                placeholder="https://github.com/..."
                            />
                        </div>
                    </div>

                    {/* Featured */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            defaultChecked={project?.featured}
                            className="w-5 h-5 rounded border-glass-border bg-black/30 text-neon-purple focus:ring-neon-purple"
                        />
                        <label htmlFor="featured" className="text-sm font-medium">
                            Mark as Featured Project
                        </label>
                    </div>

                    {/* Visibility Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isVisible"
                            name="isVisible"
                            defaultChecked={project?.isVisible ?? true}
                            className="w-5 h-5 rounded border-glass-border bg-black/30 text-neon-blue focus:ring-neon-blue"
                        />
                        <label htmlFor="isVisible" className="text-sm font-medium">
                            Show on homepage
                        </label>
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
                    <SubmitButton isEdit={!!project} />
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
                    <>{isEdit ? 'Update Project' : 'Create Project'}</>
                )}
            </button>
        </div>
    );
}
