package com.campustrack.repository;

import com.campustrack.entity.LostItem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LostItemRepository extends MongoRepository<LostItem, String> {
    List<LostItem> findByReportedBy(String reportedBy);

    List<LostItem> findByFlaggedTrue();

    List<LostItem> findByStatus(String status);

    List<LostItem> findByCategory(String category);

    List<LostItem> findByItemNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String itm, String desc);
}