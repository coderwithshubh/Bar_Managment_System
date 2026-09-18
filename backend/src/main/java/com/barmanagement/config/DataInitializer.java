package com.barmanagement.config;

import com.barmanagement.enums.Role;
import com.barmanagement.model.User;
import com.barmanagement.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createDefaultAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@bar.com";

            // Check whether ADMIN already exists
            if (userRepository.existsByEmail(adminEmail)) {

                System.out.println(
                        "=========================================="
                );

                System.out.println(
                        "ADMIN ACCOUNT ALREADY EXISTS"
                );

                System.out.println(
                        "Email: " + adminEmail
                );

                System.out.println(
                        "=========================================="
                );

                return;
            }

            // Create ADMIN user
            User admin = new User();

            admin.setFullName("System Administrator");
            admin.setEmail(adminEmail);
            admin.setMobileNumber("9999999999");

            // Encrypt password before saving
            admin.setPassword(
                    passwordEncoder.encode("Admin@123")
            );

            admin.setRole(Role.ADMIN);
            admin.setActive(true);

            userRepository.save(admin);

            System.out.println(
                    "=========================================="
            );

            System.out.println(
                    "DEFAULT ADMIN ACCOUNT CREATED"
            );

            System.out.println(
                    "Email    : admin@bar.com"
            );

            System.out.println(
                    "Password : Admin@123"
            );

            System.out.println(
                    "Role     : ADMIN"
            );

            System.out.println(
                    "=========================================="
            );
        };
    }
}