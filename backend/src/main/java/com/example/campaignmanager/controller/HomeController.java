package com.example.campaignmanager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    
    @GetMapping(value = {"", "/", "/index.html"})
    public String index() {
        return "index.html";
    }
    
    @GetMapping("/error")
    public String error() {
        return "index.html";
    }
} 