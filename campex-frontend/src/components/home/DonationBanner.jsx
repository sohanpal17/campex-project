import { useState, useEffect } from 'react';
import { X, Maximize2, Heart } from 'lucide-react';
import { campaignService } from '@/services/campaign.service';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import donationPoster from '@/assets/donationposter.jpg';

const DonationBanner = ({ campaign, onClose }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use fallback image if poster_url is empty
  const posterUrl = campaign?.posterUrl || donationPoster;

  // Load interest status from backend
  useEffect(() => {
    const loadInterestStatus = async () => {
      if (!campaign?.id) return;

      try {
        const interested = await campaignService.isInterested(campaign.id);
        setIsLiked(interested);
      } catch (error) {
        console.error('Failed to load interest status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInterestStatus();
  }, [campaign?.id]);

  const handleLike = async () => {
    if (!campaign?.id) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState); // Optimistic update

    try {
      if (newLikedState) {
        await campaignService.markInterest(campaign.id);
        handleSuccess('Marked as interested!');
      } else {
        await campaignService.unmarkInterest(campaign.id);
        handleSuccess('Interest removed');
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState);
      handleError(error, 'Failed to update interest');
    }
  };

  if (!campaign) return null;

  return (
    <>
      {/* Banner Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-md mb-8 group cursor-pointer ring-1 ring-gray-200 hover:ring-accent-400 transition-all bg-gray-900">
        {/* Background Image */}
        <img
          src={posterUrl}
          alt={campaign.title}
          className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          onClick={() => setShowFullImage(true)}
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end"
          onClick={() => setShowFullImage(true)}
        >
          <div className="p-6 text-white w-full">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold mb-1 shadow-sm text-white">{campaign.title}</h3>
                {campaign.description && (
                  <p className="text-sm text-gray-200 line-clamp-1 max-w-xl">
                    {campaign.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Heart Reaction Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium transition-all border disabled:opacity-50 ${isLiked
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md'
                    }`}
                >
                  <Heart
                    size={16}
                    fill={isLiked ? 'currentColor' : 'none'}
                    className="transition-all"
                  />
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

        {/* Close Banner Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-md border border-white/10 group-hover:opacity-100 md:opacity-0 transition-opacity"
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
            className="absolute top-6 right-6 p-2 bg-white/10 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={32} />
          </button>

          <img
            src={posterUrl}
            alt={campaign.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default DonationBanner;