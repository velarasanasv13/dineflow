package com.dineflow.dto;

import com.dineflow.entity.ItemStatus;
import com.dineflow.entity.OrderStatus;
import com.dineflow.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusUpdateRequest {
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private Long itemId;
    private ItemStatus itemStatus;
}

