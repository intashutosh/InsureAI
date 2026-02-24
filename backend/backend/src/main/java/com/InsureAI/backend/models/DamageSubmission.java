package com.InsureAI.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class DamageSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dealershipId;

    // Vehicle details
    private String brand;
    private String model;
    private int year;
    private String vin;
    private String registrationNumber;

    // multiple images – stored as URLs separated by comma
    @Column(columnDefinition="TEXT")
    private String damageImages; // "url1,url2,url3"

    // single estimate image
    private String estimateImageUrl;

    private String status = "PENDING";  // PENDING | APPROVED | REJECTED
    private Date submittedAt = new Date();

    // --- Insurer fields ---
    private Double approvedAmount;
    private String insurerRemarks;
    private String insurerId;  // Link insurer who approved/rejected

}
