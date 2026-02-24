package com.InsureAI.backend.dto;

import lombok.Data;

@Data
public class InsurerLoginRequest {
    private String email;
    private String password;
}
