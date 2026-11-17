package com.dineflow.repository;

import com.dineflow.entity.Order;
import com.dineflow.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByTableIdOrderByCreatedAtDesc(Long tableId);

    List<Order> findByTableTableNumberIgnoreCaseOrderByCreatedAtDesc(String tableNumber);

    List<Order> findByCustomerSessionIdOrderByCreatedAtDesc(String customerSessionId);

    List<Order> findByStatusInOrderByCreatedAtDesc(List<OrderStatus> statuses);

    List<Order> findByStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);

    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT o FROM Order o WHERE o.table.tableNumber = :tableNumber AND o.status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY o.createdAt DESC")
    List<Order> findActiveOrdersByTable(@Param("tableNumber") String tableNumber);

    long countByStatus(OrderStatus status);

    // ── Reporting ──────────────────────────────────────────────────────────────
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status NOT IN ('CANCELLED')")
    java.math.BigDecimal sumTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'COMPLETED'")
    long countCompleted();

    @Query("SELECT AVG(o.totalAmount) FROM Order o WHERE o.status NOT IN ('CANCELLED')")
    java.math.BigDecimal avgOrderValue();

    /** Top dishes: [dishName, totalQty, totalRevenue] */
    @Query("SELECT i.dishName, SUM(i.quantity), SUM(i.subtotal) FROM OrderItem i GROUP BY i.dishName ORDER BY SUM(i.quantity) DESC")
    List<Object[]> findTopDishes();

    /** Daily revenue for last N days: [date, revenue, orderCount] */
    @Query(value = "SELECT DATE(created_at) AS day, SUM(total_amount), COUNT(*) FROM orders WHERE status <> 'CANCELLED' AND created_at >= CURRENT_DATE - INTERVAL '30 days' GROUP BY day ORDER BY day DESC", nativeQuery = true)
    List<Object[]> findDailyRevenue();
}

