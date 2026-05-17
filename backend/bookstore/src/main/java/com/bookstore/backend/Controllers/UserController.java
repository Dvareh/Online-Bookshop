package com.bookstore.backend.Controllers;

import com.bookstore.backend.DTO.UpdateRequestDTO;
import com.bookstore.backend.DTO.UserDTO;
import com.bookstore.backend.Services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user/me")
@Tag(name = "User", description = "Endpoints for managing current user profile")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/get")
    @Operation(summary = "Get current user's profile")
    public ResponseEntity<UserDTO> getMyProfile(Authentication auth) {
        String email = auth.getName();
        return userService.findByEmail(email)
                .map(userService::mapToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update")
    @Operation(summary = "Update current user's profile")
    public ResponseEntity<UserDTO> updateMyProfile(Authentication auth,
                                                   @Valid @RequestBody UpdateRequestDTO request) {
        String email = auth.getName();
        return userService.findByEmail(email)
                .flatMap(user -> userService.updateUser(user.getId(), request))
                .map(userService::mapToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
