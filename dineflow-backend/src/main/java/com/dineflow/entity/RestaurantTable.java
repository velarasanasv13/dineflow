package com.dineflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "restaurant_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String tableNumber; // e.g. "T-01", "T-02", "1"

    @Builder.Default
    @Column(nullable = false)
    private Integer capacity = 4;

    @Column(nullable = false, unique = true)
    private String qrCodeToken; // UUID token for scanning

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TableStatus status = TableStatus.AVAILABLE;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @PrePersist
    public void ensureToken() {
        if (this.qrCodeToken == null || this.qrCodeToken.trim().isEmpty()) {
            this.qrCodeToken = UUID.randomUUID().toString();
        }
    }
}

