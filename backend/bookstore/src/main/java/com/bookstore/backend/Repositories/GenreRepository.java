package com.bookstore.backend.Repositories;

import com.bookstore.backend.Models.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre,Integer> {

    Optional<Genre> findByName(String name);

}
