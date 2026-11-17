package com.dineflow.repository;

import com.dineflow.entity.RestaurantTable;
import com.dineflow.entity.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TableRepository extends JpaRepository<RestaurantTable, Long> {

    Optional<RestaurantTable> findByTableNumberIgnoreCase(String tableNumber);

    Optional<RestaurantTable> findByQrCodeToken(String qrCodeToken);

    boolean existsByTableNumberIgnoreCase(String tableNumber);

    List<RestaurantTable> findByActiveTrueOrderByTableNumberAsc();

    List<RestaurantTable> findAllByOrderByTableNumberAsc();

    long countByStatus(TableStatus status);
}

