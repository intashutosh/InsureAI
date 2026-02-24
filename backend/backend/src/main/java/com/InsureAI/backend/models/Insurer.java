package com.InsureAI.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Data
public class Insurer {

    @Id
    @GeneratedValue
    @UuidGenerator
    private String id;
    private String name;
    private String email;
    private String password;
    private String companyName;
    private String role = "INSURER";
}
