
package net.javaguides.ems_backend.controller;

import net.javaguides.ems_backend.service.ForgotPasswordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/forgot-password")
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    public ForgotPasswordController(
            ForgotPasswordService forgotPasswordService) {
        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(
            @RequestBody Map<String, String> request) {

        forgotPasswordService.sendOtp(request.get("email"));

        return ResponseEntity.ok(Map.of(
                "message", "If the account exists, an OTP will be sent."
        ));
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody Map<String, String> request) {

        forgotPasswordService.resetPassword(
                request.get("email"),
                request.get("otp"),
                request.get("newPassword")
        );

        return ResponseEntity.ok(Map.of(
                "message", "Password reset successful. Please log in."
        ));
    }
}
