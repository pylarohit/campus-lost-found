package com.campustrack.repository;

import com.campustrack.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByRoomIdOrderBySentAtAsc(String roomId);

    @Query("SELECT m FROM ChatMessage m WHERE m.roomId = :roomId AND m.isRead = false AND m.senderEmail != :email")
    List<ChatMessage> findUnreadMessages(@Param("roomId") String roomId, @Param("email") String email);

    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.roomId = :roomId AND m.senderEmail != :email AND m.isRead = false")
    void markAsRead(@Param("roomId") String roomId, @Param("email") String email);
}
