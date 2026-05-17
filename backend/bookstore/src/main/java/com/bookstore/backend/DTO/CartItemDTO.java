package com.bookstore.backend.DTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartItemDTO {
    private Integer id;
    private Integer bookId;
    private String title;
    private BigDecimal price;
    private Integer quantity;
}
