package com.InsureAI.backend.services;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIAnalysisService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String AI_URL = "http://localhost:9000/predict";

    public List<Map<String, Object>> analyzeClaim(
            List<File> images,
            String brand,
            String model) {

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("brand", brand);
        body.add("model", model);

        for (File imgFile : images) {
            try {
                byte[] bytes = Files.readAllBytes(imgFile.toPath());

                ByteArrayResource resource = new ByteArrayResource(bytes) {
                    @Override
                    public String getFilename() {
                        return imgFile.getName();
                    }
                };

                body.add("images", resource);

            } catch (IOException e) {
                throw new RuntimeException("Error reading file: " + imgFile.getName(), e);
            }
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(AI_URL, request, Map.class);

        Map<String, Object> responseMap = response.getBody();

        if (responseMap != null) {
            System.out.println("AI Response: " + responseMap);
        } else {
            System.out.println("AI Response: No response received from AI backend!");
        }

        List<Map<String, Object>> results = new ArrayList<>();
        if (responseMap != null && responseMap.get("results") instanceof List) {
            results = (List<Map<String, Object>>) responseMap.get("results");
        } else {
            System.out.println("No 'results' key found in AI response!");
        }

        return results;
    }
}
