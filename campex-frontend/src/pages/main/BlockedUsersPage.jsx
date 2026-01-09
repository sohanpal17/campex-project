import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ArrowLeft, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const BlockedUsersPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: blockedUsers = [], isLoading } = useQuery({
        queryKey: ['blocked-users'],
        queryFn: userService.getBlockedUsers,
    });

    const unblockMutation = useMutation({
        mutationFn: userService.unblockUser,
        onSuccess: () => {
            queryClient.invalidateQueries(['blocked-users']);
            handleSuccess('User unblocked');
        },
        onError: (error) => {
            handleError(error, 'Failed to unblock user');
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-custom py-8 max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Blocked Users</h1>
                </div>

                {/* Blocked Users List */}
                <div className="bg-white rounded-lg shadow-sm">
                    {blockedUsers.length === 0 ? (
                        <div className="text-center py-16">
                            <UserX className="mx-auto mb-4 text-gray-400" size={64} />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No blocked users
                            </h3>
                            <p className="text-gray-600">
                                You haven't blocked anyone yet
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {blockedUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="p-4 flex items-center justify-between hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                                            {user.fullName?.charAt(0) || 'U'}
                                        </div>

                                        {/* User Info */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {user.fullName}
                                            </h3>
                                            
                                        </div>
                                    </div>

                                    {/* Unblock Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (window.confirm(`Unblock ${user.fullName}?`)) {
                                                unblockMutation.mutate(user.id);
                                            }
                                        }}
                                        loading={unblockMutation.isPending}
                                    >
                                        Unblock
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlockedUsersPage;
