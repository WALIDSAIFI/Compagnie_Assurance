package org.assurance.policy_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Sinistre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String description;
    private Double montantRéclamé;
    private Double montantRemboursé;

    @ManyToOne
    @JoinColumn(name = "contrat_id")
    private Contrat contrat;
}
