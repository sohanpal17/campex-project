export const NOTIFICATION_TYPES = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  ITEM_SAVED: 'ITEM_SAVED',
  BUYER_INTEREST: 'BUYER_INTEREST',
  ITEM_SOLD: 'ITEM_SOLD',
  PRICE_DROP: 'PRICE_DROP',
  SYSTEM: 'SYSTEM',
  ITEM_REQUEST: 'ITEM_REQUEST',
};

export const getNotificationIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.NEW_MESSAGE:
      return '💬';
    case NOTIFICATION_TYPES.ITEM_SAVED:
      return '❤️';
    case NOTIFICATION_TYPES.BUYER_INTEREST:
      return '👋';
    case NOTIFICATION_TYPES.ITEM_SOLD:
      return '✅';
    case NOTIFICATION_TYPES.PRICE_DROP:
      return '📉';
    case NOTIFICATION_TYPES.SYSTEM:
      return '🔔';
    case NOTIFICATION_TYPES.ITEM_REQUEST:
      return '❓';
    default:
      return '🔔';
  }
};