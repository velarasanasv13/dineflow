package com.dineflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ReportResponse {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long completedOrders;
    private long pendingOrders;
    private BigDecimal avgOrderValue;
    private List<TopDish> topDishes;
    private List<DailyRevenue> dailyRevenue;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TopDish {
        private String dishName;
        private Long totalQuantity;
        private BigDecimal totalRevenue;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DailyRevenue {
        private String date;
        private BigDecimal revenue;
        private Long orders;
    }
}

