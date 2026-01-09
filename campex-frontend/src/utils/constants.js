export const CATEGORIES = [
  { value: 'books', label: '📚 Books' },
  { value: 'electronics', label: '💻 Electronics' },
  { value: 'clothing', label: '👕 Clothing' },
  { value: 'stationery', label: '📝 Stationery' },
  { value: 'question-papers', label: '📄 Question Papers' },
  { value: 'other', label: '📦 Other' },
];

export const ACADEMIC_YEARS = [
  { value: 'FE', label: 'First Year (FE)' },
  { value: 'SE', label: 'Second Year (SE)' },
  { value: 'TE', label: 'Third Year (TE)' },
  { value: 'BE', label: 'Final Year (BE)' },
];

export const PRICE_TYPES = [
  { value: 'selling', label: 'For Sale' },
  { value: 'free', label: 'Free' },
];

export const PRODUCT_CONDITIONS = [
  { value: 'new', label: 'Brand New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

export const PRODUCT_STATUS = [
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'sold', label: 'Sold' },
];

export const MAX_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];