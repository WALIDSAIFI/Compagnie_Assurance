package org.assurance.policy_service.controller;


import lombok.AllArgsConstructor;
import org.assurance.policy_service.dto.ContratRequestDTO;
import org.assurance.policy_service.dto.ContratResponseDTO;
import org.assurance.policy_service.service.interfaces.ContratService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contrats")
@AllArgsConstructor
public class ContratController {

    private final ContratService contratService;

    // Créer un contrat d'assurance
    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public ContratResponseDTO creerContrat(@RequestBody ContratRequestDTO contratRequestDto) {
        return contratService.creerContrat(contratRequestDto);
    }

    // Consulter un contrat par son ID
    @GetMapping("/{id}")
    public ContratResponseDTO getContratById(@PathVariable Long id) {
        return contratService.getContratById(id);
    }

    // Lister les contrats d'un client
    @GetMapping("/client/{clientId}")
    public List<ContratResponseDTO> getContratsByClientId(@PathVariable Long clientId) {
        return contratService.getContratsByClientId(clientId);
    }
}
