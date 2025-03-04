package org.assurance.policy_service.controller;

import lombok.AllArgsConstructor;
import org.assurance.policy_service.dto.SinistreRequestDTO;
import org.assurance.policy_service.dto.SinistreResponseDTO;
import org.assurance.policy_service.service.interfaces.SinistreService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sinistres")
@AllArgsConstructor
public class SinistreController {

    private final SinistreService sinistreService;

    // Déclarer un sinistre
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SinistreResponseDTO declarerSinistre(@RequestBody SinistreRequestDTO sinistreRequestDto) {
        return sinistreService.declarerSinistre(sinistreRequestDto);
    }

    // Lister les sinistres par contrat
    @GetMapping("/contrat/{contratId}")
    public List<SinistreResponseDTO> getSinistresByContratId(@PathVariable Long contratId) {
        return sinistreService.getSinistresByContratId(contratId);
    }
}
