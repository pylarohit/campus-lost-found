package com.campustrack.config;

import com.campustrack.entity.User;
import com.campustrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class ChatStatusHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String email = headers.getFirstNativeHeader("email");

        if (email != null) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                if (headers.getSessionAttributes() != null) {
                    headers.getSessionAttributes().put("email", email);
                }
                User user = userOpt.get();
                user.setOnline(true);
                user.setLastSeen(LocalDateTime.now());
                userRepository.save(user);

                broadcastStatus(email, true, null);
            }
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String email = (String) headers.getSessionAttributes().get("email");

        if (email != null) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setOnline(false);
                user.setLastSeen(LocalDateTime.now());
                userRepository.save(user);

                broadcastStatus(email, false, user.getLastSeen());
            }
        }
    }

    private void broadcastStatus(String email, boolean online, LocalDateTime lastSeen) {
        Map<String, Object> status = new HashMap<>();
        status.put("email", email);
        status.put("online", online);
        status.put("lastSeen", lastSeen != null ? lastSeen.toString() : null);

        messagingTemplate.convertAndSend("/topic/status", (Object) status);
    }
}
