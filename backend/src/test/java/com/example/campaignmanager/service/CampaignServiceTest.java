package com.example.campaignmanager.service;

import com.example.campaignmanager.dto.CampaignRequest;
import com.example.campaignmanager.dto.CampaignResponse;
import com.example.campaignmanager.exception.ResourceNotFoundException;
import com.example.campaignmanager.model.Campaign;
import com.example.campaignmanager.model.Product;
import com.example.campaignmanager.model.Town;
import com.example.campaignmanager.model.User;
import com.example.campaignmanager.repository.CampaignRepository;
import com.example.campaignmanager.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
public class CampaignServiceTest {

    @Mock
    private CampaignRepository campaignRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserService userService;

    @Mock
    private ProductService productService;

    @InjectMocks
    private CampaignService campaignService;

    private User testUser;
    private Product testProduct;
    private Campaign testCampaign;
    private CampaignRequest testCampaignRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .balance(100.0)
                .build();

        testProduct = Product.builder()
                .id(1L)
                .name("Test Product")
                .description("Test Description")
                .price(10.0)
                .user(testUser)
                .build();

        testCampaign = Campaign.builder()
                .id(1L)
                .name("Test Campaign")
                .keywords(List.of("test", "keyword"))
                .radius(10)
                .bidAmount(0.5)
                .campaignFund(50.0)
                .status(true)
                .town(Town.WARSAW)
                .product(testProduct)
                .build();

        testCampaignRequest = CampaignRequest.builder()
                .name("Test Campaign")
                .keywords(List.of("test", "keyword"))
                .radius(10)
                .bidAmount(0.5)
                .campaignFund(50.0)
                .productId(1L)
                .status(true)
                .town("WARSAW")
                .build();
    }

    @Test
    void createCampaign_Success() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(productService.getProductEntity(1L)).thenReturn(testProduct);
        when(campaignRepository.save(any(Campaign.class))).thenReturn(testCampaign);
        
        CampaignResponse response = campaignService.createCampaign(testCampaignRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test Campaign", response.getName());
        assertEquals(List.of("test", "keyword"), response.getKeywords());
        assertEquals(10, response.getRadius());
        assertEquals(0.5, response.getBidAmount());
        assertEquals(50.0, response.getCampaignFund());
        assertEquals(true, response.getStatus());
        assertEquals("WARSAW", response.getTown());
        assertEquals(1L, response.getProductId());
        assertEquals("Test Product", response.getProductName());
    }

    @Test
    void getUserCampaigns_Success() {
        User currentUser = testUser;
        when(userService.getCurrentUser()).thenReturn(currentUser);
        
        List<Campaign> campaignList = Collections.singletonList(testCampaign);
        
        lenient().when(campaignRepository.findByProductUser(currentUser)).thenReturn(campaignList);
        
        lenient().when(campaignRepository.findByProductUserId(currentUser.getId())).thenReturn(campaignList);
        lenient().when(campaignRepository.findAll()).thenReturn(campaignList);
        
        List<CampaignResponse> campaigns = campaignService.getUserCampaigns();
        
        assertNotNull(campaigns, "Campaign list should not be null");
        assertEquals(1, campaigns.size(), "Expected 1 campaign in the list");
    }

    @Test
    void updateCampaign_Success() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(testCampaign));
        
        Campaign updatedCampaign = Campaign.builder()
                .id(1L)
                .name("Updated Campaign")
                .keywords(List.of("updated", "test"))
                .radius(15)
                .bidAmount(0.7)
                .campaignFund(60.0)
                .status(true)
                .town(Town.KRAKOW)
                .product(testProduct)
                .build();
        
        when(campaignRepository.save(any(Campaign.class))).thenReturn(updatedCampaign);

        CampaignRequest updateRequest = CampaignRequest.builder()
                .name("Updated Campaign")
                .keywords(List.of("updated", "test"))
                .radius(15)
                .bidAmount(0.7)
                .campaignFund(60.0)
                .productId(1L)
                .status(true)
                .town("KRAKOW")
                .build();

        CampaignResponse response = campaignService.updateCampaign(1L, updateRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Updated Campaign", response.getName());
        assertEquals(List.of("updated", "test"), response.getKeywords());
        assertEquals(15, response.getRadius());
        assertEquals(0.7, response.getBidAmount());
        assertEquals(60.0, response.getCampaignFund());
        assertEquals(true, response.getStatus());
        assertEquals("KRAKOW", response.getTown());
    }

    @Test
    void deleteCampaign_Success() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(campaignRepository.findById(1L)).thenReturn(Optional.of(testCampaign));
        
        testUser.setBalance(150.0);
        
        campaignService.deleteCampaign(1L);

        verify(campaignRepository, times(1)).delete(testCampaign);
        
        assertEquals(200.0, testUser.getBalance());
    }
} 