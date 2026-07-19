package com.campustrack.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document
public class ChatRoom {

    @Id
    private String id;

        private String roomId;

        private String participantOne;

        private String participantTwo;

        private String roomType; // "USER_USER" or "USER_ADMIN"

        private LocalDateTime createdAt = LocalDateTime.now();

        private String lastMessage;

        private LocalDateTime lastMessageAt;

        private int unreadCountOne = 0;

        private int unreadCountTwo = 0;

    public ChatRoom() {
    }

    public ChatRoom(String roomId, String participantOne, String participantTwo, String roomType) {
        this.roomId = roomId;
        this.participantOne = participantOne;
        this.participantTwo = participantTwo;
        this.roomType = roomType;
        this.createdAt = LocalDateTime.now();
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

    public String getParticipantOne() {
        return participantOne;
    }

    public void setParticipantOne(String participantOne) {
        this.participantOne = participantOne;
    }

    public String getParticipantTwo() {
        return participantTwo;
    }

    public void setParticipantTwo(String participantTwo) {
        this.participantTwo = participantTwo;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(LocalDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public int getUnreadCountOne() {
        return unreadCountOne;
    }

    public void setUnreadCountOne(int unreadCountOne) {
        this.unreadCountOne = unreadCountOne;
    }

    public int getUnreadCountTwo() {
        return unreadCountTwo;
    }

    public void setUnreadCountTwo(int unreadCountTwo) {
        this.unreadCountTwo = unreadCountTwo;
    }
}
