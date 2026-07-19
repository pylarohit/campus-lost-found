package com.campustrack.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document
public class MessageReport {

    @Id
    private String id;
        private String messageId;

        private String reporterEmail;

        private String reason;

        private String detail;

        private String status = "PENDING"; // PENDING, RESOLVED, DISMISSED

        private LocalDateTime reportedAt = LocalDateTime.now();

    // To store context for the admin (content of the reported message)
        private String messageContent;

        private String senderEmail;

    public MessageReport() {
    }

    public MessageReport(String messageId, String reporterEmail, String reason, String messageContent,
            String senderEmail) {
        this.messageId = messageId;
        this.reporterEmail = reporterEmail;
        this.reason = reason;
        this.messageContent = messageContent;
        this.senderEmail = senderEmail;
        this.reportedAt = LocalDateTime.now();
    }

    // Getters & Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
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
