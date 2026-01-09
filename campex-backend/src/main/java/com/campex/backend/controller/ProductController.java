package com.campex.backend.controller;

import com.campex.backend.dto.request.CreateProductRequest;
import com.campex.backend.dto.request.UpdateProductRequest;
import com.campex.backend.dto.response.ApiResponse;
import com.campex.backend.dto.response.ProductResponse;
import com.campex.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.success(product, "Product created successfully"));
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priceType,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<ProductResponse> products = productService.getAllProducts(
                category, status, priceType, search, 
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product, null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id, 
            @RequestBody UpdateProductRequest request) {
        
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success(product, "Product updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deleted successfully"));
    }

    @PatchMapping("/{id}/mark-sold")
    public ResponseEntity<ApiResponse<ProductResponse>> markAsSold(@PathVariable Long id) {
        ProductResponse product = productService.markAsSold(id);
        return ResponseEntity.ok(ApiResponse.success(product, "Product marked as sold"));
    }

    @PatchMapping("/{id}/mark-active")
    public ResponseEntity<ApiResponse<ProductResponse>> markAsActive(@PathVariable Long id) {
        ProductResponse product = productService.markAsActive(id);
        return ResponseEntity.ok(ApiResponse.success(product, "Product marked as active"));
    }
}