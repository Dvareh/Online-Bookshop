package com.bookstore.backend.DTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class OrderAdminResponseDTO {
    private Integer id;
    private String userEmail;
    private OrderStatus status;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
}
