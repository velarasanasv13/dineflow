package com.dineflow.dto;

import com.dineflow.entity.DietaryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private boolean available;
    private DietaryType dietaryType;
    private Long categoryId;
    private String categoryName;
    private Integer prepTimeMinutes;
    private Integer spicyLevel;
    private boolean featured;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

