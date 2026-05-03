package com.bookstore.backend.Controllers;

import com.bookstore.backend.DTO.BookRequestDTO;
import com.bookstore.backend.DTO.BookResponseDTO;
import com.bookstore.backend.Models.Book;
import com.bookstore.backend.Services.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/books")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin book controller")
@RequiredArgsConstructor
public class AdminBookController {

    private final BookService bookService;

    @PostMapping("/add")
    @Operation(summary = "Add new book (ADMIN)")
    public ResponseEntity<BookResponseDTO> create(
            @RequestBody @Valid BookRequestDTO request) {
        return ResponseEntity.ok(bookService.createBook(request));
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Update book by ID (ADMIN)")
    public ResponseEntity<BookResponseDTO> updateBook(
            @PathVariable Integer id,
            @RequestBody @Valid BookRequestDTO bookRequestDTO) {
        return bookService.update(id, bookRequestDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete book by ID (ADMIN)")
    public ResponseEntity<Book> deleteBook(@PathVariable Integer id) {
        if (bookService.deleteBook(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
