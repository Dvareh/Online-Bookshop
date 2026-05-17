package com.bookstore.backend.Specifications;

import com.bookstore.backend.Models.Book;
import org.springframework.data.jpa.domain.Specification;

public class BookSpecification {

    public static Specification<Book> hasTitle(String title) {
        return (root, query, criteriaBuilder) ->
                title == null ? null :
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    public static Specification<Book> hasAuthor(String author) {
        return (root, query, criteriaBuilder) ->
                author == null ? null :
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("author")), "%" + author.toLowerCase() + "%");
    }

    public static Specification<Book> hasGenre(Integer genreId) {
        return (root, query, criteriaBuilder) -> {
            if (genreId == null){
                return null;
            }
            query.distinct(true);
            return criteriaBuilder.equal(root.get("genre"), genreId);
        };
    }
}
