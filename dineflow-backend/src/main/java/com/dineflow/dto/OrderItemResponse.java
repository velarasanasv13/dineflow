package com.dineflow.dto;

import com.dineflow.entity.DietaryType;
import com.dineflow.entity.ItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private Long id;
    private Long dishId;
    private String dishName;
    private String imageUrl;
    private DietaryType dietaryType;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
    private ItemStatus itemStatus;
    private String specialNotes;
}

