package com.bookstore.backend.DTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequestDTO {

    @NotNull
    private Integer bookId;

    @Min(1)
    private Integer quantity;

    @DecimalMin("0.0")
    private BigDecimal price;
}
