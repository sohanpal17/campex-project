import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { messageService } from '@/services/message.service';
import { handleError, handleSuccess } from '@/utils/errorHandler';
import { generateRoute } from '@/constants/routes';
import Button from '@/components/common/Button';

const ProductActions = ({ product, isSaved, onSaveToggle }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isSaved) {
        await userService.unsaveItem(product.id);
        handleSuccess('Removed from saved items');
      } else {
        await userService.saveItem(product.id);
        handleSuccess('Added to saved items');
      }

      const newIsSavedValue = !isSaved;

      // Manually update all cached product lists immediately
      queryClient.setQueriesData(
        { queryKey: ['products'], exact: false },
        (oldData) => {
          if (!oldData) return oldData;

          // Handle infinite query structure (search page)
          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map(page => ({
                ...page,
                content: page.content?.map(p =>
                  p.id === product.id ? { ...p, isSaved: newIsSavedValue } : p
                ) || []
              }))
            };
          }

          return oldData;
        }
      );

      // Update single product query cache
      queryClient.setQueryData(['product', String(product.id)], (oldData) =>
        oldData ? { ...oldData, isSaved: newIsSavedValue } : oldData
      );

      // Invalidate to ensure fresh data on next mount
      queryClient.invalidateQueries({ queryKey: ['savedItems'] });

      onSaveToggle?.();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMessage = async () => {
    setIsMessaging(true);
    try {
      // Create or get existing conversation with this seller for this product
      const conversation = await messageService.getOrCreateConversation(
        product.seller.id,
        product.id
      );

      // Navigate to the specific conversation
      navigate(generateRoute.chatDetail(conversation.id));
    } catch (error) {
      handleError(error, 'Failed to start conversation');
    } finally {
      setIsMessaging(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this item: ${product.title}`,
          url: url,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          handleError(error, 'Failed to share');
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        handleSuccess('Link copied to clipboard!');
      } catch (error) {
        handleError(error, 'Failed to copy link');
      }
    }
  };

  return (
    <div className="flex gap-3">
      {/* Message Seller (Primary Action) */}
      <Button
        onClick={handleMessage}
        loading={isMessaging}
        disabled={isMessaging}
        className="flex-1 flex items-center justify-center gap-2"
      >
        <MessageCircle size={20} />
        Message Seller
      </Button>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <Heart
          size={24}
          className={isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}
        />
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Share2 size={24} className="text-gray-600" />
      </button>
    </div>
  );
};

export default ProductActions;