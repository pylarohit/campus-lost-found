package com.campustrack.repository;

import com.campustrack.entity.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {

    Optional<ChatRoom> findByRoomId(String roomId);

    @Query(value = "{ '$or': [ { 'participantOne': ?0 }, { 'participantTwo': ?0 } ] }", sort = "{ 'lastMessageAt': -1 }")
    List<ChatRoom> findByParticipant(String email);

    @Query("{ 'roomType': ?1, '$or': [ { 'participantOne': ?0 }, { 'participantTwo': ?0 } ] }")
    List<ChatRoom> findByParticipantAndRoomType(String email, String roomType);

    @Query(value = "{ 'roomType': 'USER_ADMIN' }", sort = "{ 'lastMessageAt': -1 }")
    List<ChatRoom> findAllAdminRooms();
}
