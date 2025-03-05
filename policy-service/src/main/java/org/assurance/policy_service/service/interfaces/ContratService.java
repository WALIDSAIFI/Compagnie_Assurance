package org.assurance.policy_service.service.interfaces;

import org.assurance.policy_service.dto.ContratRequestDTO;
import org.assurance.policy_service.dto.ContratResponseDTO;

import java.util.List;

public interface ContratService {
    ContratResponseDTO creerContrat(ContratRequestDTO contratRequestDto);
    ContratResponseDTO getContratById(Long id);
    List<ContratResponseDTO> getContratsByClientId(Long clientId);
}
