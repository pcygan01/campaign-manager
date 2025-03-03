package com.example.campaignmanager.integration;

import com.example.campaignmanager.dto.CampaignRequest;
import com.example.campaignmanager.model.Product;
import com.example.campaignmanager.model.Role;
import com.example.campaignmanager.model.User;
import com.example.campaignmanager.repository.ProductRepository;
import com.example.campaignmanager.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class CampaignIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;
    private Product testProduct;
    private CampaignRequest campaignRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .email("integration@example.com")
                .firstName("Integration")
                .lastName("Test")
                .password(passwordEncoder.encode("password"))
                .role(Role.USER)
                .balance(100.0)
                .build();
        userRepository.save(testUser);

        testProduct = Product.builder()
                .name("Integration Product")
                .description("Integration Description")
                .price(50.0)
                .user(testUser)
                .build();
        productRepository.save(testProduct);

        campaignRequest = new CampaignRequest();
        campaignRequest.setName("Integration Campaign");
        campaignRequest.setKeywords(Arrays.asList("integration", "test"));
        campaignRequest.setBidAmount(0.5);
        campaignRequest.setCampaignFund(50.0);
        campaignRequest.setStatus(true);
        campaignRequest.setTown("WARSAW");
        campaignRequest.setRadius(10);
        campaignRequest.setProductId(testProduct.getId());
    }

    @Test
    @WithMockUser(username = "integration@example.com")
    void createAndGetCampaign_Success() throws Exception {
        String responseJson = mockMvc.perform(post("/api/campaigns")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(campaignRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Integration Campaign"))
                .andReturn().getResponse().getContentAsString();

        Long campaignId = objectMapper.readTree(responseJson).get("id").asLong();

        mockMvc.perform(get("/api/campaigns/" + campaignId)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Integration Campaign"))
                .andExpect(jsonPath("$.keywords[0]").value("integration"))
                .andExpect(jsonPath("$.bidAmount").value(0.5))
                .andExpect(jsonPath("$.campaignFund").value(50.0))
                .andExpect(jsonPath("$.status").value(true))
                .andExpect(jsonPath("$.town").value("WARSAW"))
                .andExpect(jsonPath("$.radius").value(10))
                .andExpect(jsonPath("$.productId").value(testProduct.getId()))
                .andExpect(jsonPath("$.productName").value("Integration Product"));

        mockMvc.perform(get("/api/users/balance")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(50.0));
    }

    @Test
    @WithMockUser(username = "integration@example.com")
    void createUpdateAndDeleteCampaign_Success() throws Exception {
        String responseJson = mockMvc.perform(post("/api/campaigns")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(campaignRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Long campaignId = objectMapper.readTree(responseJson).get("id").asLong();

        campaignRequest.setName("Updated Campaign");
        campaignRequest.setCampaignFund(60.0);

        mockMvc.perform(put("/api/campaigns/" + campaignId)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(campaignRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Campaign"))
                .andExpect(jsonPath("$.campaignFund").value(60.0));

        mockMvc.perform(delete("/api/campaigns/" + campaignId)
                .with(csrf()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/campaigns/" + campaignId)
                .with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Campaign not found"));

        mockMvc.perform(get("/api/users/balance")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(100.0));
    }
} 