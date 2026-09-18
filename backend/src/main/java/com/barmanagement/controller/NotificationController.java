package com.barmanagement.controller;

import com.barmanagement.payload.response.NotificationResponse;
import com.barmanagement.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {


    private final NotificationService notificationService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public NotificationController(
            NotificationService notificationService
    ) {

        this.notificationService =
                notificationService;
    }


    // ==========================================
    // GET ALL NOTIFICATIONS
    // ==========================================

    @GetMapping
    public ResponseEntity<
            List<NotificationResponse>
            > getMyNotifications() {

        return ResponseEntity.ok(
                notificationService
                        .getMyNotifications()
        );
    }


    // ==========================================
    // GET UNREAD NOTIFICATIONS
    // ==========================================

    @GetMapping("/unread")
    public ResponseEntity<
            List<NotificationResponse>
            > getMyUnreadNotifications() {

        return ResponseEntity.ok(
                notificationService
                        .getMyUnreadNotifications()
        );
    }


    // ==========================================
    // GET UNREAD COUNT
    // ==========================================

    @GetMapping("/unread/count")
    public ResponseEntity<Long>
    getMyUnreadCount() {

        return ResponseEntity.ok(
                notificationService
                        .getMyUnreadCount()
        );
    }


    // ==========================================
    // MARK ONE AS READ
    // ==========================================

    @PatchMapping("/{id}/read")
    public ResponseEntity<String>
    markAsRead(
            @PathVariable Long id
    ) {

        notificationService.markAsRead(id);

        return ResponseEntity.ok(
                "Notification marked as read."
        );
    }


    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    @PatchMapping("/read-all")
    public ResponseEntity<String>
    markAllAsRead() {

        notificationService.markAllAsRead();

        return ResponseEntity.ok(
                "All notifications marked as read."
        );
    }
}