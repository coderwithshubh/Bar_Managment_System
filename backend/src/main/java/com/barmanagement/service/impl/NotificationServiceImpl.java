package com.barmanagement.service.impl;

import com.barmanagement.enums.NotificationType;
import com.barmanagement.model.Notification;
import com.barmanagement.model.User;
import com.barmanagement.payload.response.NotificationResponse;
import com.barmanagement.repository.NotificationRepository;
import com.barmanagement.repository.UserRepository;
import com.barmanagement.service.NotificationService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl
        implements NotificationService {


    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {

        this.notificationRepository =
                notificationRepository;

        this.userRepository =
                userRepository;
    }


    // ==========================================
    // GET CURRENT USER
    // ==========================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        String email =
                authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found."
                        )
                );
    }


    // ==========================================
    // GET ALL MY NOTIFICATIONS
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse>
    getMyNotifications() {

        User user = getCurrentUser();

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // ==========================================
    // GET UNREAD NOTIFICATIONS
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse>
    getMyUnreadNotifications() {

        User user = getCurrentUser();

        return notificationRepository
                .findByUserAndReadFalseOrderByCreatedAtDesc(
                        user
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // ==========================================
    // GET UNREAD COUNT
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public long getMyUnreadCount() {

        User user = getCurrentUser();

        return notificationRepository
                .countByUserAndReadFalse(user);
    }


    // ==========================================
    // MARK ONE AS READ
    // ==========================================

    @Override
    public void markAsRead(Long notificationId) {

        if (notificationId == null) {

            throw new RuntimeException(
                    "Notification ID is required."
            );
        }

        User user = getCurrentUser();

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found."
                                )
                        );


        // --------------------------------------
        // Security check
        // --------------------------------------

        if (!notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to modify this notification."
            );
        }


        notification.setRead(true);

        notificationRepository.save(
                notification
        );
    }


    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    @Override
    public void markAllAsRead() {

        User user = getCurrentUser();

        List<Notification> notifications =
                notificationRepository
                        .findByUserOrderByCreatedAtDesc(user);

        for (Notification notification :
                notifications) {

            if (!Boolean.TRUE.equals(
                    notification.getRead())) {

                notification.setRead(true);
            }
        }

        notificationRepository.saveAll(
                notifications
        );
    }


    // ==========================================
    // CREATE NOTIFICATION
    // ==========================================

    @Override
    public void createNotification(
            Long userId,
            String title,
            String message,
            NotificationType type
    ) {

        if (userId == null) {

            throw new RuntimeException(
                    "User ID is required."
            );
        }

        if (title == null ||
                title.trim().isEmpty()) {

            throw new RuntimeException(
                    "Notification title is required."
            );
        }

        if (message == null ||
                message.trim().isEmpty()) {

            throw new RuntimeException(
                    "Notification message is required."
            );
        }

        if (type == null) {

            throw new RuntimeException(
                    "Notification type is required."
            );
        }


        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );


        Notification notification =
                new Notification();

        notification.setUser(user);

        notification.setTitle(
                title.trim()
        );

        notification.setMessage(
                message.trim()
        );

        notification.setType(type);

        notification.setRead(false);

        notificationRepository.save(
                notification
        );
    }


    // ==========================================
    // ENTITY → RESPONSE
    // ==========================================

    private NotificationResponse
    mapToResponse(Notification notification) {

        NotificationResponse response =
                new NotificationResponse();

        response.setId(
                notification.getId()
        );

        response.setTitle(
                notification.getTitle()
        );

        response.setMessage(
                notification.getMessage()
        );

        response.setType(
                notification.getType()
        );

        response.setRead(
                notification.getRead()
        );

        response.setCreatedAt(
                notification.getCreatedAt()
        );

        return response;
    }
}