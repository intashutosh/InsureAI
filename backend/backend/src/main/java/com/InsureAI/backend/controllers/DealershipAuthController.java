package com.InsureAI.backend.controllers;

import com.InsureAI.backend.dto.DealershipLoginRequest;
import com.InsureAI.backend.dto.DealershipSignupRequest;
import com.InsureAI.backend.dto.DealershipResponseDTO;
import com.InsureAI.backend.models.Dealership;
import com.InsureAI.backend.repositories.DealershipRepository;
import com.InsureAI.backend.services.DealershipService;
import com.InsureAI.backend.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/dealership")
@CrossOrigin(origins = "http://localhost:5173")

public class DealershipAuthController {

    @Autowired
    private DealershipRepository dealershipRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/signup")
    public String signup(@RequestBody DealershipSignupRequest req) {
        if(dealershipRepository.findByEmail(req.getEmail()).isPresent()){
            throw new RuntimeException("Email already exists");
        }
        Dealership d = new Dealership();
        d.setDealershipName(req.getDealershipName());
        d.setOwnerName(req.getOwnerName());
        d.setEmail(req.getEmail());
        d.setPhoneNumber(req.getPhoneNumber());
        d.setAddress(req.getAddress());
        d.setPassword(passwordEncoder.encode(req.getPassword()));

        dealershipRepository.save(d);
        return "dealership created successfully";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody DealershipLoginRequest req) {

        Optional<Dealership> dOpt = dealershipRepository.findByEmail(req.getEmail());
        if (dOpt.isEmpty()) {
            return ResponseEntity.status(401).body("invalid email");
        }

        Dealership d = dOpt.get();

        if (!passwordEncoder.matches(req.getPassword(), d.getPassword())) {
            return ResponseEntity.status(401).body("invalid password");
        }

        String token = jwtService.generateToken(d.getId(), "DEALERSHIP");


        return ResponseEntity.ok(
                Map.of(
                        "token", token
                )
        );

    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {

        if(auth == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        Dealership d = (Dealership) auth.getPrincipal();

        return ResponseEntity.ok(d);
    }
}
