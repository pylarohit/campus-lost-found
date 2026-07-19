package com.campustrack.repository;

import com.campustrack.entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    List<ChatMessage> findByRoomIdOrderBySentAtAsc(String roomId);

    @Query("{ 'roomId': ?0, 'isRead': false, 'senderEmail': { $ne: ?1 } }")
    List<ChatMessage> findUnreadMessages(String roomId, String email);
}
