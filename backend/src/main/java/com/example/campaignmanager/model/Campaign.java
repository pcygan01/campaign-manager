package com.example.campaignmanager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import java.util.List;
import jakarta.validation.constraints.DecimalMin;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "campaigns")
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Campaign name is required")
    private String name;

    @ElementCollection
    @CollectionTable(name = "campaign_keywords", joinColumns = @JoinColumn(name = "campaign_id"))
    @Column(name = "keyword")
    private List<String> keywords;

    @NotNull(message = "Bid amount is required")
    @Min(value = 0, message = "Bid amount must be positive")
    @DecimalMin(value = "0.01", message = "Bid amount must be at least 0.01 PLN")
    private Double bidAmount;

    @NotNull(message = "Campaign fund is required")
    @Min(value = 1, message = "Campaign fund must be at least 1 PLN")
    private Double campaignFund;

    @Builder.Default
    private Boolean status = true;

    @Column(name = "town")
    @Enumerated(EnumType.STRING)
    private Town town;

    @NotNull(message = "Radius is required")
    @Min(value = 1, message = "Radius must be at least 1 kilometer")
    private Integer radius;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = true;
        }
    }

    public Long getProductId() {
        return product != null ? product.getId() : null;
    }

    public String getProductName() {
        return product != null ? product.getName() : null;
    }
} 