package com.bookstore.backend.Services;

import com.bookstore.backend.DTO.GenreDTO;
import com.bookstore.backend.Models.Genre;
import com.bookstore.backend.Repositories.GenreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GenreService {

    private final GenreRepository genreRepository;


    public GenreDTO mapToDTO(Genre genre){
        return GenreDTO.builder()
                .id(genre.getId())
                .name(genre.getName())
                .build();
    }

    public GenreDTO create(GenreDTO genreDTO){
        log.info("Saving genre {}", genreDTO.getName());
        Genre genre = Genre.builder()
                .name(genreDTO.getName())
                .build();

        genre =  genreRepository.save(genre);
        return mapToDTO(genre);
    }

    public List<GenreDTO> findAll() {
        log.info("Fetching all genre");
        return genreRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public Optional<GenreDTO> findById(Integer id) {
        log.info("Fetching genre {}", id);
        return genreRepository.findById(id)
                .map(this::mapToDTO);
    }

    public Optional<GenreDTO> update(Integer id, GenreDTO genreDTO) {
        log.info("Updating genre {}", id);
        return genreRepository.findById(id)
                .map(genre -> {
                    genre.setName(genreDTO.getName());
                    return genreRepository.save(genre);
                })
                .map(this::mapToDTO);
    }

    public boolean deleteById(Integer id) {
        log.info("Deleting genre {}", id);
        return genreRepository.findById(id)
                .map(g -> {
                    genreRepository.delete(g);
                    return true;
                })
                .orElse(false);
    }

}
