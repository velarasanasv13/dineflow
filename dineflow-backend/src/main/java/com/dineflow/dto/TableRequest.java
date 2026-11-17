package com.dineflow.dto;

import com.dineflow.entity.TableStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableRequest {
    @NotBlank(message = "Table number is required")
    private String tableNumber;
    private Integer capacity;
    private TableStatus status;
    private Boolean active;
}

