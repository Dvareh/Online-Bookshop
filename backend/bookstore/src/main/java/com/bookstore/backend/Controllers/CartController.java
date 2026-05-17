package com.bookstore.backend.Controllers;

import com.bookstore.backend.DTO.CartResponseDTO;
import com.bookstore.backend.Models.Cart;
import com.bookstore.backend.Services.CartService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart operations controller")
public class CartController {

    private final CartService cartService;

    @GetMapping("/get")
    public ResponseEntity<CartResponseDTO> getCart(Authentication authentication){
        return ResponseEntity.ok(
                cartService.mapToDTO(cartService.getCart(authentication.getName())));
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> addToCart(Authentication authentication,
                                          @RequestParam Integer bookId,
                                          @RequestParam Integer quantity){
        return ResponseEntity.ok(
                cartService.mapToDTO(
                        cartService.addItemToCart(authentication.getName(), bookId, quantity))
        );
    }

    @PutMapping("/update")
    public ResponseEntity<CartResponseDTO> updateItem(Authentication authentication,
                                           @RequestParam Integer itemId,
                                           @RequestParam Integer quantity){
        return ResponseEntity.ok(
                cartService.mapToDTO(
                        cartService.updateItem(authentication.getName(), itemId, quantity))
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Cart> deleteItem(Authentication authentication,
                                           @PathVariable Integer id){
        cartService.removeItem(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
