package net.javaguides.ems_backend.service;

import net.javaguides.ems_backend.entity.Admin;
import net.javaguides.ems_backend.repository.AdminRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ForgotPasswordService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    private final SecureRandom secureRandom = new SecureRandom();

    private final Map<String, OtpData> otpStorage =
            new ConcurrentHashMap<>();

    private static final long OTP_EXPIRY_SECONDS = 300;
    private static final int MAX_ATTEMPTS = 5;

    public ForgotPasswordService(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JavaMailSender mailSender) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    public void sendOtp(String email) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "Please enter your registered email."
            );
        }

        String normalizedEmail = email.trim().toLowerCase();

        Admin admin = adminRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException(
                        "If the account exists, an OTP will be sent."
                ));

        String otp = String.format(
                "%06d", secureRandom.nextInt(1_000_000)
        );

        OtpData data = new OtpData(
                otp,
                Instant.now().plusSeconds(OTP_EXPIRY_SECONDS)
        );

        otpStorage.put(normalizedEmail, data);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(admin.getEmail());
            message.setSubject("EMS Password Reset OTP");
            message.setText(
                    "Hello " + admin.getName() + ",\n\n"
                            + "Your password reset OTP is: " + otp + "\n\n"
                            + "This OTP expires in 5 minutes.\n"
                            + "Do not share this code with anyone."
            );

            mailSender.send(message);

        } catch (RuntimeException ex) {
            otpStorage.remove(normalizedEmail, data);
            throw new IllegalStateException(
                    "Unable to send OTP. Please check the email configuration."
            );
        }
    }

    @Transactional
    public void resetPassword(
            String email,
            String otp,
            String newPassword) {

        if (email == null || email.isBlank()
                || otp == null || otp.isBlank()) {
            throw new IllegalArgumentException(
                    "Email and OTP are required."
            );
        }

        if (newPassword == null || newPassword.length() < 8) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters."
            );
        }

        String normalizedEmail = email.trim().toLowerCase();
        OtpData data = otpStorage.get(normalizedEmail);

        if (data == null) {
            throw new IllegalArgumentException(
                    "Request a new OTP first."
            );
        }

        synchronized (data) {

            if (otpStorage.get(normalizedEmail) != data) {
                throw new IllegalArgumentException(
                        "OTP is invalid or expired. Request a new one."
                );
            }

            if (Instant.now().isAfter(data.expiresAt)) {
                otpStorage.remove(normalizedEmail, data);
                throw new IllegalArgumentException(
                        "OTP expired. Request a new one."
                );
            }

            if (data.attempts >= MAX_ATTEMPTS) {
                otpStorage.remove(normalizedEmail, data);
                throw new IllegalArgumentException(
                        "Too many attempts. Request a new OTP."
                );
            }

            data.attempts++;

            if (!data.otp.equals(otp.trim())) {
                throw new IllegalArgumentException("Invalid OTP.");
            }

            Admin admin = adminRepository.findByEmail(normalizedEmail)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Unable to reset password."
                    ));

            admin.setPassword(passwordEncoder.encode(newPassword));
            adminRepository.save(admin);

            otpStorage.remove(normalizedEmail, data);
        }
    }

    private static class OtpData {

        private final String otp;
        private final Instant expiresAt;
        private int attempts;

        private OtpData(String otp, Instant expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
            this.attempts = 0;
        }
    }
}

