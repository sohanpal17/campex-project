import { useInfiniteQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { ITEMS_PER_PAGE } from '@/constants';

export const useProducts = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: ({ pageParam = 0 }) =>
      productService.getProducts(filters, pageParam, ITEMS_PER_PAGE),
    getNextPageParam: (lastPage, pages) => {
      // If last page has full set of items, there might be more
      if (lastPage.content && lastPage.content.length === ITEMS_PER_PAGE) {
        return pages.length;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};