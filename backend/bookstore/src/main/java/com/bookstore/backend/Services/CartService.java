package com.bookstore.backend.Services;

import com.bookstore.backend.DTO.CartItemDTO;
import com.bookstore.backend.DTO.CartResponseDTO;
import com.bookstore.backend.Models.Book;
import com.bookstore.backend.Models.Cart;
import com.bookstore.backend.Models.CartItem;
import com.bookstore.backend.Models.User;
import com.bookstore.backend.Repositories.BookRepository;
import com.bookstore.backend.Repositories.CartItemRepository;
import com.bookstore.backend.Repositories.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final BookRepository bookRepository;

    private Cart getOrCreateCart(User user){
        log.info("Getting or creating cart");
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(user)
                                .build()
                ));
    }

    public Cart getCart(String email){
        log.info("Getting cart for user {}", email);
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return getOrCreateCart(user);
    }

    public Cart addItemToCart(String email, Integer bookId, Integer quantity){
        log.info("Adding item to cart for user {}", email);
        validateQuantity(quantity);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findByCartAndBook(cart,book)
                .orElseGet(() -> CartItem.builder()
                        .cart(cart)
                        .book(book)
                        .quantity(0)
                        .build()
                );

        cartItem.setQuantity(cartItem.getQuantity() + quantity);
        cartItemRepository.save(cartItem);

        return cart;
    }

    public Cart updateItem(String email, Integer itemId, Integer quantity){
        log.info("Updating item in cart for user {}", email);

        validateQuantity(quantity);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        checkOwnership(cart, cartItem);

        cartItem.setQuantity(quantity);

        cartItemRepository.save(cartItem);

        return cart;
    }

    public void removeItem(String email, Integer itemId){
        log.info("Removing item from cart for user {}", email);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        checkOwnership(cart, cartItem);

        cartItemRepository.delete(cartItem);
    }



    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
    }

    private void checkOwnership(Cart cart, CartItem item) {
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Access denied");
        }
    }

    public CartResponseDTO mapToDTO(Cart cart){

        return CartResponseDTO.builder()
                .id(cart.getId())
                .items(
                        cart.getItems().stream()
                                .map(cartItem -> CartItemDTO.builder()
                                        .id(cartItem.getId())
                                        .bookId(cartItem.getBook().getId())
                                        .title(cartItem.getBook().getTitle())
                                        .price(cartItem.getBook().getPrice())
                                        .quantity(cartItem.getQuantity())
                                        .build())
                                .toList()
                )
                .build();
    }

}
