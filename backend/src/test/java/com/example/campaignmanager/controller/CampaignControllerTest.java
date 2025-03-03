package com.example.campaignmanager.controller;

import com.example.campaignmanager.dto.CampaignRequest;
import com.example.campaignmanager.dto.CampaignResponse;
import com.example.campaignmanager.filter.JwtAuthenticationFilter;
import com.example.campaignmanager.repository.CampaignRepository;
import com.example.campaignmanager.repository.ProductRepository;
import com.example.campaignmanager.service.CampaignService;
import com.example.campaignmanager.service.JwtService;
import com.example.campaignmanager.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CampaignControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CampaignService campaignService;

    private CampaignRequest campaignRequest;
    private CampaignResponse campaignResponse;

    @BeforeEach
    void setUp() {
        campaignRequest = CampaignRequest.builder()
                .name("Test Campaign")
                .keywords(List.of("test", "keyword"))
                .radius(10)
                .bidAmount(0.5)
                .campaignFund(50.0)
                .productId(1L)
                .status(true)
                .town("WARSAW")
                .build();

        campaignResponse = CampaignResponse.builder()
                .id(1L)
                .name("Test Campaign")
                .keywords(List.of("test", "keyword"))
                .radius(10)
                .bidAmount(0.5)
                .campaignFund(50.0)
                .productId(1L)
                .productName("Test Product")
                .status(true)
                .town("WARSAW")
                .build();
    }

    @Test
    @WithMockUser
    void createCampaign_Success() throws Exception {
        when(campaignService.createCampaign(any(CampaignRequest.class))).thenReturn(campaignResponse);

        mockMvc.perform(post("/api/campaigns")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(campaignRequest)))
                .andExpect(status().isOk());
                
        verify(campaignService, times(1)).createCampaign(any(CampaignRequest.class));
    }

    @Test
    @WithMockUser
    void getUserCampaigns_Success() throws Exception {
        List<CampaignResponse> campaigns = List.of(campaignResponse);
        when(campaignService.getUserCampaigns()).thenReturn(campaigns);

        mockMvc.perform(get("/api/campaigns")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
                
        verify(campaignService, times(1)).getUserCampaigns();
    }

    @Test
    @WithMockUser
    void updateCampaign_Success() throws Exception {
        when(campaignService.updateCampaign(eq(1L), any(CampaignRequest.class))).thenReturn(campaignResponse);

        mockMvc.perform(put("/api/campaigns/1")
                .with(SecurityMockMvcRequestPostProcessors.csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(campaignRequest)))
                .andExpect(status().isOk());
                
        verify(campaignService, times(1)).updateCampaign(eq(1L), any(CampaignRequest.class));
    }

    @Test
    @WithMockUser
    void deleteCampaign_Success() throws Exception {
        doNothing().when(campaignService).deleteCampaign(1L);

        mockMvc.perform(delete("/api/campaigns/1")
                .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isOk());
                
        verify(campaignService, times(1)).deleteCampaign(1L);
    }
} 