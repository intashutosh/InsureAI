package com.InsureAI.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileStorageService {

    // ✅ Use absolute path based on project directory
    private final String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";

    public List<String> storeFiles(List<MultipartFile> files) throws IOException {
        Path uploadPath = Paths.get(uploadDir);

        // ✅ Create uploads folder if not exists
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            System.out.println("✅ Created upload directory at: " + uploadPath.toAbsolutePath());
        }

        List<String> filePaths = new ArrayList<>();

        for (MultipartFile file : files) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // ✅ Save file properly
            file.transferTo(filePath.toFile());

            // Store relative path for DB if needed
            filePaths.add("/uploads/" + fileName);
        }

        return filePaths;
    }
}
