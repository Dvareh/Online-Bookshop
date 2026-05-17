package com.bookstore.backend.Repositories;

import com.bookstore.backend.Models.Book;
import com.bookstore.backend.Models.Cart;
import com.bookstore.backend.Models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem,Integer> {
    Optional<CartItem> findByCartAndBook(Cart cart, Book book);
}
