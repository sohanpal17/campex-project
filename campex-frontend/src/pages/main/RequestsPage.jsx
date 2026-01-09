import { useState, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Plus } from 'lucide-react';
import { itemRequestService } from '@/services/itemRequest.service';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { ITEMS_PER_PAGE } from '@/constants';
import RequestCard from '@/components/requests/RequestCard';
import CreateRequestModal from '@/components/requests/CreateRequestModal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const RequestsPage = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
    const queryClient = useQueryClient();

    // Fetch all requests
    const {
        data: allData,
        fetchNextPage: fetchNextAll,
        hasNextPage: hasNextAll,
        isFetchingNextPage: isFetchingNextAll,
        isLoading: isLoadingAll,
    } = useInfiniteQuery({
        queryKey: ['item-requests', 'all'],
        queryFn: ({ pageParam = 0 }) =>
            itemRequestService.getRequests(pageParam, ITEMS_PER_PAGE),
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.content && lastPage.content.length === ITEMS_PER_PAGE) {
                return pages.length;
            }
            return undefined;
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: activeTab === 'all',
    });

    // Fetch my requests
    const {
        data: myData,
        fetchNextPage: fetchNextMy,
        hasNextPage: hasNextMy,
        isFetchingNextPage: isFetchingNextMy,
        isLoading: isLoadingMy,
    } = useInfiniteQuery({
        queryKey: ['item-requests', 'my'],
        queryFn: ({ pageParam = 0 }) =>
            itemRequestService.getMyRequests(pageParam, ITEMS_PER_PAGE),
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.content && lastPage.content.length === ITEMS_PER_PAGE) {
                return pages.length;
            }
            return undefined;
        },
        staleTime: 2 * 60 * 1000,
        enabled: activeTab === 'my',
    });

    const deleteMutation = useMutation({
        mutationFn: itemRequestService.deleteRequest,
        onSuccess: () => {
            handleSuccess('Request deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['item-requests'] });
        },
        onError: (error) => {
            handleError(error, 'Failed to delete request');
        },
    });

    const { ref, inView } = useInView();

    // Handle infinite scroll
    useEffect(() => {
        if (activeTab === 'all' && inView && hasNextAll && !isFetchingNextAll) {
            fetchNextAll();
        } else if (activeTab === 'my' && inView && hasNextMy && !isFetchingNextMy) {
            fetchNextMy();
        }
    }, [inView, activeTab, hasNextAll, isFetchingNextAll, fetchNextAll, hasNextMy, isFetchingNextMy, fetchNextMy]);

    const data = activeTab === 'all' ? allData : myData;
    const isLoading = activeTab === 'all' ? isLoadingAll : isLoadingMy;
    const hasNextPage = activeTab === 'all' ? hasNextAll : hasNextMy;
    const isFetchingNextPage = activeTab === 'all' ? isFetchingNextAll : isFetchingNextMy;

    const requests = data?.pages.flatMap((page) => page.content || []) || [];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-custom py-8 max-w-4xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Item Requests</h1>
                        <p className="text-gray-600">
                            Request items you need or help others find what they're looking for
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="mt-4 md:mt-0 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create Request
                    </Button>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'all'
                                    ? 'text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Other Requests
                            {activeTab === 'all' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('my')}
                            className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'my'
                                    ? 'text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            My Requests
                            {activeTab === 'my' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    {requests.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {activeTab === 'all' ? 'No requests yet' : 'You haven\'t created any requests'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {activeTab === 'all'
                                    ? 'Be the first to create a request for an item you need!'
                                    : 'Create your first request to find items you need'}
                            </p>
                            <Button onClick={() => setShowCreateModal(true)}>
                                Create Your First Request
                            </Button>
                        </div>
                    ) : (
                        requests.map((request) => (
                            <RequestCard
                                key={request.id}
                                request={request}
                                onDelete={deleteMutation.mutate}
                                isOwn={!request.canChat}
                            />
                        ))
                    )}
                </div>

                {/* Infinite Scroll Trigger */}
                {hasNextPage && (
                    <div ref={ref} className="py-8 flex justify-center">
                        {isFetchingNextPage && <Loader size="md" />}
                    </div>
                )}

                {/* No More Items */}
                {!hasNextPage && requests.length > 0 && (
                    <p className="text-center text-gray-500 py-8">
                        No more requests to load
                    </p>
                )}
            </div>

            {/* Create Request Modal */}
            <CreateRequestModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
};

export default RequestsPage;
