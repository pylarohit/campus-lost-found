package com.campustrack.repository;

import com.campustrack.entity.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {
    List<LostItem> findByReportedBy(String reportedBy);

    List<LostItem> findByFlaggedTrue();

    List<LostItem> findByStatus(String status);

    List<LostItem> findByCategory(String category);

    List<LostItem> findByItemNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String itm, String desc);
}