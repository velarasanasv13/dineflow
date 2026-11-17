package com.dineflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BillResponse {
    private Long orderId;
    private String orderNumber;
    private String tableNumber;
    private String customerName;
    private List<BillItemLine> items;
    private BigDecimal subtotal;
    private BigDecimal gstRate;
    private BigDecimal gstAmount;
    private BigDecimal grandTotal;
    private String paymentStatus;
    private String status;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class BillItemLine {
        private String dishName;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal subtotal;
    }
}

