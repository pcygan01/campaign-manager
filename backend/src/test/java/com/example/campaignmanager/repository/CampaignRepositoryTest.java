package com.example.campaignmanager.repository;

import com.example.campaignmanager.model.Campaign;
import com.example.campaignmanager.model.Product;
import com.example.campaignmanager.model.Town;
import com.example.campaignmanager.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest
public class CampaignRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CampaignRepository campaignRepository;

    @Test
    void findByProduct_Success() {
        User user = User.builder()
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .password("password")
                .balance(100.0)
                .build();
        entityManager.persist(user);

        Product product = Product.builder()
                .name("Test Product")
                .description("Test Description")
                .price(50.0)
                .user(user)
                .build();
        entityManager.persist(product);

        Campaign campaign = Campaign.builder()
                .name("Test Campaign")
                .keywords(Arrays.asList("test", "keyword"))
                .bidAmount(0.5)
                .campaignFund(50.0)
                .status(true)
                .town(Town.WARSAW)
                .radius(10)
                .product(product)
                .build();
        entityManager.persist(campaign);
        entityManager.flush();

        List<Campaign> found = campaignRepository.findByProduct(product);

        assertNotNull(found);
        assertEquals(1, found.size());
        assertEquals("Test Campaign", found.get(0).getName());
    }

    @Test
    void findByProductUserId_Success() {
        User user = User.builder()
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .password("password")
                .balance(100.0)
                .build();
        entityManager.persist(user);

        Product product = Product.builder()
                .name("Test Product")
                .description("Test Description")
                .price(50.0)
                .user(user)
                .build();
        entityManager.persist(product);

        Campaign campaign = Campaign.builder()
                .name("Test Campaign")
                .keywords(Arrays.asList("test", "keyword"))
                .bidAmount(0.5)
                .campaignFund(50.0)
                .status(true)
                .town(Town.WARSAW)
                .radius(10)
                .product(product)
                .build();
        entityManager.persist(campaign);
        entityManager.flush();

        List<Campaign> found = campaignRepository.findByProductUserId(user.getId());

        assertNotNull(found);
        assertEquals(1, found.size());
        assertEquals("Test Campaign", found.get(0).getName());
    }
} 