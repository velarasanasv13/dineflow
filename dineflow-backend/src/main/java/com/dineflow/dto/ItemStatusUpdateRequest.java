package com.dineflow.dto;

import com.dineflow.entity.ItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemStatusUpdateRequest {
    private ItemStatus itemStatus;
}

