package com.example.campaignmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "API is running");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/api/public/test")
    public ResponseEntity<Map<String, String>> publicTest() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is a public endpoint");
        return ResponseEntity.ok(response);
    }
} 