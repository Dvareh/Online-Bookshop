package com.bookstore.backend.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {

    @Valid
    @NotNull
    private ShippingAddressDTO shippingAddress;

    @NotBlank
    private String paymentMethod;

    @Valid
    @NotEmpty
    private List<OrderItemRequestDTO> items;

    @DecimalMin("0.0")
    @NotNull
    private BigDecimal total;
}
