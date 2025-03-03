package com.example.campaignmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.example.campaignmanager.model")
@EnableJpaRepositories("com.example.campaignmanager.repository")
public class CampaignManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampaignManagerApplication.class, args);
    }
} 