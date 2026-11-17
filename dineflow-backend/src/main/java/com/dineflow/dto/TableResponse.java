package com.dineflow.dto;

import com.dineflow.entity.TableStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableResponse {
    private Long id;
    private String tableNumber;
    private Integer capacity;
    private String qrCodeToken;
    private String qrUrl;
    private TableStatus status;
    private boolean active;
    private int activeOrderCount;
    private LocalDateTime createdAt;
}

