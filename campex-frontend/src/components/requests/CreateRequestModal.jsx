import { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { itemRequestService } from '@/services/itemRequest.service';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import Button from '@/components/common/Button';

const CreateRequestModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: itemRequestService.createRequest,
        onSuccess: () => {
            handleSuccess('Request created successfully!');
            queryClient.invalidateQueries({ queryKey: ['item-requests'] });
            onClose();
            setTitle('');
            setDescription('');
        },
        onError: (error) => {
            handleError(error, 'Failed to create request');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            handleError(null, 'Please fill in all fields');
            return;
        }
        createMutation.mutate({ title: title.trim(), description: description.trim() });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Create Item Request</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={createMutation.isPending}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            What do you need? *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Calculus Textbook, Lab Coat, etc."
                            maxLength={100}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={createMutation.isPending}
                        />
                        <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide details about what you're looking for..."
                            maxLength={1000}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                            disabled={createMutation.isPending}
                        />
                        <p className="text-xs text-gray-500 mt-1">{description.length}/1000 characters</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={onClose}
                            disabled={createMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            loading={createMutation.isPending}
                        >
                            Create Request
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRequestModal;
