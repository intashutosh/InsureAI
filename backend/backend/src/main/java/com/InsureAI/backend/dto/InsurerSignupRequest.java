package com.InsureAI.backend.dto;

import lombok.Data;

@Data
public class InsurerSignupRequest {

    private String id;
    private String name;
    private String email;
    private String password;
    private String companyName;
}
