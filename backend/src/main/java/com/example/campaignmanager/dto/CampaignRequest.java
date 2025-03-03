package com.example.campaignmanager.dto;

import com.example.campaignmanager.model.Town;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CampaignRequest {
    @NotBlank
    private String name;
    
    @NotEmpty(message = "At least one keyword is required")
    private List<String> keywords;
    
    @Min(1)
    private Integer radius;
    
    @DecimalMin(value = "0.01", message = "Bid amount must be at least 0.01")
    private Double bidAmount;
    
    @Min(1)
    private Double campaignFund;
    
    @NotNull
    private Long productId;
    
    private Boolean status;
    @NotNull(message = "Town is required")
    private String town;
} 