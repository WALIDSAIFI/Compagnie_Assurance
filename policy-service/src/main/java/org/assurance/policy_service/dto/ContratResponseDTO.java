package org.assurance.policy_service.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ContratResponseDTO {
    private Long id;
    private String type;
    private LocalDate dateEffet;
    private LocalDate dateExpiration;
    private Double montantCouverture;
    private Long clientId;
    private List<SinistreResponseDTO> sinistres;
}

