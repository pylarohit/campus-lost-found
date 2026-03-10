package com.campustrack.repository;

import com.campustrack.entity.MessageReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageReportRepository extends JpaRepository<MessageReport, Long> {
    List<MessageReport> findByStatus(String status);
}
