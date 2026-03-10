package com.campustrack.controller;

import com.campustrack.entity.FoundItem;
import com.campustrack.repository.FoundItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/found")
@CrossOrigin(origins = "*")
public class FoundItemController {

    @Autowired
    private FoundItemRepository repository;

    // 📌 REPORT FOUND ITEM
    @PostMapping("/report")
    public FoundItem reportFoundItem(@RequestBody FoundItem item) {
        return repository.save(item);
    }

    // 📌 GET ALL FOUND ITEMS
    @GetMapping("/all")
    public List<FoundItem> getAllFoundItems() {
        return repository.findAll();
    }

    // 📌 GET APPROVED FOUND ITEMS (public hub)
    @GetMapping("/approved")
    public List<FoundItem> getApprovedFoundItems() {
        return repository.findByStatus("active");
    }

    // 📌 GET ITEMS BY USER
    @GetMapping("/my")
    public List<FoundItem> getMyItems(@RequestParam String email) {
        return repository.findByFoundBy(email);
    }

    // 📌 FLAG AN ITEM
    @PutMapping("/{id}/flag")
    public ResponseEntity<Map<String, String>> flagItem(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        FoundItem item = repository.findById(id).orElse(null);
        if (item == null)
            return ResponseEntity.notFound().build();
        item.setFlagged(true);
        item.setStatus("flagged");
        item.setFlagReason(body.getOrDefault("reason", "Reported by user"));
        repository.save(item);
        return ResponseEntity.ok(Map.of("status", "FLAGGED"));
    }

    // 📌 DELETE FOUND ITEM
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoundItem(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
