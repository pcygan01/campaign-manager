package com.example.campaignmanager.service;

import com.example.campaignmanager.dto.CampaignRequest;
import com.example.campaignmanager.dto.CampaignResponse;
import com.example.campaignmanager.model.Campaign;
import com.example.campaignmanager.model.Product;
import com.example.campaignmanager.model.User;
import com.example.campaignmanager.model.Town;
import com.example.campaignmanager.repository.CampaignRepository;
import com.example.campaignmanager.repository.ProductRepository;
import com.example.campaignmanager.service.ProductService;
import com.example.campaignmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import com.example.campaignmanager.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final ProductService productService;

    @Transactional
    public CampaignResponse createCampaign(CampaignRequest request) {
        User currentUser = userService.getCurrentUser();
        Product product = productService.getProductEntity(request.getProductId());

        if (!product.getUser().equals(currentUser)) {
            throw new RuntimeException("You can only create campaigns for your own products");
        }

        if (currentUser.getBalance() < request.getCampaignFund()) {
            throw new RuntimeException("Insufficient funds");
        }

        Campaign campaign = Campaign.builder()
                .name(request.getName())
                .keywords(request.getKeywords())
                .radius(request.getRadius())
                .bidAmount(request.getBidAmount())
                .campaignFund(request.getCampaignFund())
                .status(request.getStatus())
                .town(request.getTown() != null ? Town.valueOf(request.getTown()) : null)
                .product(product)
                .build();

        currentUser.setBalance(currentUser.getBalance() - request.getCampaignFund());
        Campaign savedCampaign = campaignRepository.save(campaign);
        return CampaignResponse.fromEntity(savedCampaign);
    }

    @Transactional(readOnly = true)
    public List<CampaignResponse> getUserCampaigns() {
        User currentUser = userService.getCurrentUser();
        return campaignRepository.findByProductUserId(currentUser.getId())
                .stream()
                .map(this::mapToCampaignResponse)
                .collect(Collectors.toList());
    }

    public CampaignResponse getCampaign(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        return mapToCampaignResponse(campaign);
    }

    @Transactional
    public CampaignResponse updateCampaign(Long id, CampaignRequest request) {
        Campaign campaign = getCampaignAndVerifyOwnership(id);
        User currentUser = userService.getCurrentUser();
        
        double fundDifference = request.getCampaignFund() - campaign.getCampaignFund();
        
        if (fundDifference > 0 && currentUser.getBalance() < fundDifference) {
            throw new RuntimeException(String.format(
                "Insufficient balance. Current balance: %.2f PLN. Additional funds needed: %.2f PLN",
                currentUser.getBalance(), fundDifference
            ));
        }

        if (fundDifference != 0) {
            currentUser.setBalance(currentUser.getBalance() - fundDifference);
            userService.saveUser(currentUser);
        }

        campaign.setName(request.getName());
        campaign.setKeywords(request.getKeywords());
        campaign.setBidAmount(request.getBidAmount());
        campaign.setStatus(request.getStatus());
        campaign.setTown(request.getTown() != null ? Town.valueOf(request.getTown()) : null);
        campaign.setRadius(request.getRadius());
        
        if (fundDifference != 0) {
            campaign.setCampaignFund(request.getCampaignFund());
        }

        campaign.setProduct(productService.getProductEntity(request.getProductId()));

        Campaign updatedCampaign = campaignRepository.save(campaign);
        return CampaignResponse.fromEntity(updatedCampaign);
    }

    @Transactional
    public void deleteCampaign(Long id) {
        User currentUser = userService.getCurrentUser();
        var campaign = getCampaignAndVerifyOwnership(id);
        
        currentUser.setBalance(currentUser.getBalance() + campaign.getCampaignFund());
        campaignRepository.delete(campaign);
    }

    private Campaign getCampaignAndVerifyOwnership(Long id) {
        User currentUser = userService.getCurrentUser();
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
            
        if (!campaign.getProduct().getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You don't own this campaign");
        }
        
        return campaign;
    }

    private CampaignResponse mapToCampaignResponse(Campaign campaign) {
        return CampaignResponse.builder()
                .id(campaign.getId())
                .name(campaign.getName())
                .keywords(campaign.getKeywords())
                .radius(campaign.getRadius())
                .bidAmount(campaign.getBidAmount())
                .campaignFund(campaign.getCampaignFund())
                .status(campaign.getStatus())
                .productId(campaign.getProduct().getId())
                .productName(campaign.getProduct().getName())
                .town(campaign.getTown() != null ? campaign.getTown().name() : null)
                .build();
    }

    public void validateProductOwnership(Product product, User currentUser) {
        if (!product.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't own this product");
        }
    }
} 