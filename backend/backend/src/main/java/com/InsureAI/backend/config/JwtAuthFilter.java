package com.InsureAI.backend.config;

import com.InsureAI.backend.repositories.InsurerRepository;
import com.InsureAI.backend.services.JwtService;
import com.InsureAI.backend.repositories.DealershipRepository;
import com.InsureAI.backend.models.Dealership;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final DealershipRepository dealershipRepository;
    private final InsurerRepository insurerRepository;

    public JwtAuthFilter(JwtService jwtService,
                         DealershipRepository dealershipRepository,
                         InsurerRepository insurerRepository) {
        this.jwtService = jwtService;
        this.dealershipRepository = dealershipRepository;
        this.insurerRepository = insurerRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtService.getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        // Extract userId and role from token
        String userId = claims.getSubject();
        String role = claims.get("role", String.class);

        Object user = null;

// Fetch using ID instead of email now
        if ("DEALERSHIP".equals(role)) {
            user = dealershipRepository.findById(userId).orElse(null);
        } else if ("INSURER".equals(role)) {
            user = insurerRepository.findById(userId).orElse(null);
        }


        if (user != null) {
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(user, null, null);
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}
