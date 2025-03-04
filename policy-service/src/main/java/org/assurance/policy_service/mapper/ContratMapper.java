package org.assurance.policy_service.mapper;

import org.assurance.policy_service.dto.ContratRequestDTO;
import org.assurance.policy_service.dto.ContratResponseDTO;
import org.assurance.policy_service.entity.Contrat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ContratMapper {

    ContratMapper INSTANCE = Mappers.getMapper(ContratMapper.class);

    @Mapping(target = "id", ignore = true)
    Contrat toEntity(ContratRequestDTO dto);

    ContratResponseDTO toDTO(Contrat contrat);
}
