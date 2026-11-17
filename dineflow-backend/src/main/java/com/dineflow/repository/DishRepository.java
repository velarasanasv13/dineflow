package com.dineflow.repository;

import com.dineflow.entity.DietaryType;
import com.dineflow.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long>, JpaSpecificationExecutor<Dish> {

    List<Dish> findByCategoryId(Long categoryId);

    List<Dish> findByAvailableTrue();

    List<Dish> findByDietaryType(DietaryType dietaryType);

    long countByAvailable(boolean available);
}
