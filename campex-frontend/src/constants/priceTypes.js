export const PRICE_TYPES = {
  FREE: 'FREE',
  NEGOTIABLE: 'NEGOTIABLE',
  FIXED: 'FIXED',
};

export const PRICE_TYPE_OPTIONS = [
  { value: PRICE_TYPES.FREE, label: 'Free', icon: '🆓', color: 'text-green-600 bg-green-50 border border-green-200' },
  { value: PRICE_TYPES.NEGOTIABLE, label: 'Negotiable', icon: '💰', color: 'text-blue-600 bg-blue-50 border border-blue-200' },
  { value: PRICE_TYPES.FIXED, label: 'Fixed Price', icon: '🔒', color: 'text-gray-600 bg-gray-50 border border-gray-200' },
];

export const getPriceTypeLabel = (value) => {
  const type = PRICE_TYPE_OPTIONS.find((t) => t.value === value);
  return type ? type.label : value;
};

export const getPriceTypeColor = (value) => {
  const type = PRICE_TYPE_OPTIONS.find((t) => t.value === value);
  return type ? type.color : 'text-gray-600 bg-gray-50 border border-gray-200';
};