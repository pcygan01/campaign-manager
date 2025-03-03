package com.example.campaignmanager.controller;

import com.example.campaignmanager.model.Town;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/towns")
@CrossOrigin(origins = "http://localhost:3000")
public class TownController {

    @GetMapping
    public ResponseEntity<List<String>> getAllTowns() {
        List<String> towns = Arrays.stream(Town.values())
            .map(Town::name)
            .collect(Collectors.toList());
        return ResponseEntity.ok(towns);
    }
} 