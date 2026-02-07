import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { campaignService } from '@/services/campaign.service';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import donationPoster from '@/assets/donationposter.jpg';

const CampaignCarousel = ({ campaigns, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFullImage, setShowFullImage] = useState(false);
    const [interestStatus, setInterestStatus] = useState({});
    const [isLoading, setIsLoading] = useState({});
    const queryClient = useQueryClient();

    const currentCampaign = campaigns[currentIndex];
    const posterUrl = currentCampaign?.posterUrl || donationPoster;

    // Auto-rotate every 5 seconds
    useEffect(() => {
        // Stop rotation if we only have 1 campaign OR if the full image modal is open
        if (campaigns.length <= 1 || showFullImage) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % campaigns.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [campaigns.length, showFullImage]);

    // Load interest status for all campaigns
    useEffect(() => {
        const loadAllInterestStatus = async () => {
            const status = {};
            for (const campaign of campaigns) {
                try {
                    const interested = await campaignService.isInterested(campaign.id);
                    status[campaign.id] = interested;
                } catch (error) {
                    console.error(`Failed to load interest for campaign ${campaign.id}:`, error);
                    status[campaign.id] = false;
                }
            }
            setInterestStatus(status);
        };

        if (campaigns.length > 0) {
            loadAllInterestStatus();
        }
    }, [campaigns]);

    const handleLike = async (campaignId) => {
        if (!campaignId) return;

        const currentStatus = interestStatus[campaignId] || false;
        const newStatus = !currentStatus;

        // Optimistic update
        setInterestStatus((prev) => ({ ...prev, [campaignId]: newStatus }));
        setIsLoading((prev) => ({ ...prev, [campaignId]: true }));

        try {
            if (newStatus) {
                await campaignService.markInterest(campaignId);
                handleSuccess('Marked as interested!');
            } else {
                await campaignService.unmarkInterest(campaignId);
                handleSuccess('Interest removed');
            }

            // Invalidate campaigns query to refresh
            await queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        } catch (error) {
            // Revert on error
            setInterestStatus((prev) => ({ ...prev, [campaignId]: currentStatus }));
            handleError(error, 'Failed to update interest');
        } finally {
            setIsLoading((prev) => ({ ...prev, [campaignId]: false }));
        }
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    };

    if (!campaigns || campaigns.length === 0) return null;

    const isLiked = interestStatus[currentCampaign?.id] || false;
    const isUpdating = isLoading[currentCampaign?.id] || false;

    return (
        <>
            {/* Carousel Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-md mb-8 group ring-1 ring-gray-200 hover:ring-accent-400 transition-all bg-gray-900">
                {/* Background Image */}
                <div className="relative cursor-pointer" onClick={() => setShowFullImage(true)}>
                    <img
                        src={posterUrl}
                        alt={currentCampaign?.title}
                        className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />

                    {/* Navigation Arrows - Only show if multiple campaigns */}
                    {campaigns.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                                aria-label="Previous campaign"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                                aria-label="Next campaign"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Gradient Overlay with Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end pointer-events-none">
                    <div className="p-6 text-white w-full pointer-events-auto">
                        <div className="flex justify-between items-end">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-1 shadow-sm text-white">
                                    {currentCampaign?.title}
                                </h3>
                                {currentCampaign?.description && (
                                    <p className="text-sm text-gray-200 line-clamp-2 max-w-xl">
                                        {currentCampaign.description}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {/* Heart Reaction Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(currentCampaign?.id);
                                    }}
                                    disabled={isUpdating}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium transition-all border disabled:opacity-50 ${isLiked
                                        ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md'
                                        }`}
                                >
                                    <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} className="transition-all" />
                                    <span className="text-sm">Interested</span>
                                </button>

                                {/* Click hint (Desktop only) */}
                                <div className="hidden md:flex items-center gap-2 text-xs font-medium text-white/80 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                                    <Maximize2 size={14} />
                                    Click to expand
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel Dots - Only show if multiple campaigns */}
                {campaigns.length > 1 && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
                        {campaigns.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(index);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                                    }`}
                                aria-label={`Go to campaign ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Close Banner Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-md border border-white/10 group-hover:opacity-100 md:opacity-0 transition-opacity pointer-events-auto"
                    title="Dismiss Banner"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Full Image Modal (Lightbox) */}
            {showFullImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setShowFullImage(false)}
                >
                    {/* Close Modal Button */}
                    <button
                        onClick={() => setShowFullImage(false)}
                        className="absolute top-6 right-6 p-2 bg-white/10 text-white hover:bg-white/20 rounded-full transition-colors z-50"
                    >
                        <X size={32} />
                    </button>

                    {/* Navigation Arrows for Modal */}
                    {campaigns.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
                            >
                                <ChevronLeft size={32} />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    {/* Main Image with Swipe Support */}
                    <motion.div
                        className="w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.img
                            key={currentIndex} // Re-render on index change for animation
                            src={posterUrl}
                            alt={currentCampaign?.title}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipeConfidenceThreshold = 10000;
                                const swipePower = Math.abs(offset.x) * velocity.x;

                                if (swipePower < -swipeConfidenceThreshold) {
                                    goToNext();
                                } else if (swipePower > swipeConfidenceThreshold) {
                                    goToPrevious();
                                } else if (Math.abs(offset.x) > 100) {
                                    // Fallback for slow drags
                                    if (offset.x > 0) goToPrevious();
                                    else goToNext();
                                }
                            }}
                        />
                    </motion.div>

                    {/* Modal Dots */}
                    {campaigns.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                            {campaigns.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(index);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default CampaignCarousel;
