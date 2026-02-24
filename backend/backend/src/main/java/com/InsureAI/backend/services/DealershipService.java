package com.InsureAI.backend.services;

import com.InsureAI.backend.dto.DealershipSignupRequest;
import com.InsureAI.backend.dto.DealershipLoginRequest;
import com.InsureAI.backend.dto.DealershipResponseDTO;
import com.InsureAI.backend.models.Dealership;
import com.InsureAI.backend.repositories.DealershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DealershipService {

    private final DealershipRepository dealershipRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // Original DealershipService logic before modifications.


}
