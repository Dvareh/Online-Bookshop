package com.bookstore.backend.DTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemDTO {
    private Integer bookId;
    private String title;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
}
