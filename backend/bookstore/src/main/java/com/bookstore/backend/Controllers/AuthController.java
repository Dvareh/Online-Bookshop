package com.bookstore.backend.Controllers;

import com.bookstore.backend.DTO.LoginRequestDTO;
import com.bookstore.backend.DTO.RegisterRequestDTO;
import com.bookstore.backend.Models.User;
import com.bookstore.backend.Security.JwtUtil;
import com.bookstore.backend.Services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication Controller", description = "Controller for registration and login")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Method creates a new account for user")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO regDTO) {
        if(userService.findByEmail(regDTO.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = User.builder()
                .username(regDTO.getUsername())
                .email(regDTO.getEmail())
                .password(regDTO.getPassword())
                .role("ROLE_USER")
                .build();

        User savedUser = userService.save(user);

        return ResponseEntity.ok(userService.mapToDTO(savedUser));
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Method allows user to log in")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequestDTO loginDTO) {
        Optional<User> optionalUser = userService.findByEmail(loginDTO.getEmail());

        boolean valid = optionalUser.isPresent() &&
                userService.checkPassword(optionalUser.get(), loginDTO.getPassword());

        if (valid) {
            String token = jwtUtil.generateToken(optionalUser.get());
            return ResponseEntity.ok(Map.of("token", token));
        } else {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password"));
        }
    }
}
