package com.campustrack.repository;

import com.campustrack.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByRoomId(String roomId);

    @Query("SELECT r FROM ChatRoom r WHERE r.participantOne = :email OR r.participantTwo = :email ORDER BY r.lastMessageAt DESC")
    List<ChatRoom> findByParticipant(@Param("email") String email);

    @Query("SELECT r FROM ChatRoom r WHERE r.roomType = :roomType AND (r.participantOne = :email OR r.participantTwo = :email)")
    List<ChatRoom> findByParticipantAndRoomType(@Param("email") String email, @Param("roomType") String roomType);

    @Query("SELECT r FROM ChatRoom r WHERE r.roomType = 'USER_ADMIN' ORDER BY r.lastMessageAt DESC")
    List<ChatRoom> findAllAdminRooms();
}
