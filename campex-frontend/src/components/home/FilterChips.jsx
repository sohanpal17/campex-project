import { CATEGORIES } from '@/constants';
import {
  Gift,
  Book,
  Laptop,
  ShoppingBag,
  Edit,
  FileText,
  Package,
} from 'lucide-react';

const ICON_MAP = {
  free: Gift,
  books: Book,
  electronics: Laptop,
  clothing: ShoppingBag,
  stationery: Edit,
  'question-papers': FileText,
  other: Package,
};

const FilterChips = ({ activeFilters, onFilterChange }) => {
  const chips = [
    {
      label: 'Free Items',
      value: 'free',
      type: 'priceType',
    },
    ...CATEGORIES.map((cat) => ({
      label: cat.label,
      value: cat.value,
      type: 'category',
    })),
  ];

  const isActive = (chip) => {
    if (chip.type === 'category') {
      return activeFilters.category === chip.value;
    }
    if (chip.type === 'priceType') {
      return activeFilters.priceType === chip.value;
    }
    return false;
  };

  const handleChipClick = (chip) => {
    if (chip.type === 'category') {
      onFilterChange({
        ...activeFilters,
        category: isActive(chip) ? null : chip.value,
      });
    } else {
      onFilterChange({
        ...activeFilters,
        priceType: isActive(chip) ? null : chip.value,
      });
    }
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {chips.map((chip, index) => {
        const Icon = ICON_MAP[chip.value];

        return (
          <button
            key={index}
            onClick={() => handleChipClick(chip)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200
              ${
                isActive(chip)
                  ? 'bg-accent-600 text-white shadow-md'
                  : 'bg-accent-400 text-black-700 hover:bg-accent-600'
              }
            `}
          >
            {Icon && <Icon size={16} />}
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterChips;