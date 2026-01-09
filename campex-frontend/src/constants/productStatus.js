export const PRODUCT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
};

export const PRODUCT_STATUS_OPTIONS = [
  { value: PRODUCT_STATUS.AVAILABLE, label: 'Available', color: 'bg-green-100 text-green-700' },
  { value: PRODUCT_STATUS.RESERVED, label: 'Reserved', color: 'bg-yellow-100 text-yellow-700' },
  { value: PRODUCT_STATUS.SOLD, label: 'Sold', color: 'bg-gray-100 text-gray-700' },
];

export const getStatusLabel = (value) => {
  const status = PRODUCT_STATUS_OPTIONS.find((s) => s.value === value);
  return status ? status.label : value;
};

export const getStatusColor = (value) => {
  const status = PRODUCT_STATUS_OPTIONS.find((s) => s.value === value);
  return status ? status.color : 'bg-gray-100 text-gray-700';
};