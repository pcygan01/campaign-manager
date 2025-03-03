package com.example.campaignmanager.model;

import lombok.Getter;

@Getter
public enum Town {
    WARSAW("Warsaw"),
    KRAKOW("Kraków"),
    LODZ("Łódź"),
    WROCLAW("Wrocław"),
    POZNAN("Poznań"),
    GDANSK("Gdańsk"),
    SZCZECIN("Szczecin"),
    BYDGOSZCZ("Bydgoszcz"),
    LUBLIN("Lublin"),
    BIALYSTOK("Białystok");

    private final String displayName;

    Town(String displayName) {
        this.displayName = displayName;
    }
} 