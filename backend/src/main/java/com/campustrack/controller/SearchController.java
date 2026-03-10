package com.campustrack.controller;

import com.campustrack.entity.FoundItem;
import com.campustrack.entity.LostItem;
import com.campustrack.repository.FoundItemRepository;
import com.campustrack.repository.LostItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    @Autowired
    private LostItemRepository lostItemRepository;

    @Autowired
    private FoundItemRepository foundItemRepository;

    @GetMapping("/items")
    public Map<String, Object> searchItems(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return Map.of("lost", List.of(), "found", List.of());
        }

        List<LostItem> lost = lostItemRepository.findByItemNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q,
                q);
        List<FoundItem> found = foundItemRepository.findByItemNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                q,
                q);

        // Filter for "active" status only
        List<LostItem> activeLost = lost.stream()
                .filter(it -> "active".equalsIgnoreCase(it.getStatus()))
                .collect(java.util.stream.Collectors.toList());

        List<FoundItem> activeFound = found.stream()
                .filter(it -> "active".equalsIgnoreCase(it.getStatus()))
                .collect(java.util.stream.Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("lost", activeLost);
        result.put("found", activeFound);
        return result;
    }
}
