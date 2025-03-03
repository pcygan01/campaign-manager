package com.example.campaignmanager.controller;

import com.example.campaignmanager.dto.CampaignRequest;
import com.example.campaignmanager.dto.CampaignResponse;
import com.example.campaignmanager.dto.ErrorResponse;
import com.example.campaignmanager.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;
    private static final Logger log = LoggerFactory.getLogger(CampaignController.class);

    @PostMapping
    public ResponseEntity<CampaignResponse> createCampaign(@RequestBody CampaignRequest campaignRequest) {
        CampaignResponse response = campaignService.createCampaign(campaignRequest);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<CampaignResponse>> getUserCampaigns() {
        List<CampaignResponse> campaigns = campaignService.getUserCampaigns();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(campaigns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponse> getCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaign(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaignResponse> updateCampaign(
            @PathVariable Long id,
            @RequestBody CampaignRequest campaignRequest) {
        CampaignResponse response = campaignService.updateCampaign(id, campaignRequest);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/seller")
    public ResponseEntity<List<CampaignResponse>> getSellerCampaigns() {
        return ResponseEntity.ok(campaignService.getUserCampaigns());
    }
} 