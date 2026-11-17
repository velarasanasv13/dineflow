package com.dineflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuStatsResponse {
    private long totalDishes;
    private long inStockDishes;
    private long outOfStockDishes;
    private long totalCategories;
    private long vegDishes;
    private long nonVegDishes;
}

