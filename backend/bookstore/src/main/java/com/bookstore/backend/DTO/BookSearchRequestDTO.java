package com.bookstore.backend.DTO;

import lombok.Data;

@Data
public class BookSearchRequestDTO {

    private String author;
    private String title;
    private Integer genreId;
}
