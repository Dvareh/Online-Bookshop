package com.bookstore.backend.Services;

import com.bookstore.backend.DTO.OrderStatus;
import com.bookstore.backend.Models.Cart;
import com.bookstore.backend.Models.Order;
import com.bookstore.backend.Models.OrderItem;
import com.bookstore.backend.Models.User;
import com.bookstore.backend.Repositories.CartRepository;
import com.bookstore.backend.Repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final CartRepository cartRepository;

    public Order createOrder(String email) {

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        if(cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build();

        List<OrderItem> items = cart.getItems().stream()
                .map(cartItem -> OrderItem.builder()
                        .order(order)
                        .book(cartItem.getBook())
                        .quantity(cartItem.getQuantity())
                        .purchasePrice(cartItem.getBook().getPrice())
                        .build())
                .toList();

        order.setItems(items);

        Order newOrder = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        return newOrder;
    }

    public List<Order> getOrders(String email){

        User user =  userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUser(user);
    }

    public Order getOrderById(String email, Integer orderId){

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order =  orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if(!order.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Access denied");
        }

        return order;
    }
}
