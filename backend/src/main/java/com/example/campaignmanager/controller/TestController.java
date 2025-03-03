package com.example.campaignmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @GetMapping("/api/test/public")
    public String publicEndpoint() {
        return "This is a public endpoint that should be accessible without authentication";
    }
    
    @GetMapping("/api/test/private")
    public String privateEndpoint() {
        return "This is a private endpoint that should require authentication";
    }
} 