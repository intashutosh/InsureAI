package com.InsureAI.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DealershipResponseDTO {
    private String id;
    private String dealershipName;
    private String ownerName;
    private String email;
    private String phoneNumber;
    private String address;
    private String pincode;
    private String gstNumber;
}
