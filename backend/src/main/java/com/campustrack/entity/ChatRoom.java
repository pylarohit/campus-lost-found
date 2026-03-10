package com.campustrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_room")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", unique = true, nullable = false)
    private String roomId;

    @Column(name = "participant_one", nullable = false)
    private String participantOne;

    @Column(name = "participant_two", nullable = false)
    private String participantTwo;

    @Column(name = "room_type", nullable = false)
    private String roomType; // "USER_USER" or "USER_ADMIN"

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_message")
    private String lastMessage;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Column(name = "unread_count_one")
    private int unreadCountOne = 0;

    @Column(name = "unread_count_two")
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
    public Long getId() {
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
