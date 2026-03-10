package com.campustrack.controller;

import com.campustrack.entity.User;
import com.campustrack.repository.UserRepository;
import com.campustrack.dto.UserProfileDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/profiles/";

    @GetMapping("/{email}")
    public ResponseEntity<UserProfileDTO> getProfile(@PathVariable String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            UserProfileDTO profile = new UserProfileDTO();
            profile.setName(user.getName());
            profile.setEmail(user.getEmail());
            profile.setPhoneNumber(user.getPhoneNumber());
            profile.setRegNo(user.getRegNo());
            profile.setCourse(user.getCourse());
            profile.setAddress(user.getAddress());
            profile.setProfilePhoto(user.getProfilePhoto());
            profile.setOnline(user.isOnline());
            profile.setLastSeen(user.getLastSeen() != null ? user.getLastSeen().toString() : null);
            return ResponseEntity.ok(profile);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{email}")
    public ResponseEntity<String> updateProfile(@PathVariable String email, @RequestBody UserProfileDTO profileDTO) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setName(profileDTO.getName());
            user.setPhoneNumber(profileDTO.getPhoneNumber());
            user.setRegNo(profileDTO.getRegNo());
            user.setCourse(profileDTO.getCourse());
            user.setAddress(profileDTO.getAddress());
            // profilePhoto update might be handled separately via file upload
            userRepository.save(user);
            return ResponseEntity.ok("Profile updated successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/upload-photo/{email}")
    public ResponseEntity<String> uploadPhoto(@PathVariable String email, @RequestParam("file") MultipartFile file) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            try {
                if (file.isEmpty()) {
                    return ResponseEntity.badRequest().body("File is empty");
                }

                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(filename);
                Files.copy(file.getInputStream(), filePath);

                User user = userOpt.get();
                user.setProfilePhoto("/api/profile/photo/" + filename);
                userRepository.save(user);

                return ResponseEntity.ok(user.getProfilePhoto());
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Failed to upload photo: " + e.getMessage());
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/photo/{filename:.+}")
    @ResponseBody
    public ResponseEntity<byte[]> getPhoto(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename);
            byte[] image = Files.readAllBytes(filePath);
            return ResponseEntity.ok().body(image);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
