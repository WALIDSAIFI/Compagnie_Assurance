package org.assurance.policy_service.repository;

import org.assurance.policy_service.dto.SinistreResponseDTO;
import org.assurance.policy_service.entity.Sinistre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SinistreRepository extends JpaRepository<Sinistre, Long> {
    List<Sinistre> findByContratId(Long contratId);
}
