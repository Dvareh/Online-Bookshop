package com.bookstore.backend.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", nullable = false,  length = 255)
    @NotBlank(message = "Title is required")
    private String title;

    @Column(name = "author", nullable = false,  length = 255)
    @NotBlank(message = "Author is required")
    private String author;

    @Column(name = "cover_url")
    private String coverUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Min(value = 0, message = "Year cannot be negative")
    @Column(name = "publication_year")
    private Integer publicationYear;

    @Column(name = "price", precision = 10, scale = 2)
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
    private BigDecimal price;


    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "stock_quantity", nullable = false)
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer stockQuantity;

    @ManyToMany
    @JoinTable(
            name = "book_genres",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private List<Genre> genres;

}
