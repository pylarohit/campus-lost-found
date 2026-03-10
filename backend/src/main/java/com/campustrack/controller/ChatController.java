package com.campustrack.controller;

import com.campustrack.entity.ChatMessage;
import com.campustrack.entity.ChatRoom;
import com.campustrack.repository.ChatMessageRepository;
import com.campustrack.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

import com.campustrack.repository.MessageReportRepository;
import com.campustrack.entity.MessageReport;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatMessageRepository messageRepository;

    @Autowired
    private ChatRoomRepository roomRepository;

    @Autowired
    private MessageReportRepository reportRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // ── WebSocket: Send Message ───────────────────────
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload Map<String, String> payload) {
        String roomId = payload.get("roomId");
        String senderEmail = payload.get("senderEmail");
        String senderName = payload.get("senderName");
        String content = payload.get("content");

        // Save the message
        ChatMessage message = new ChatMessage(roomId, senderEmail, senderName, content);
        messageRepository.save(message);

        // Update room's last message
        roomRepository.findByRoomId(roomId).ifPresent(room -> {
            room.setLastMessage(content);
            room.setLastMessageAt(LocalDateTime.now());

            // Increment unread for the other participant
            if (room.getParticipantOne().equals(senderEmail)) {
                room.setUnreadCountTwo(room.getUnreadCountTwo() + 1);
            } else {
                room.setUnreadCountOne(room.getUnreadCountOne() + 1);
            }
            roomRepository.save(room);
        });

        // Broadcast to the room topic
        Map<String, Object> response = new HashMap<>();
        response.put("id", message.getId());
        response.put("roomId", roomId);
        response.put("senderEmail", senderEmail);
        response.put("senderName", senderName);
        response.put("content", content);
        response.put("sentAt", message.getSentAt().toString());
        response.put("messageType", message.getMessageType());

        messagingTemplate.convertAndSend("/topic/room." + roomId, (Object) response);
    }

    // ── REST: Get or Create a Chat Room ───────────────
    @PostMapping("/room")
    public ResponseEntity<?> getOrCreateRoom(@RequestBody Map<String, String> body) {
        String userOne = body.get("participantOne");
        String userTwo = body.get("participantTwo");
        String roomType = body.getOrDefault("roomType", "USER_USER");

        // Generate a deterministic room ID
        String roomId;
        if ("USER_ADMIN".equals(roomType)) {
            roomId = "support_" + userOne.replaceAll("[^a-zA-Z0-9]", "_");
        } else {
            String[] sorted = { userOne, userTwo };
            Arrays.sort(sorted);
            roomId = "chat_" + sorted[0].replaceAll("[^a-zA-Z0-9]", "_") + "_" +
                    sorted[1].replaceAll("[^a-zA-Z0-9]", "_");
        }

        Optional<ChatRoom> existing = roomRepository.findByRoomId(roomId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        ChatRoom room = new ChatRoom(roomId, userOne, userTwo, roomType);
        roomRepository.save(room);
        return ResponseEntity.ok(room);
    }

    // ── REST: Get User's Chat Rooms ───────────────────
    @GetMapping("/rooms")
    public ResponseEntity<?> getUserRooms(@RequestParam String email) {
        List<ChatRoom> rooms = roomRepository.findByParticipant(email);
        return ResponseEntity.ok(rooms);
    }

    // ── REST: Get All Admin Support Rooms ─────────────
    @GetMapping("/rooms/admin")
    public ResponseEntity<?> getAdminRooms() {
        List<ChatRoom> rooms = roomRepository.findAllAdminRooms();
        return ResponseEntity.ok(rooms);
    }

    // ── REST: Get Messages for a Room ─────────────────
    @GetMapping("/messages/{roomId}")
    public ResponseEntity<?> getMessages(@PathVariable String roomId) {
        List<ChatMessage> messages = messageRepository.findByRoomIdOrderBySentAtAsc(roomId);
        return ResponseEntity.ok(messages);
    }

    // ── REST: Mark Messages as Read ───────────────────
    @PostMapping("/read")
    public ResponseEntity<?> markAsRead(@RequestBody Map<String, String> body) {
        String roomId = body.get("roomId");
        String email = body.get("email");

        messageRepository.markAsRead(roomId, email);

        // Reset unread count for this user
        roomRepository.findByRoomId(roomId).ifPresent(room -> {
            if (room.getParticipantOne().equals(email)) {
                room.setUnreadCountOne(0);
            } else {
                room.setUnreadCountTwo(0);
            }
            roomRepository.save(room);
        });

        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    // ── REST: Search Users for Starting a Chat ────────
    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(List.of());
    }

    // ── REST: Report Inappropriate Message ────────────
    @PostMapping("/report")
    public ResponseEntity<?> reportMessage(@RequestBody Map<String, String> body) {
        Long messageId = Long.parseLong(body.get("messageId"));
        String reporterEmail = body.get("reporterEmail");
        String reason = body.get("reason");
        String detail = body.get("detail");

        Optional<ChatMessage> msg = messageRepository.findById(messageId);
        if (msg.isPresent()) {
            ChatMessage message = msg.get();
            MessageReport report = new MessageReport(
                    messageId,
                    reporterEmail,
                    reason,
                    message.getContent(),
                    message.getSenderEmail());
            report.setDetail(detail);
            reportRepository.save(report);
            return ResponseEntity.ok(Map.of("status", "reported"));
        }
        return ResponseEntity.notFound().build();
    }
}
