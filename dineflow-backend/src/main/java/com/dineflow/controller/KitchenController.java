package com.dineflow.controller;

import com.dineflow.dto.*;
import com.dineflow.entity.ItemStatus;
import com.dineflow.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/kitchen")
@RequiredArgsConstructor
public class KitchenController {

    private final OrderService orderService;

    /** Live active orders (PENDING → READY), oldest first */
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse> getKitchenOrders() {
        List<OrderResponse> orders = orderService.getKitchenOrders();
        return ResponseEntity.ok(ApiResponse.success("Kitchen orders retrieved", orders));
    }

    /** Update full order status */
    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<ApiResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Order updated", orderService.updateOrderStatus(orderId, request)));
    }

    /** Update individual dish-item preparation status */
    @PatchMapping("/items/{itemId}/status")
    public ResponseEntity<ApiResponse> updateItemStatus(
            @PathVariable Long itemId,
            @RequestBody ItemStatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Item status updated",
                orderService.updateItemStatus(itemId, request.getItemStatus())));
    }

    /** Stats: counts per status */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getStats() {
        return ResponseEntity.ok(ApiResponse.success("Kitchen stats", orderService.getKitchenStats()));
    }
}
