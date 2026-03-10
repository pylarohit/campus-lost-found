package com.campustrack.controller;

import com.campustrack.entity.LostItem;
import com.campustrack.repository.LostItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lost")
@CrossOrigin(origins = "*")
public class LostItemController {

    @Autowired
    private LostItemRepository repository;

    // 📌 SAVE LOST ITEM
    @PostMapping("/report")
    public LostItem reportLostItem(@RequestBody LostItem item) {
        return repository.save(item);
    }

    // 📌 GET ALL LOST ITEMS
    @GetMapping("/all")
    public List<LostItem> getAllLostItems() {
        return repository.findAll();
    }

    // 📌 GET APPROVED LOST ITEMS (public hub)
    @GetMapping("/approved")
    public List<LostItem> getApprovedLostItems() {
        return repository.findByStatus("active");
    }

    // 📌 GET ITEMS BY USER (History)
    @GetMapping("/my")
    public List<LostItem> getMyItems(@RequestParam String email) {
        return repository.findByReportedBy(email);
    }

    // 📌 FLAG A LOST ITEM
    @PutMapping("/{id}/flag")
    public ResponseEntity<Map<String, String>> flagItem(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        LostItem item = repository.findById(id).orElse(null);
        if (item == null)
            return ResponseEntity.notFound().build();
        item.setFlagged(true);
        item.setStatus("flagged");
        item.setFlagReason(body.getOrDefault("reason", "Reported by user"));
        repository.save(item);
        return ResponseEntity.ok(Map.of("status", "FLAGGED"));
    }

    // 📌 UPDATE LOST ITEM STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        LostItem item = repository.findById(id).orElse(null);
        if (item == null)
            return ResponseEntity.notFound().build();
        String newStatus = body.getOrDefault("status", "active");
        item.setStatus(newStatus);
        if (!"flagged".equals(newStatus)) {
            item.setFlagged(false);
            item.setFlagReason(null);
        }
        repository.save(item);
        return ResponseEntity.ok(Map.of("status", newStatus));
    }

    // 📌 DELETE LOST ITEM
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLostItem(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}