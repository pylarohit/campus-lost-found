package com.campustrack.repository;

import com.campustrack.entity.FoundItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {
    List<FoundItem> findByFoundBy(String foundBy);

    List<FoundItem> findByFlaggedTrue();

    List<FoundItem> findByStatus(String status);

    List<FoundItem> findByCategory(String category);

    List<FoundItem> findByItemNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String itm, String desc);
}
