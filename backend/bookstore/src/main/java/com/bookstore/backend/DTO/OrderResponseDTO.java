package com.bookstore.backend.DTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class OrderResponseDTO {
    private Integer id;
    private String status;
    private BigDecimal totalPrice;
    private List<OrderItemDTO> items;
}
