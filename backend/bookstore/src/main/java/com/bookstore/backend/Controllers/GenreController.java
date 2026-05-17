package com.bookstore.backend.Controllers;

import com.bookstore.backend.DTO.GenreDTO;
import com.bookstore.backend.Services.GenreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genres")
@RequiredArgsConstructor
@Tag(name = "Genre Controller", description = "Endpoints for genre management")
public class GenreController {

    private final GenreService genreService;

    @PostMapping("/create")
    @Operation(summary = "Create new genre")
    public ResponseEntity<GenreDTO> create(@RequestBody @Valid GenreDTO dto) {
        return ResponseEntity.ok(genreService.create(dto));
    }

    @GetMapping("/get")
    @Operation(summary = "Get all genres")
    public ResponseEntity<List<GenreDTO>> getAll() {
        return ResponseEntity.ok(genreService.findAll());
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "Get genre by id")
    public ResponseEntity<GenreDTO> getById(@PathVariable Integer id) {
        return genreService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Update genre by id")
    public ResponseEntity<GenreDTO> update(
            @PathVariable Integer id,
            @RequestBody GenreDTO dto) {

        return genreService.update(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete genre by id")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (genreService.deleteById(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();

    }
}