package com.barmanagement.repository;

import com.barmanagement.model.BarOrderItem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarOrderItemRepository
        extends JpaRepository<BarOrderItem, Long> {

    List<BarOrderItem> findByOrderId(
            Long orderId
    );
}