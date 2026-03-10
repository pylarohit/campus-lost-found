package com.campustrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "message_report")
public class MessageReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_id", nullable = false)
    private Long messageId;

    @Column(name = "reporter_email", nullable = false)
    private String reporterEmail;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String detail;

    @Column(name = "status")
    private String status = "PENDING"; // PENDING, RESOLVED, DISMISSED

    @Column(name = "reported_at")
    private LocalDateTime reportedAt = LocalDateTime.now();

    // To store context for the admin (content of the reported message)
    @Column(columnDefinition = "TEXT")
    private String messageContent;

    @Column(name = "sender_email")
    private String senderEmail;

    public MessageReport() {
    }

    public MessageReport(Long messageId, String reporterEmail, String reason, String messageContent,
            String senderEmail) {
        this.messageId = messageId;
        this.reporterEmail = reporterEmail;
        this.reason = reason;
        this.messageContent = messageContent;
        this.senderEmail = senderEmail;
        this.reportedAt = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public String getReporterEmail() {
        return reporterEmail;
    }

    public void setReporterEmail(String reporterEmail) {
        this.reporterEmail = reporterEmail;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getReportedAt() {
        return reportedAt;
    }

    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }
}
