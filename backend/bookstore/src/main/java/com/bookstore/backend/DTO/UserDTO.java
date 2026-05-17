package com.bookstore.backend.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDTO {

    private Integer id;
    private String username;
    private String email;
    private String role;
}
