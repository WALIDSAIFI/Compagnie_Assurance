package org.assurance.policy_service.service.implementation;

import lombok.AllArgsConstructor;
import org.assurance.policy_service.dto.SinistreRequestDTO;
import org.assurance.policy_service.dto.SinistreResponseDTO;
import org.assurance.policy_service.entity.Contrat;
import org.assurance.policy_service.entity.Sinistre;
import org.assurance.policy_service.feign.CustomerClient;
import org.assurance.policy_service.mapper.SinistreMapper;
import org.assurance.policy_service.repository.ContratRepository;
import org.assurance.policy_service.repository.SinistreRepository;
import org.assurance.policy_service.service.interfaces.SinistreService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SinistreServiceImpl implements SinistreService {

    private final SinistreRepository sinistreRepository;
    private final SinistreMapper sinistreMapper;
    private final ContratRepository contratRepository;
    private final CustomerClient customerClient;

    @Override
    public SinistreResponseDTO declarerSinistre(SinistreRequestDTO sinistreRequestDto) {
        // Vérifier si le contrat existe
        Contrat contrat = contratRepository.findById(sinistreRequestDto.getContratId())
                .orElseThrow(() -> new RuntimeException("Contrat non trouvé !"));

        // Vérifier si le client du contrat existe encore
        boolean clientExists = Boolean.TRUE.equals(customerClient.checkCustomerExists(contrat.getClientId()).getBody());
        if (!clientExists) {
            throw new RuntimeException("Le client associé à ce contrat n'existe plus !");
        }

        Sinistre sinistre = sinistreMapper.toEntity(sinistreRequestDto);
        sinistre.setContrat(contrat);
        Sinistre savedSinistre = sinistreRepository.save(sinistre);
        return sinistreMapper.toDTO(savedSinistre);
    }

    @Override
    public List<SinistreResponseDTO> getSinistresByContratId(Long contratId) {
        List<Sinistre> sinistres = sinistreRepository.findByContratId(contratId);
        return sinistres.stream()
                .map(sinistreMapper::toDTO)
                .collect(Collectors.toList());
    }
}
