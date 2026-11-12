
package net.javaguides.ems_backend.controller;

import net.javaguides.ems_backend.dto.AdminLoginDto;
import net.javaguides.ems_backend.dto.AdminRegistrationDto;
import net.javaguides.ems_backend.entity.Admin;
import net.javaguides.ems_backend.repository.AdminRepository;
import net.javaguides.ems_backend.service.AdminService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminService adminService;
    private final AdminRepository adminRepository;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(
            AdminService adminService,
            AdminRepository adminRepository,
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository) {

        this.adminService = adminService;
        this.adminRepository = adminRepository;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    // Register the first admin account
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody AdminRegistrationDto dto) {

        try {
            Admin admin = adminService.registerFirstAdmin(dto);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message", "Admin registered successfully",
                            "name", admin.getName(),
                            "email", admin.getEmail()
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of("message", e.getMessage())
            );

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("message", "This email is already registered.")
            );
        }
    }

    // Admin login
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AdminLoginDto dto,
            HttpServletRequest request,
            HttpServletResponse response) {

        if (dto.getEmail() == null || dto.getEmail().isBlank()
                || dto.getPassword() == null
                || dto.getPassword().isBlank()) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", "Email and password are required.")
            );
        }

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    dto.getEmail().trim().toLowerCase(),
                                    dto.getPassword()
                            )
                    );

            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            // Save authentication in the session
            securityContextRepository.saveContext(
                    context, request, response
            );

            Admin admin = adminRepository
                    .findByEmail(authentication.getName())
                    .orElseThrow();

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Login successful",
                            "name", admin.getName(),
                            "email", admin.getEmail()
                    )
            );

        } catch (AuthenticationException e) {
            SecurityContextHolder.clearContext();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("message", "Invalid email or password.")
            );
        }
    }

    // Get currently logged-in admin details
    @GetMapping("/me")
    public ResponseEntity<?> currentAdmin(
            Authentication authentication) {

        Admin admin = adminRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        return ResponseEntity.ok(
                Map.of(
                        "name", admin.getName(),
                        "email", admin.getEmail()
                )
        );
    }

    // Admin logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request) {

        SecurityContextHolder.clearContext();

        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }
}



