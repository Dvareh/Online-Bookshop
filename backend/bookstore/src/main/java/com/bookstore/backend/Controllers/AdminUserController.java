package com.bookstore.backend.Controllers;

import com.bookstore.backend.DTO.UpdateRequestDTO;
import com.bookstore.backend.DTO.UserDTO;
import com.bookstore.backend.Services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/user")
@Tag(name = "Admin user controller")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/get")
    @Operation(summary = "Get all users", description = "Method returns list of all users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(
                userService.findAll().stream()
                        .map(userService::mapToDTO)
                        .toList()
        );
    }

    @GetMapping("/get/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer id) {
        return userService.findById(id)
                .map(userService::mapToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    @Operation(summary = "Update user by ID")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Integer id,
                                              @Valid @RequestBody UpdateRequestDTO request) {
        return userService.updateUser(id, request)
                .map(userService::mapToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete user by ID")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        if (userService.deleteById(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
