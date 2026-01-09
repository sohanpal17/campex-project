// src/constants/categories.js

export const CATEGORIES = [
  { value: 'books', label: 'Books', icon: 'Book' },
  { value: 'electronics', label: 'Electronics', icon: 'Laptop' },
  { value: 'clothing', label: 'Clothing', icon: 'ShoppingBag' },
  { value: 'stationery', label: 'Stationery', icon: 'Edit' },
  { value: 'question-papers', label: 'Question Papers', icon: 'FileText' },
  { value: 'other', label: 'Other', icon: 'Package' },
];

export const getCategoryLabel = (value) => {
  const category = CATEGORIES.find((cat) => cat.value === value);
  return category ? category.label : value;
};

export const getCategoryIcon = (value) => {
  const category = CATEGORIES.find((cat) => cat.value === value);
  return category ? category.icon : 'Package';
};