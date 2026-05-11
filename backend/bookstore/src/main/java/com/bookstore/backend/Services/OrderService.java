package com.bookstore.backend.Services;

import com.bookstore.backend.DTO.*;
import com.bookstore.backend.Models.*;
import com.bookstore.backend.Repositories.BookRepository;
import com.bookstore.backend.Repositories.CartRepository;
import com.bookstore.backend.Repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final CartRepository cartRepository;
    private final BookRepository bookRepository;

    @Transactional
    public OrderResponseDTO createOrder(
            String username,
            OrderRequestDTO orderRequestDTO) {

        User user = null;

        if (username != null) {
            user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PROCESSING);
        order.setCreatedAt(LocalDateTime.now());
        order.setPaymentMethod(orderRequestDTO.getPaymentMethod());

        ShippingAddressDTO address = orderRequestDTO.getShippingAddress();

        order.setFirstName(address.getFirstName());
        order.setLastName(address.getLastName());
        order.setEmail(address.getEmail());
        order.setPhone(address.getPhone());
        order.setStreet(address.getStreet());
        order.setCity(address.getCity());
        order.setPostalCode(address.getPostalCode());
        order.setCountry(address.getCountry());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemDTO : orderRequestDTO.getItems()) {

            Book book = bookRepository.findById(itemDTO.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            if (book.getStockQuantity() < itemDTO.getQuantity()) {
                throw new RuntimeException("Book out of stock: " + book.getTitle());
            }

            book.setStockQuantity(book.getStockQuantity() - itemDTO.getQuantity());
            bookRepository.save(book);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setBook(book);
            item.setQuantity(itemDTO.getQuantity());
            item.setPurchasePrice(book.getPrice());

            orderItems.add(item);

            total = total.add(
                    book.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()))
            );
        }

        order.setItems(orderItems);
        order.setTotalPrice(total);

        Order savedOrder = orderRepository.save(order);

        return mapToDTO(savedOrder);
    }

    public List<Order> getOrders(String email){
        log.info("Getting orders for user {}", email);

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
        log.info("Getting orders for admin");
        return orderRepository.findAll()
                .stream()
                .map(this::mapToAdminDTO)
                .toList();
    }

    public OrderAdminResponseDTO updateOrderStatus(Integer id, OrderStatus status) {
        log.info("Updating order status for user {}", id);
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
