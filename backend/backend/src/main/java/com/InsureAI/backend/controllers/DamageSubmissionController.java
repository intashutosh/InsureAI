package com.InsureAI.backend.controllers;

import com.InsureAI.backend.models.DamageSubmission;
import com.InsureAI.backend.models.Dealership;
import com.InsureAI.backend.repositories.DamageSubmissionRepository;
import com.InsureAI.backend.services.FileStorageService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/damage")
public class DamageSubmissionController {

    private final DamageSubmissionRepository damageRepo;
    private final FileStorageService fileStorage;

    public DamageSubmissionController(DamageSubmissionRepository damageRepo, FileStorageService fileStorage) {
        this.damageRepo = damageRepo;
        this.fileStorage = fileStorage;
    }

    @PostMapping("/submit")
    public DamageSubmission submitDamage(
            Authentication authentication,
            @RequestParam String brand,
            @RequestParam String model,
            @RequestParam int year,
            @RequestParam String vin,
            @RequestParam String registrationNumber,
            @RequestParam("damageImages") List<MultipartFile> damageImages, // multiple
            @RequestParam("estimateImage") MultipartFile estimateImage      // single
    ) throws IOException {

        if (damageImages.size() < 3) throw new RuntimeException("Minimum 3 images required");

        String damageUrls = String.join(",",
                fileStorage.storeFiles(damageImages) // returns List<String>
        );

        String estimateUrl = fileStorage.storeFiles(List.of(estimateImage)).get(0);

        Dealership dealership = (Dealership) authentication.getPrincipal();

        DamageSubmission sub = new DamageSubmission();
        sub.setDealershipId(dealership.getId());
        sub.setBrand(brand);
        sub.setModel(model);
        sub.setYear(year);
        sub.setVin(vin);
        sub.setRegistrationNumber(registrationNumber);
        sub.setDamageImages(damageUrls);
        sub.setEstimateImageUrl(estimateUrl);

        return damageRepo.save(sub);
    }
    @GetMapping("/my-submissions")
    public List<DamageSubmission> getMySubmissions(Authentication authentication) {
        Dealership dealership = (Dealership) authentication.getPrincipal();
        return damageRepo.findByDealershipId(dealership.getId());
    }


}
