package com.campex.backend.repository;

import com.campex.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find by seller
    Page<Product> findBySellerId(Long sellerId, Pageable pageable);
    Page<Product> findBySellerIdAndStatus(Long sellerId, String status, Pageable pageable);

    // Search query with filters (excludes current user's own items)
    // Search query with filters (excludes current user's own items)
    @Query("SELECT p FROM Product p WHERE " +
           "(:categories IS NULL OR p.category IN :categories) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:filterByPrice = FALSE OR (" +
           "  (:includeFree = TRUE AND p.isFree = TRUE) OR " +
           "  (:includeNegotiable = TRUE AND p.isFree = FALSE AND p.isNegotiable = TRUE) OR " +
           "  (:includeFixed = TRUE AND p.isFree = FALSE AND p.isNegotiable = FALSE)" +
           ")) AND " +
           "(:excludeSellerId IS NULL OR p.seller.id != :excludeSellerId) AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))") 
    Page<Product> searchProducts(
            @Param("categories") List<String> categories,
            @Param("status") String status,
            @Param("filterByPrice") boolean filterByPrice,
            @Param("includeFree") boolean includeFree,
            @Param("includeNegotiable") boolean includeNegotiable,
            @Param("includeFixed") boolean includeFixed,
            @Param("excludeSellerId") Long excludeSellerId,
            @Param("search") String search,
            Pageable pageable);
}