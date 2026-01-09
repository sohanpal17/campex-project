import { CATEGORIES, PRICE_TYPE_OPTIONS, PRICE_TYPES } from '@/constants';
import Button from '@/components/common/Button';
import {
  Book,
  Laptop,
  ShoppingBag,
  Edit,
  FileText,
  Package,
  DollarSign,
  Gift,
  Tag,
} from 'lucide-react';

const CATEGORY_ICON_MAP = {
  books: Book,
  electronics: Laptop,
  clothing: ShoppingBag,
  stationery: Edit,
  'question-papers': FileText,
  other: Package,
};

const PRICE_TYPE_ICON_MAP = {
  [PRICE_TYPES.FREE]: Gift,
  [PRICE_TYPES.NEGOTIABLE]: DollarSign,
  [PRICE_TYPES.FIXED]: Tag,
};

const FilterPanel = ({ filters, onFilterChange, onClose }) => {
  const handleCategoryToggle = (categoryValue) => {
    const newCategories = filters.categories?.includes(categoryValue)
      ? filters.categories.filter((c) => c !== categoryValue)
      : [...(filters.categories || []), categoryValue];

    onFilterChange({ ...filters, categories: newCategories });
  };

  const handlePriceTypeToggle = (priceType) => {
    const newPriceTypes = filters.priceTypes?.includes(priceType)
      ? filters.priceTypes.filter((p) => p !== priceType)
      : [...(filters.priceTypes || []), priceType];

    onFilterChange({ ...filters, priceTypes: newPriceTypes });
  };

  const handleClearAll = () => {
    onFilterChange({ categories: [], priceTypes: [] });
  };

  const activeFilterCount =
    (filters.categories?.length || 0) + (filters.priceTypes?.length || 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICON_MAP[category.value];

            return (
              <label
                key={category.value}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category.value) || false}
                  onChange={() => handleCategoryToggle(category.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="flex items-center gap-2 text-gray-700">
                  {Icon && <Icon size={16} />}
                  {category.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Type */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Price Type</h4>
        <div className="space-y-2">
          {PRICE_TYPE_OPTIONS.map((priceType) => {
            const Icon = PRICE_TYPE_ICON_MAP[priceType.value];

            return (
              <label
                key={priceType.value}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.priceTypes?.includes(priceType.value) || false}
                  onChange={() => handlePriceTypeToggle(priceType.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="flex items-center gap-2 text-gray-700">
                  {Icon && <Icon size={16} />}
                  {priceType.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Apply Button (Mobile) */}
      {onClose && (
        <Button onClick={onClose} className="w-full md:hidden">
          Apply Filters
        </Button>
      )}
    </div>
  );
};

export default FilterPanel;