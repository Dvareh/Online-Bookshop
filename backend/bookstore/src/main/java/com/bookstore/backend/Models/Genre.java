package com.bookstore.backend.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "genres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    @NotBlank
    private String name;
}
