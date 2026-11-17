package com.dineflow.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KitchenStatsResponse {
    private long totalActive;
    private long pending;
    private long confirmed;
    private long preparing;
    private long ready;
}

