package com.InsureAI.backend.services;

import com.InsureAI.backend.models.DamageSubmission;
import com.InsureAI.backend.repositories.DamageSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClaimReviewService {

    @Autowired
    private DamageSubmissionRepository repo;

    public List<DamageSubmission> getPendingClaims() {
        return repo.findByStatus("PENDING");
    }

    public DamageSubmission getClaim(Long id) {
        return repo.findById(id).orElse(null);
    }

    public DamageSubmission approveClaim(Long id, Double amount, String remarks, String insurerId) {
        DamageSubmission claim = repo.findById(id).orElse(null);
        if (claim == null) return null;

        claim.setStatus("APPROVED");
        claim.setApprovedAmount(amount);
        claim.setInsurerRemarks(remarks);
        claim.setInsurerId(insurerId);

        return repo.save(claim);
    }

    public DamageSubmission rejectClaim(Long id, String remarks, String insurerId) {
        DamageSubmission claim = repo.findById(id).orElse(null);
        if (claim == null) return null;

        claim.setStatus("REJECTED");
        claim.setInsurerRemarks(remarks);
        claim.setInsurerId(insurerId);

        return repo.save(claim);
    }
}

