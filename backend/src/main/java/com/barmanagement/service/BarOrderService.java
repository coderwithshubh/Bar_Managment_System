package com.barmanagement.service;

import com.barmanagement.payload.request.BarOrderRequest;
import com.barmanagement.payload.response.BarOrderResponse;

import java.util.List;

public interface BarOrderService {

    // ==========================================
    // CREATE ORDER
    // ==========================================

    BarOrderResponse createOrder(
            BarOrderRequest request
    );


    // ==========================================
    // GET ALL ORDERS
    // ==========================================

    List<BarOrderResponse> getAllOrders();


    // ==========================================
    // GET ORDER BY ID
    // ==========================================

    BarOrderResponse getOrderById(
            Long id
    );


    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    BarOrderResponse updateOrderStatus(
            Long id,
            String status
    );


    // ==========================================
    // CANCEL ORDER
    // ==========================================

    BarOrderResponse cancelOrder(
            Long id
    );


    // ==========================================
    // COMPLETE ORDER
    // ==========================================

    BarOrderResponse completeOrder(
            Long id
    );
}