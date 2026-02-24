package com.InsureAI.backend.dto;

import lombok.Data;

@Data
public class DealershipSignupRequest {
    private String dealershipName;
    private String ownerName;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
    private String pincode;
    private String gstNumber;
}
