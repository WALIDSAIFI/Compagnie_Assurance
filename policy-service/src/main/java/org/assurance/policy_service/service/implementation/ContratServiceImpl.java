package org.assurance.policy_service.service.implementation;

import lombok.AllArgsConstructor;
import org.assurance.policy_service.dto.ContratRequestDTO;
import org.assurance.policy_service.dto.ContratResponseDTO;
import org.assurance.policy_service.entity.Contrat;
import org.assurance.policy_service.feign.CustomerClient;
import org.assurance.policy_service.mapper.ContratMapper;
import org.assurance.policy_service.repository.ContratRepository;
import org.assurance.policy_service.service.interfaces.ContratService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

@Service
@AllArgsConstructor
public class ContratServiceImpl implements ContratService {
    private final ContratRepository contratRepository;
    private final ContratMapper contratMapper;
    private final CustomerClient customerClient;


    @Override
    public ContratResponseDTO creerContrat(ContratRequestDTO contratRequestDto) {
        // Vérifier si le client existe via FeignClient
        boolean clientExists;
        try {
            clientExists = Boolean.TRUE.equals(customerClient.checkCustomerExists(contratRequestDto.getClientId()).getBody());
        } catch (HttpClientErrorException.NotFound e) {
            throw new RuntimeException("Client non trouvé !");
        }

        if (!clientExists) {
            throw new RuntimeException("Client non trouvé !");
        }

        Contrat contrat = contratMapper.toEntity(contratRequestDto);
        Contrat savedContrat = contratRepository.save(contrat);
        return contratMapper.toDTO(savedContrat);
    }

    @Override
    public ContratResponseDTO getContratById(Long id) {
        Contrat contrat = contratRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat non trouvé !"));

        // Vérifier si le client du contrat existe encore
        boolean clientExists = Boolean.TRUE.equals(customerClient.checkCustomerExists(contrat.getClientId()).getBody());
        if (!clientExists) {
            throw new RuntimeException("Le client associé à ce contrat n'existe plus !");
        }

        return contratMapper.toDTO(contrat);
    }

    @Override
    public List<ContratResponseDTO> getContratsByClientId(Long clientId) {
        boolean clientExists = Boolean.TRUE.equals(customerClient.checkCustomerExists(clientId).getBody());
        if (!clientExists) {
            throw new RuntimeException("Client non trouvé !");
        }

        List<Contrat> contrats = contratRepository.findByClientId(clientId); // Correction ici
        return contrats.stream().map(contratMapper::toDTO).toList(); // Utilisation correcte du mapping
    }
}
