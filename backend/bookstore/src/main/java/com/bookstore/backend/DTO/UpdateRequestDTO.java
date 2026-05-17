package com.bookstore.backend.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateRequestDTO {

    private String username;

    @Email(message = "Email should be valid")
    private String email;

    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
            message = "Password must have at least 8 characters, including letters and numbers"
    )
    private String password;
}
