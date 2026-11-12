
package net.javaguides.ems_backend.service;

import net.javaguides.ems_backend.dto.AdminRegistrationDto;
import net.javaguides.ems_backend.entity.Admin;
import net.javaguides.ems_backend.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Admin registerFirstAdmin(AdminRegistrationDto dto) {

        if (adminRepository.count() > 0) {
            throw new IllegalStateException(
                    "An admin account already exists. Registration is closed."
            );
        }

        if (dto.getName() == null || dto.getName().isBlank()
                || dto.getEmail() == null || dto.getEmail().isBlank()
                || dto.getPassword() == null || dto.getPassword().length() < 8) {
            throw new IllegalArgumentException(
                    "Enter a name, valid email, and password of at least 8 characters."
            );
        }

        Admin admin = new Admin();
        admin.setName(dto.getName().trim());
        admin.setEmail(dto.getEmail().trim().toLowerCase());
        admin.setPassword(passwordEncoder.encode(dto.getPassword()));

        return adminRepository.save(admin);
    }
}

