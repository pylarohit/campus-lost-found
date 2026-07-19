package com.campustrack.repository;

import com.campustrack.entity.MessageReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageReportRepository extends MongoRepository<MessageReport, String> {
    List<MessageReport> findByStatus(String status);
}
