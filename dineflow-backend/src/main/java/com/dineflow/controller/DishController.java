package com.dineflow.controller;

import com.dineflow.dto.ApiResponse;
import com.dineflow.dto.DishRequest;
import com.dineflow.dto.DishResponse;
import com.dineflow.dto.MenuStatsResponse;
import com.dineflow.entity.DietaryType;
import com.dineflow.service.DishService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DishController {

    private final DishService dishService;

    // Public endpoints for customers & menu browsing
    @GetMapping("/api/dishes")
    public ResponseEntity<ApiResponse> getDishes(
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "dietaryType", required = false) DietaryType dietaryType,
            @RequestParam(value = "available", required = false) Boolean available,
            @RequestParam(value = "search", required = false) String search
    ) {
        List<DishResponse> dishes = dishService.searchDishes(categoryId, dietaryType, available, search);
        return ResponseEntity.ok(ApiResponse.success("Dishes retrieved", dishes));
    }

    @GetMapping("/api/dishes/{id}")
    public ResponseEntity<ApiResponse> getDishById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Dish retrieved", dishService.getDishById(id)));
    }

    // Admin endpoints
    @GetMapping("/api/admin/menu/stats")
    public ResponseEntity<ApiResponse> getMenuStats() {
        MenuStatsResponse stats = dishService.getMenuStats();
        return ResponseEntity.ok(ApiResponse.success("Menu stats retrieved", stats));
    }

    @PostMapping("/api/admin/dishes")
    public ResponseEntity<ApiResponse> createDish(@Valid @RequestBody DishRequest request) {
        DishResponse response = dishService.createDish(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Dish created successfully", response));
    }

    @PutMapping("/api/admin/dishes/{id}")
    public ResponseEntity<ApiResponse> updateDish(
            @PathVariable Long id,
            @Valid @RequestBody DishRequest request
    ) {
        DishResponse response = dishService.updateDish(id, request);
        return ResponseEntity.ok(ApiResponse.success("Dish updated successfully", response));
    }

    @PatchMapping("/api/admin/dishes/{id}/availability")
    public ResponseEntity<ApiResponse> toggleAvailability(
            @PathVariable Long id,
            @RequestParam(value = "available", required = false) Boolean available
    ) {
        DishResponse response = dishService.toggleAvailability(id, available);
        return ResponseEntity.ok(ApiResponse.success("Dish availability updated", response));
    }

    @DeleteMapping("/api/admin/dishes/{id}")
    public ResponseEntity<ApiResponse> deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
        return ResponseEntity.ok(ApiResponse.success("Dish deleted successfully", null));
    }
}

