package com.example.campaignmanager.repository;

import com.example.campaignmanager.model.Product;
import com.example.campaignmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUser(User user);
} 