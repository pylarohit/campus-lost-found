package com.campustrack.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document
public class ChatMessage {

    @Id
    private String id;

        private String roomId;

        private String senderEmail;

        private String senderName;

        private String content;

        private String messageType = "TEXT"; // TEXT, IMAGE, SYSTEM

        private LocalDateTime sentAt = LocalDateTime.now();

        private boolean isRead = false;

    public ChatMessage() {
    }

    public ChatMessage(String roomId, String senderEmail, String senderName, String content) {
        this.roomId = roomId;
        this.senderEmail = senderEmail;
        this.senderName = senderName;
        this.content = content;
        this.sentAt = LocalDateTime.now();
    }

    // Getters & Setters
    public String getId() {
        return id;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }
}
