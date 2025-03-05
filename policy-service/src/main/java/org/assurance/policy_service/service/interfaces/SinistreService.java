package org.assurance.policy_service.service.interfaces;

import org.assurance.policy_service.dto.SinistreRequestDTO;
import org.assurance.policy_service.dto.SinistreResponseDTO;

import java.util.List;

public interface SinistreService {
    SinistreResponseDTO declarerSinistre(SinistreRequestDTO sinistreRequestDto);
    List<SinistreResponseDTO> getSinistresByContratId(Long contratId);
}
