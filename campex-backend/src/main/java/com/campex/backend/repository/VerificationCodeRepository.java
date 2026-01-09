package com.campex.backend.repository;

import com.campex.backend.model.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findTopByEmailAndCodeAndIsUsedFalseOrderByCreatedAtDesc(String email, String code);
}