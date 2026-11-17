package com.dineflow.controller;

import com.dineflow.dto.ApiResponse;
import com.dineflow.dto.OrderRequest;
import com.dineflow.dto.OrderResponse;
import com.dineflow.dto.OrderStatusUpdateRequest;
import com.dineflow.entity.OrderStatus;
import com.dineflow.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Public Customer Endpoints (NO login required)
    @PostMapping("/api/orders")
    public ResponseEntity<ApiResponse> placeOrder(@Valid @RequestBody OrderRequest request) {
        try {
            OrderResponse response = orderService.placeOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Order placed successfully! Sent to kitchen.", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/api/orders/track/{orderNumber}")
    public ResponseEntity<ApiResponse> trackOrder(@PathVariable String orderNumber) {
        try {
            OrderResponse response = orderService.getOrderByNumber(orderNumber);
            return ResponseEntity.ok(ApiResponse.success("Order status retrieved", response));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/api/orders/session/{sessionId}")
    public ResponseEntity<ApiResponse> getCustomerSessionOrders(@PathVariable String sessionId) {
        List<OrderResponse> orders = orderService.getOrdersByCustomerSession(sessionId);
        return ResponseEntity.ok(ApiResponse.success("Customer orders retrieved", orders));
    }

    @GetMapping("/api/orders/table/{tableNumber}")
    public ResponseEntity<ApiResponse> getTableOrders(@PathVariable String tableNumber) {
        List<OrderResponse> orders = orderService.getActiveOrdersByTable(tableNumber);
        return ResponseEntity.ok(ApiResponse.success("Active table orders retrieved", orders));
    }

    // Admin / Kitchen Endpoints
    @GetMapping("/api/admin/orders")
    public ResponseEntity<ApiResponse> getAllOrders(
            @RequestParam(value = "status", required = false) OrderStatus status
    ) {
        List<OrderResponse> orders = orderService.getAllOrders(status);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orders));
    }

    @PatchMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<ApiResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        try {
            OrderResponse response = orderService.updateOrderStatus(id, request);
            return ResponseEntity.ok(ApiResponse.success("Order updated successfully", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}

