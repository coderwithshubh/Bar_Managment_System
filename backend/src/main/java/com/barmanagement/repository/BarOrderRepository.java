package com.barmanagement.repository;

import com.barmanagement.enums.BarOrderStatus;
import com.barmanagement.model.BarOrder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarOrderRepository
        extends JpaRepository<BarOrder, Long> {

    Optional<BarOrder> findByOrderNumber(
            String orderNumber
    );

    boolean existsByOrderNumber(
            String orderNumber
    );

    boolean existsByTable_IdAndStatus(
            Long tableId,
            BarOrderStatus status
    );

    List<BarOrder> findByStatus(
            BarOrderStatus status
    );

    List<BarOrder> findByTable_Id(
            Long tableId
    );
}