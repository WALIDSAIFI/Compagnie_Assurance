package org.assurance.policy_service.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SinistreRequestDTO {
    private LocalDate date;
    private String description;
    private Double montantRéclamé;
    private Double montantRemboursé;
    private Long contratId;
}
