package com.bookstore.backend.Controllers;

import com.bookstore.backend.DTO.OrderAdminResponseDTO;
import com.bookstore.backend.DTO.OrderStatus;
import com.bookstore.backend.Services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class OrderAdminController {

    private final OrderService orderService;

    @PutMapping("/update/{id}")
    public ResponseEntity<OrderAdminResponseDTO> updateStatus(
            @PathVariable Integer id,
            @RequestParam OrderStatus orderStatus
            ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, orderStatus));

    }
    @GetMapping("/get")
    public ResponseEntity<List<OrderAdminResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getOrdersAdmin());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> enumErrorHandler() {
        return ResponseEntity.badRequest().body("Invalid order status");
    }

}
