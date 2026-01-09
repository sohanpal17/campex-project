package com.campex.backend.repository;

import com.campex.backend.model.BlockedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockedUserRepository extends JpaRepository<BlockedUser, Long> {
    List<BlockedUser> findByBlockerId(Long blockerId);
    List<BlockedUser> findByBlockedId(Long blockedId);
    boolean existsByBlockerIdAndBlockedId(Long blockerId, Long blockedId);
    Optional<BlockedUser> findByBlockerIdAndBlockedId(Long blockerId, Long blockedId);
}