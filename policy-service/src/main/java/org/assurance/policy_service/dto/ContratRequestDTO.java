package org.assurance.policy_service.dto;

import lombok.Data;
import org.assurance.policy_service.entity.enums.TypeContrat;

import java.time.LocalDate;

@Data
public class ContratRequestDTO {
    private TypeContrat type;
    private LocalDate dateEffet;
    private LocalDate dateExpiration;
    private Double montantCouverture;
    private Long clientId;
}
