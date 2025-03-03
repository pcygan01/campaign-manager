package com.example.campaignmanager.dto;

import com.example.campaignmanager.model.Town;
import com.example.campaignmanager.model.Campaign;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CampaignResponse {
    private Long id;
    private String name;
    private List<String> keywords;
    private Integer radius;
    private Double bidAmount;
    private Double campaignFund;
    private Boolean status;
    private Long productId;
    private String productName;
    private String town;

    public static CampaignResponse fromEntity(Campaign campaign) {
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
} 