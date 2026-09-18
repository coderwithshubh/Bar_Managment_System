package com.barmanagement.service;

import com.barmanagement.payload.request.BarBillPaymentRequest;
import com.barmanagement.payload.request.BarBillRequest;
import com.barmanagement.payload.response.BarBillResponse;

import java.util.List;

public interface BarBillService {

    BarBillResponse createBill(
            BarBillRequest request
    );

    List<BarBillResponse> getAllBills();

    BarBillResponse getBillById(
            Long id
    );

    BarBillResponse getBillByNumber(
            String billNumber
    );

    BarBillResponse getBillByOrderId(
            Long orderId
    );

    List<BarBillResponse> getBillsByPaymentStatus(
            String paymentStatus
    );

    BarBillResponse updatePayment(
            Long id,
            BarBillPaymentRequest request
    );

    BarBillResponse voidBill(
            Long id,
            String reason
    );
}