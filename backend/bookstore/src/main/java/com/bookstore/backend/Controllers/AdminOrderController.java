package com.bookstore.backend.Controllers;

import com.bookstore.backend.DTO.OrderAdminResponseDTO;
import com.bookstore.backend.DTO.OrderStatus;
import com.bookstore.backend.Services.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin order controller")
public class AdminOrderController {

    private final OrderService orderService;

    @PutMapping("/update/{id}")
    @Operation(summary = "Change order status")
    public ResponseEntity<OrderAdminResponseDTO> updateStatus(
            @PathVariable Integer id,
            @RequestParam OrderStatus orderStatus
            ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, orderStatus));

    }
    @GetMapping("/get")
    @Operation(summary = "Get all orders")
    public ResponseEntity<List<OrderAdminResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getOrdersAdmin());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> enumErrorHandler() {
        return ResponseEntity.badRequest().body("Invalid order status");
    }

}
