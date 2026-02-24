package com.InsureAI.backend.controllers;

import com.InsureAI.backend.models.DamageSubmission;
import com.InsureAI.backend.repositories.DamageSubmissionRepository;
import com.InsureAI.backend.services.AIAnalysisService;
import com.InsureAI.backend.services.ClaimReviewService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/insurer/claims")
public class InsurerClaimController {

    @Autowired
    private ClaimReviewService service;

    @Autowired
    private DamageSubmissionRepository damageSubmissionRepository;

    @Autowired
    private AIAnalysisService aiAnalysisService;

    // 1. Get all pending claims
    @GetMapping("/pending")
    public List<DamageSubmission> getPendingClaims() {
        return service.getPendingClaims();
    }

    // 2. Get a specific claim
    @GetMapping("/{id}")
    public DamageSubmission getClaim(@PathVariable Long id) {
        return service.getClaim(id);
    }

    // 3. Approve a claim
    @PostMapping("/{id}/approve")
    public DamageSubmission approveClaim(
            @PathVariable Long id,
            @RequestParam Double amount,
            @RequestParam String remarks,
            HttpServletRequest request
    ) {
        String insurerId = request.getUserPrincipal().getName();
        return service.approveClaim(id, amount, remarks, insurerId);
    }

    @GetMapping("/analysis/{claimId}")
    public ResponseEntity<?> analyzeClaim(@PathVariable Long claimId) throws IOException {

        DamageSubmission claim = damageSubmissionRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        String brand = claim.getBrand();
        String model = claim.getModel();

        String[] imagePaths = claim.getDamageImages().split(",");
        String uploadRoot = System.getProperty("user.dir") + File.separator + "uploads";

        List<File> imageFiles = new ArrayList<>();
        List<String> previewUrls = new ArrayList<>();

        for (String urlPath : imagePaths) {
            String fileName = urlPath.replace("/uploads/", "");
            File realFile = new File(uploadRoot + File.separator + fileName);
            if (realFile.exists()) {
                imageFiles.add(realFile);
                previewUrls.add(urlPath);
            }
        }

        if (imageFiles.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No valid images found for claim"));
        }

        // Call AI Service
        List<Map<String, Object>> aiResults = aiAnalysisService.analyzeClaim(imageFiles, brand, model);

        // Build proper JSON response
        List<Map<String, Object>> finalResponse = new ArrayList<>();
        for (int i = 0; i < previewUrls.size(); i++) {
            Map<String, Object> result = new HashMap<>();
            result.put("image", previewUrls.get(i));

            // Ensure predictions is always a List
            Object preds = aiResults.size() > i ? aiResults.get(i).get("predictions") : null;
            result.put("predictions", preds instanceof List ? preds : new ArrayList<>());

            finalResponse.add(result);
        }

        // Return as JSON
        return ResponseEntity.ok(Map.of("results", finalResponse));
    }






    // 4. Reject a claim
    @PostMapping("/{id}/reject")
    public DamageSubmission rejectClaim(
            @PathVariable Long id,
            @RequestParam String remarks,
            HttpServletRequest request
    ) {
        String insurerId = request.getUserPrincipal().getName();
        return service.rejectClaim(id, remarks, insurerId);
    }
}
