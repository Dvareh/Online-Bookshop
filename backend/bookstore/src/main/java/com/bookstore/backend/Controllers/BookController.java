package com.bookstore.backend.Controllers;


import com.bookstore.backend.DTO.BookRequestDTO;
import com.bookstore.backend.DTO.BookResponseDTO;
import com.bookstore.backend.DTO.BookSearchRequestDTO;
import com.bookstore.backend.Models.Book;
import com.bookstore.backend.Services.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/books")
@Tag(name = "BooksAPI", description = "API for managing books in project")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "Get book by ID", description = "Method returns a specific book by its ID")
    public ResponseEntity<BookResponseDTO> getBookById(@PathVariable Integer id) {
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    @Operation(summary = "Flexible book search request")
    public ResponseEntity<Page<BookResponseDTO>> searchBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) Integer genreId,
            @PageableDefault(sort = "id") Pageable pageable
    ) {

        BookSearchRequestDTO requestDTO = new BookSearchRequestDTO();
        requestDTO.setTitle(title);
        requestDTO.setAuthor(author);
        requestDTO.setGenreId(genreId);

        return ResponseEntity.ok(bookService.searchBooks(requestDTO, pageable));
    }

}
