package com.bookstore.backend.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BookRequestDTO {
    private String title;
    private String author;
    private String description;
    private String coverUrl;
    private Integer publicationYear;
    private BigDecimal price;
    private Integer stockQuantity;
    private List<Integer> genreIds;

}
