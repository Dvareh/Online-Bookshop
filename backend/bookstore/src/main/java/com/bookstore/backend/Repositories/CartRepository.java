package com.bookstore.backend.Repositories;

import com.bookstore.backend.Models.Cart;
import com.bookstore.backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart,Integer> {
    Optional<Cart> findByUser(User user);
}
