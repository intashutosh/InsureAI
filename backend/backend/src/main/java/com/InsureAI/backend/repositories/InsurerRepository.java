package com.InsureAI.backend.repositories;

import com.InsureAI.backend.models.Insurer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InsurerRepository extends JpaRepository<Insurer, String> {
    Optional<Insurer> findByEmail(String email);
}
