package com.InsureAI.backend.repositories;

import com.InsureAI.backend.models.Dealership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DealershipRepository extends JpaRepository<Dealership, String> {
    Optional<Dealership> findByEmail(String email);
    boolean existsByEmail(String email);
}
