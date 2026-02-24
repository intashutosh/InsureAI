package com.InsureAI.backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;

@Entity
@Table(name = "dealerships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dealership {

    @Id
    @GeneratedValue
    @UuidGenerator
    private String id;

    private String dealershipName;
    private String ownerName;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
    private String pincode;
    private String gstNumber;
    private String role = "DEALERSHIP";

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
