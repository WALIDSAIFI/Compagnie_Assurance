package org.assurance.policy_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.assurance.policy_service.entity.enums.TypeContrat;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Contrat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TypeContrat type;

    private LocalDate dateEffet;
    private LocalDate dateExpiration;
    private Double montantCouverture;
    private Long clientId;  // Référence au client

    @OneToMany(mappedBy = "contrat", cascade = CascadeType.ALL)
    private List<Sinistre> sinistres;
}
