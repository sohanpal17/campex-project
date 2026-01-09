package com.campex.backend.service;
import java.util.List;
import com.campex.backend.dto.request.CreateProductRequest;
import com.campex.backend.dto.request.UpdateProductRequest;
import com.campex.backend.dto.response.ProductResponse;
import com.campex.backend.dto.response.UserResponse;
import com.campex.backend.model.Product;
import com.campex.backend.model.User;
import com.campex.backend.repository.ProductRepository;
import com.campex.backend.repository.SavedItemRepository;
import com.campex.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;



@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final SavedItemRepository savedItemRepository;

    public ProductResponse createProduct(CreateProductRequest request) {
        String uid = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!seller.isVerified()) {
            throw new IllegalArgumentException("User must be verified to post items");
        }

        Product product = Product.builder()
                .seller(seller)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .isFree(request.isFree())
                .isNegotiable(request.isNegotiable())
                .isAvailableForRent(request.isAvailableForRent())
                .images(request.getImages())
                .status("ACTIVE")
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct, seller.getId());
    }

    public Page<ProductResponse> getAllProducts(
            String category, String status, String priceType, String search, Pageable pageable) {
        
        // Split comma-separated categories into list
        List<String> categories = null;
        if (category != null && !category.trim().isEmpty()) {
            categories = Arrays.asList(category.split(","));
            // Trim whitespace from each category
            categories = categories.stream()
                .map(String::trim)
                .filter(c -> !c.isEmpty())
                .toList();
            if (categories.isEmpty()) {
                categories = null;
            }
        }
        
        // Split comma-separated price types into list (similar to categories)
        List<String> priceTypesList = null;
        boolean filterByPrice = false;
        boolean includeFree = false;
        boolean includeNegotiable = false;
        boolean includeFixed = false;

        if (priceType != null && !priceType.trim().isEmpty()) {
            priceTypesList = Arrays.asList(priceType.split(","));
            // Trim whitespace and convert to uppercase
            priceTypesList = priceTypesList.stream()
                .map(String::trim)
                .map(String::toUpperCase)
                .filter(p -> !p.isEmpty())
                .toList();
            
            if (!priceTypesList.isEmpty()) {
                filterByPrice = true;
                includeFree = priceTypesList.contains("FREE");
                includeNegotiable = priceTypesList.contains("NEGOTIABLE");
                includeFixed = priceTypesList.contains("FIXED");
            }
        }

        // Default to ACTIVE status if not specified to show only active listings
        String queryStatus = (status == null || status.isEmpty()) ? "ACTIVE" : status;
        
        // Default search to empty string if null
        String querySearch = (search == null) ? "" : search;

        String uid = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByFirebaseUid(uid).orElse(null);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        // Exclude current user's own items from search/filter results
        Page<Product> products = productRepository.searchProducts(
                categories, queryStatus, filterByPrice, includeFree, includeNegotiable, includeFixed, 
                currentUserId, querySearch, pageable);

        return products.map(p -> mapToResponse(p, currentUserId));
    }

    public ProductResponse getProductById(Long id) {
        Product product = getProductEntity(id);
        
        String uid = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByFirebaseUid(uid).orElse(null);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        
        return mapToResponse(product, currentUserId);
    }

    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product product = getProductEntity(id);
        validateOwnership(product);

        if (request.getTitle() != null) product.setTitle(request.getTitle());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getCategory() != null) product.setCategory(request.getCategory());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStatus() != null) product.setStatus(request.getStatus());
        if (request.getIsFree() != null) product.setFree(request.getIsFree());
        if (request.getIsNegotiable() != null) product.setNegotiable(request.getIsNegotiable());
        if (request.getIsAvailableForRent() != null) product.setAvailableForRent(request.getIsAvailableForRent());

        return mapToResponse(productRepository.save(product), product.getSeller().getId());
    }

    public void deleteProduct(Long id) {
        Product product = getProductEntity(id);
        validateOwnership(product);
        productRepository.delete(product);
    }

    public ProductResponse markAsSold(Long id) {
        Product product = getProductEntity(id);
        validateOwnership(product);
        product.setStatus("SOLD");
        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct, product.getSeller().getId());
    }

    public ProductResponse markAsActive(Long id) {
        Product product = getProductEntity(id);
        validateOwnership(product);
        product.setStatus("ACTIVE");
        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct, product.getSeller().getId());
    }

    private Product getProductEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    private void validateOwnership(Product product) {
        String uid = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!product.getSeller().getFirebaseUid().equals(uid)) {
            throw new IllegalArgumentException("Unauthorized");
        }
    }

    private ProductResponse mapToResponse(Product product, Long currentUserId) {
        boolean isSaved = currentUserId != null && 
                savedItemRepository.existsByUserIdAndProductId(currentUserId, product.getId());

        User seller = product.getSeller();
        UserResponse sellerResponse = UserResponse.builder()
                .id(seller.getId())
                .fullName(seller.getFullName())
                .profilePhotoUrl(seller.getProfilePhotoUrl())
                .academicYear(seller.getAcademicYear())
                .build();

        return ProductResponse.builder()
                .id(product.getId())
                .seller(sellerResponse)
                .title(product.getTitle())
                .description(product.getDescription())
                .category(product.getCategory())
                .price(product.getPrice())
                .isFree(product.isFree())
                .isNegotiable(product.isNegotiable())
                .isAvailableForRent(product.isAvailableForRent())
                .status(product.getStatus())
                .images(product.getImages())
                .isSaved(isSaved)
                .createdAt(product.getCreatedAt())
                .build();
    }
}