package com.dineflow.controller;

import com.dineflow.dto.ApiResponse;
import com.dineflow.dto.BillResponse;
import com.dineflow.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse> getBill(@PathVariable Long orderId) {
        try {
            BillResponse bill = billingService.generateBill(orderId);
            return ResponseEntity.ok(ApiResponse.success("Bill generated", bill));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/order/number/{orderNumber}")
    public ResponseEntity<ApiResponse> getBillByNumber(@PathVariable String orderNumber) {
        try {
            BillResponse bill = billingService.generateBillByNumber(orderNumber);
            return ResponseEntity.ok(ApiResponse.success("Bill generated", bill));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/order/{orderId}/pay")
    public ResponseEntity<ApiResponse> markPaid(@PathVariable Long orderId) {
        try {
            BillResponse bill = billingService.markPaid(orderId);
            return ResponseEntity.ok(ApiResponse.success("Payment recorded", bill));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}

