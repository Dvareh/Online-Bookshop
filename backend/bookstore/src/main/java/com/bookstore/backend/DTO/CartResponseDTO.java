package com.bookstore.backend.DTO;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CartResponseDTO {

    private Integer id;
    private List<CartItemDTO> items;
}
