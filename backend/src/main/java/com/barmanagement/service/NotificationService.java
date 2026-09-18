package com.barmanagement.service;

import com.barmanagement.enums.NotificationType;
import com.barmanagement.payload.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> getMyNotifications();

    List<NotificationResponse> getMyUnreadNotifications();

    long getMyUnreadCount();

    void markAsRead(Long notificationId);

    void markAllAsRead();

    void createNotification(
            Long userId,
            String title,
            String message,
            NotificationType type
    );
}