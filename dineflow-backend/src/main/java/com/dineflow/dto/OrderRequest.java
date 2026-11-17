package com.dineflow.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {

    @NotBlank(message = "Table identifier is required")
    private String tableNumber; // Table number or QR token

    @NotBlank(message = "Customer name is required")
    private String customerName; // "Rahul", "Priya", etc.

    @NotBlank(message = "Customer session ID is required")
    private String customerSessionId; // Unique UUID for client browser

    private String specialInstructions;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;
}

