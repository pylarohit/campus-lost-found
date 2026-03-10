package com.campustrack.controller;

import com.campustrack.entity.User;
import com.campustrack.entity.Admin;
import com.campustrack.repository.UserRepository;
import com.campustrack.repository.AdminRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    // 📌 USER LOGIN — checks verification status
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        // If email belongs to ADMIN
        if (adminRepository.findByEmail(user.getEmail()).isPresent()) {
            return "ADMIN";
        }

        // Check USER table
        User existingUser = userRepository.findByEmail(user.getEmail()).orElse(null);

        if (existingUser == null) {
            return "INVALID";
        }

        if (!existingUser.getPassword().equals(user.getPassword())) {
            return "INVALID";
        }

        // Check if verified
        if (!existingUser.isVerified()) {
            return "UNVERIFIED";
        }

        return "USER";
    }

    // 📌 USER REGISTRATION — creates unverified account
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {

        // Check if email already exists
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("status", "EXISTS"));
        }

        // Check if email is in admin table
        if (adminRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("status", "ADMIN_EMAIL"));
        }

        // Create unverified user
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setName(user.getName());
        newUser.setRegNo(user.getRegNo());
        newUser.setVerified(false);

        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("status", "REGISTERED"));
    }
}
