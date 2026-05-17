package com.bookstore.backend.Security;


import com.bookstore.backend.Services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public JwtFilter(JwtUtil jwtUtil,@Lazy UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
        throws ServletException, IOException{
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }


        String token = authHeader.substring(7);
        String email;

        try {
            email = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired JWT");
            return;
        }


        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            userService.findByEmail(email).ifPresentOrElse(user -> {
                if (jwtUtil.validateToken(token, user)) {
                    UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                            .username(user.getEmail())
                            .password(user.getPassword())
                            .roles(user.getRole().replace("ROLE_", ""))
                            .build();

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }, () -> {
                try {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                } catch (IOException ex) {
                    throw new RuntimeException(ex);
                }
            });
        }

        filterChain.doFilter(request, response);
    }
}
