package com.example.campaignmanager.controller;

import com.example.campaignmanager.model.User;
import com.example.campaignmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;

    @GetMapping("/balance")
    public ResponseEntity<Double> getUserBalance() {
        User currentUser = userService.getCurrentUser();
        Double balance = currentUser.getBalance();
        if (balance == null) {
            balance = 0.0;
            currentUser.setBalance(balance);
            userService.saveUser(currentUser);
        }
        return ResponseEntity.ok(balance);
    }

    @PostMapping("/balance/add")
    public ResponseEntity<Double> addBalance(@RequestParam Double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        
        User user = userService.getCurrentUser();
        
        Double currentBalance = user.getBalance();
        if (currentBalance == null) {
            currentBalance = 0.0;
        }
        
        user.setBalance(currentBalance + amount);
        userService.saveUser(user);
        return ResponseEntity.ok(user.getBalance());
    }
} 