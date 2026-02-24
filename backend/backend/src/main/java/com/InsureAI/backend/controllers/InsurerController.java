package com.InsureAI.backend.controllers;

import com.InsureAI.backend.dto.InsurerLoginRequest;
import com.InsureAI.backend.dto.InsurerSignupRequest;
import com.InsureAI.backend.models.Dealership;
import com.InsureAI.backend.models.Insurer;
import com.InsureAI.backend.repositories.InsurerRepository;
import com.InsureAI.backend.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/insurer")
public class InsurerController {

    @Autowired
    private InsurerRepository insurerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/signup")
    public String signup(@RequestBody InsurerSignupRequest req) {
        if (insurerRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        Insurer i = new Insurer();
        i.setName(req.getName());
        i.setEmail(req.getEmail());
        i.setPassword(passwordEncoder.encode(req.getPassword()));
        i.setCompanyName(req.getCompanyName());
        insurerRepository.save(i);
        return "Insurer account created successfully";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody InsurerLoginRequest req) {
        Optional<Insurer> iOpt = insurerRepository.findByEmail(req.getEmail());
        if (iOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email"));
        }

        Insurer i = iOpt.get();

        if (!passwordEncoder.matches(req.getPassword(), i.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid password"));
        }
        String token = jwtService.generateToken(i.getId(), "INSURER");

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

        Insurer i = (Insurer) auth.getPrincipal();

        return ResponseEntity.ok(i);
    }

}
