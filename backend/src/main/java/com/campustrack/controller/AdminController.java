package com.campustrack.controller;

import com.campustrack.entity.Admin;
import com.campustrack.entity.LostItem;
import com.campustrack.entity.FoundItem;
import com.campustrack.entity.User;
import com.campustrack.entity.MessageReport;
import com.campustrack.repository.AdminRepository;
import com.campustrack.repository.ChatMessageRepository;
import com.campustrack.repository.LostItemRepository;
import com.campustrack.repository.FoundItemRepository;
import com.campustrack.repository.UserRepository;
import com.campustrack.repository.MessageReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LostItemRepository lostItemRepository;

    @Autowired
    private FoundItemRepository foundItemRepository;

    @Autowired
    private MessageReportRepository reportRepository;

    @Autowired
    private ChatMessageRepository messageRepository;

    // ═══════════════════════════════════════════════
    // 📌 ADMIN LOGIN
    // ═══════════════════════════════════════════════
    @PostMapping("/login")
    public String login(@RequestBody Admin admin) {
        Admin existing = adminRepository
                .findByEmail(admin.getEmail())
                .orElse(null);

        if (existing != null && existing.getPassword().equals(admin.getPassword())) {
            return "Admin Login Success";
        } else {
            return "Invalid Admin Credentials";
        }
    }

    // ═══════════════════════════════════════════════
    // 📌 USER MANAGEMENT
    // ═══════════════════════════════════════════════

    @GetMapping("/users/unverified")
    public List<User> getUnverifiedUsers() {
        return userRepository.findByVerifiedFalse();
    }

    @GetMapping("/users/verified")
    public List<User> getVerifiedUsers() {
        return userRepository.findByVerifiedTrue();
    }

    @GetMapping("/users/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/users/{id}/verify")
    public ResponseEntity<Map<String, String>> verifyUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            return ResponseEntity.notFound().build();
        user.setVerified(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("status", "VERIFIED", "email", user.getEmail()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> rejectUser(@PathVariable Long id) {
        if (!userRepository.existsById(id))
            return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("status", "DELETED"));
    }

    // ═══════════════════════════════════════════════
    // 📌 LOST ITEMS MANAGEMENT
    // ═══════════════════════════════════════════════

    @GetMapping("/lost/all")
    public List<LostItem> getAllLostItems() {
        return lostItemRepository.findAll();
    }

    @GetMapping("/lost/flagged")
    public List<LostItem> getFlaggedLostItems() {
        return lostItemRepository.findByFlaggedTrue();
    }

    @PutMapping("/lost/{id}/approve")
    public ResponseEntity<Map<String, String>> approveLostItem(@PathVariable Long id) {
        LostItem item = lostItemRepository.findById(id).orElse(null);
        if (item == null)
            return ResponseEntity.notFound().build();
        item.setStatus("active");
        item.setFlagged(false);
        item.setFlagReason(null);
        lostItemRepository.save(item);
        return ResponseEntity.ok(Map.of("status", "APPROVED"));
    }

    @PutMapping("/lost/{id}/edit")
    public ResponseEntity<Map<String, String>> editLostItem(
            @PathVariable Long id, @RequestBody LostItem updated) {
        LostItem item = lostItemRepository.findById(id).orElse(null);
        if (item == null)
            return ResponseEntity.notFound().build();
        if (updated.getItemName() != null)
            item.setItemName(updated.getItemName());
        if (updated.getDescription() != null)
            item.setDescription(updated.getDescription());
        if (updated.getLocation() != null)
            item.setLocation(updated.getLocation());
        if (updated.getCategory() != null)
            item.setCategory(updated.getCategory());
        if (updated.getTags() != null)
            item.setTags(updated.getTags());
        if (updated.getStatus() != null)
            item.setStatus(updated.getStatus());
        lostItemRepository.save(item);
        return ResponseEntity.ok(Map.of("status", "UPDATED"));
    }

    @DeleteMapping("/lost/{id}")
    public ResponseEntity<Map<String, String>> deleteLostItem(@PathVariable Long id) {
        if (!lostItemRepository.existsById(id))
            return ResponseEntity.notFound().build();
        lostItemRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("status", "DELETED"));
    }

    // ═══════════════════════════════════════════════
    // 📌 FOUND ITEMS MANAGEMENT
    // ═══════════════════════════════════════════════

    @GetMapping("/found/all")
    public List<FoundItem> getAllFoundItems() {
        return foundItemRepository.findAll();
    }

    @GetMapping("/found/flagged")
    public List<FoundItem> getFlaggedFoundItems() {
        return foundItemRepository.findByFlaggedTrue();
    }

    @PutMapping("/found/{id}/approve")
    public ResponseEntity<Map<String, String>> approveFoundItem(@PathVariable Long id) {
        FoundItem item = foundItemRepository.findById(id).orElse(null);
        if (item == null)
            return ResponseEntity.notFound().build();
        item.setStatus("active");
        item.setFlagged(false);
        item.setFlagReason(null);
        foundItemRepository.save(item);
        return ResponseEntity.ok(Map.of("status", "APPROVED"));
    }

    @PutMapping("/found/{id}/edit")
    public ResponseEntity<Map<String, String>> editFoundItem(
            @PathVariable Long id, @RequestBody FoundItem updated) {
        FoundItem item = foundItemRepository.findById(id).orElse(null);
        if (item == null)
            return ResponseEntity.notFound().build();
        if (updated.getItemName() != null)
            item.setItemName(updated.getItemName());
        if (updated.getDescription() != null)
            item.setDescription(updated.getDescription());
        if (updated.getLocation() != null)
            item.setLocation(updated.getLocation());
        if (updated.getCategory() != null)
            item.setCategory(updated.getCategory());
        if (updated.getTags() != null)
            item.setTags(updated.getTags());
        if (updated.getStatus() != null)
            item.setStatus(updated.getStatus());
        foundItemRepository.save(item);
        return ResponseEntity.ok(Map.of("status", "UPDATED"));
    }

    @DeleteMapping("/found/{id}")
    public ResponseEntity<Map<String, String>> deleteFoundItem(@PathVariable Long id) {
        if (!foundItemRepository.existsById(id))
            return ResponseEntity.notFound().build();
        foundItemRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("status", "DELETED"));
    }

    // ═══════════════════════════════════════════════
    // 📌 MESSAGE REPORTS MANAGEMENT
    // ═══════════════════════════════════════════════

    @GetMapping("/reports")
    public List<MessageReport> getReports(@RequestParam(defaultValue = "PENDING") String status) {
        return reportRepository.findByStatus(status);
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Map<String, String>> deleteReportedMessage(@PathVariable Long messageId) {
        if (!messageRepository.existsById(messageId))
            return ResponseEntity.notFound().build();

        messageRepository.deleteById(messageId);

        // Mark reports for this message as RESOLVED
        List<MessageReport> reports = reportRepository.findAll();
        for (MessageReport r : reports) {
            if (r.getMessageId().equals(messageId)) {
                r.setStatus("RESOLVED");
                reportRepository.save(r);
            }
        }

        return ResponseEntity.ok(Map.of("status", "DELETED & RESOLVED"));
    }

    @PutMapping("/reports/{id}/dismiss")
    public ResponseEntity<Map<String, String>> dismissReport(@PathVariable Long id) {
        MessageReport report = reportRepository.findById(id).orElse(null);
        if (report == null)
            return ResponseEntity.notFound().build();
        report.setStatus("DISMISSED");
        reportRepository.save(report);
        return ResponseEntity.ok(Map.of("status", "DISMISSED"));
    }

    // ═══════════════════════════════════════════════
    // 📌 DASHBOARD STATS
    // ═══════════════════════════════════════════════

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLostItems", lostItemRepository.count());
        stats.put("totalFoundItems", foundItemRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("flaggedLostItems", lostItemRepository.findByFlaggedTrue().size());
        stats.put("flaggedFoundItems", foundItemRepository.findByFlaggedTrue().size());
        stats.put("totalPosts", lostItemRepository.count() + foundItemRepository.count());
        return stats;
    }

    // ═══════════════════════════════════════════════
    // 📌 WEEKLY ACTIVITY
    // ═══════════════════════════════════════════════

    @GetMapping("/activity")
    public List<Map<String, Object>> getWeeklyActivity() {
        LocalDateTime now = LocalDateTime.now();
        List<LostItem> allLost = lostItemRepository.findAll();
        List<FoundItem> allFound = foundItemRepository.findAll();

        List<Map<String, Object>> weeks = new ArrayList<>();
        for (int w = 3; w >= 0; w--) {
            LocalDateTime weekStart = now.minusWeeks(w + 1).truncatedTo(ChronoUnit.DAYS);
            LocalDateTime weekEnd = now.minusWeeks(w).truncatedTo(ChronoUnit.DAYS);

            long lostCount = allLost.stream()
                    .filter(i -> i.getCreatedAt() != null
                            && !i.getCreatedAt().isBefore(weekStart)
                            && i.getCreatedAt().isBefore(weekEnd))
                    .count();

            long foundCount = allFound.stream()
                    .filter(i -> i.getCreatedAt() != null
                            && !i.getCreatedAt().isBefore(weekStart)
                            && i.getCreatedAt().isBefore(weekEnd))
                    .count();

            Map<String, Object> week = new HashMap<>();
            week.put("label", "Week " + (4 - w));
            week.put("lost", lostCount);
            week.put("found", foundCount);
            week.put("total", lostCount + foundCount);
            weeks.add(week);
        }
        return weeks;
    }
}
