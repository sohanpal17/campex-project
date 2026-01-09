package com.campex.backend.repository;

import com.campex.backend.model.ItemRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRequestRepository extends JpaRepository<ItemRequest, Long> {
    Page<ItemRequest> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    Page<ItemRequest> findByStatusAndRequesterIdNotOrderByCreatedAtDesc(String status, Long requesterId, Pageable pageable);
    Page<ItemRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId, Pageable pageable);
}
