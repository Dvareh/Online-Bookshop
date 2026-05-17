package com.bookstore.backend.DTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Data
public class BookResponseDTO {
    private Integer id;
    private String title;
    private String author;
    private String description;
    private String coverUrl;
    private Integer publicationYear;
    private BigDecimal price;
    private Integer stockQuantity;
    private List<String> genres;
}
