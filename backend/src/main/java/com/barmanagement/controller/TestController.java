package com.barmanagement.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    // ==========================================
    // ANY AUTHENTICATED USER
    // ==========================================

    @GetMapping("/protected")
    public String protectedEndpoint(
            Authentication authentication) {

        return "Hello "
                + authentication.getName()
                + "! JWT authentication is working.";
    }


    // ==========================================
    // ADMIN TEST
    // ==========================================

    @GetMapping("/admin")
    public String adminEndpoint(
            Authentication authentication) {

        return "Hello "
                + authentication.getName()
                + "! ADMIN authorization is working.";
    }


    // ==========================================
    // BARTENDER TEST
    // ==========================================

    @GetMapping("/bartender")
    public String bartenderEndpoint(
            Authentication authentication) {

        return "Hello "
                + authentication.getName()
                + "! BARTENDER authorization is working.";
    }
}