package com.bookstore.backend.Services;

import com.bookstore.backend.DTO.OrderAdminResponseDTO;
import com.bookstore.backend.DTO.OrderItemDTO;
import com.bookstore.backend.DTO.OrderResponseDTO;
import com.bookstore.backend.DTO.OrderStatus;
import com.bookstore.backend.Models.*;
import com.bookstore.backend.Repositories.CartRepository;
import com.bookstore.backend.Repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
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

        for (CartItem cartItem : cart.getItems()) {
            Book book = cartItem.getBook();

            if (book.getStockQuantity() <cartItem.getQuantity()) {
               throw new RuntimeException(
                       "Book quantity is less than stock quantity for: "
                               + book.getTitle());
            }
        }
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Book book = cartItem.getBook();

            book.setStockQuantity(book.getStockQuantity() - cartItem.getQuantity());

            BigDecimal itemTotalPrice = book.getPrice()
                    .multiply(new BigDecimal(cartItem.getQuantity()));

            totalPrice = totalPrice.add(itemTotalPrice);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .book(book)
                    .quantity(cartItem.getQuantity())
                    .purchasePrice(book.getPrice())
                    .build();

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);

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

    public List<OrderAdminResponseDTO> getOrdersAdmin(){
        return orderRepository.findAll()
                .stream()
                .map(this::mapToAdminDTO)
                .toList();
    }

    public OrderAdminResponseDTO updateOrderStatus(Integer id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);

        return mapToAdminDTO(orderRepository.save(order));
    }

    public OrderResponseDTO mapToDTO(Order order) {
        return OrderResponseDTO.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .totalPrice(order.getTotalPrice())
                .items(
                        order.getItems().stream()
                                .map(item -> OrderItemDTO.builder()
                                        .bookId(item.getBook().getId())
                                        .title(item.getBook().getTitle())
                                        .quantity(item.getQuantity())
                                        .priceAtPurchase(item.getPurchasePrice())
                                        .build())
                                .toList()
                )
                .build();
    }

    private OrderAdminResponseDTO mapToAdminDTO(Order order) {
        return OrderAdminResponseDTO.builder()
                .id(order.getId())
                .userEmail(order.getUser().getEmail())
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
