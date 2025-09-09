package com.soodthin.filters;

import com.soodthin.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("Request URI: " + request.getRequestURI());

        // Bỏ qua filter cho các đường dẫn xác thực (đăng nhập/đăng ký)
        String path = request.getRequestURI();
        if (path.startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Lấy header Authorization
        String header = request.getHeader("Authorization");


        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return; 
        }

        String token = header.substring(7).trim();
        if (token.isEmpty() || token.equalsIgnoreCase("null")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String username = JwtUtils.validateTokenAndGetUsername(token);
            String role = JwtUtils.getRoleFromToken(token);

            if (username != null && role != null) {
                // Nếu token hợp lệ, tạo đối tượng xác thực và đặt vào SecurityContext
                User userDetails = new User(username, "", List.of(new SimpleGrantedAuthority(role)));
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception e) {
           
            System.err.println("JWT Token validation error: " + e.getMessage());
        }

        // Cho request đi tiếp trong chuỗi filter
        filterChain.doFilter(request, response);
    }
}