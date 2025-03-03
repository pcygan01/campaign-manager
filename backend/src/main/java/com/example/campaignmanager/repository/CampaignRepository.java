package com.example.campaignmanager.repository;

import com.example.campaignmanager.model.Campaign;
import com.example.campaignmanager.model.Product;
import com.example.campaignmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByProduct(Product product);

    @Query("SELECT c FROM Campaign c WHERE c.product.user.id = :userId")
    List<Campaign> findByProductUserId(@Param("userId") Long userId);

    List<Campaign> findByProductUser(User user);
} 