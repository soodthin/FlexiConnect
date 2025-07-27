package com.soodthin.filters;

import com.soodthin.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("Request URI: " + request.getRequestURI());

        String path = request.getRequestURI();
        if (path.contains("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (path.contains("/api/job-post")) {
            filterChain.doFilter(request, response);
            return;
        }


        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Thiếu hoặc sai token.");
            return;
        }

        String token = header.substring(7).trim();
        if (token.isEmpty() || token.equalsIgnoreCase("null")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token rỗng hoặc không hợp lệ.");
            return;
        }

        try {
            String username = JwtUtils.validateTokenAndGetUsername(token);
            String role = JwtUtils.getRoleFromToken(token);
            if (username != null && role != null) {
                User userDetails = new User(username, "", List.of(new SimpleGrantedAuthority(role)));
                UsernamePasswordAuthenticationToken auth
                        = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token không hợp lệ.");
                return;
            }
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Lỗi token.");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
