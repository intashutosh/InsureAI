package com.InsureAI.backend.repositories;

import com.InsureAI.backend.models.DamageSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DamageSubmissionRepository extends JpaRepository<DamageSubmission, Long> {
    List<DamageSubmission> findByDealershipId(String dealershipId);
    List<DamageSubmission> findByStatus(String status);
}
