package org.assurance.policy_service.mapper;

import org.assurance.policy_service.dto.SinistreRequestDTO;
import org.assurance.policy_service.dto.SinistreResponseDTO;
import org.assurance.policy_service.entity.Sinistre;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SinistreMapper {

    SinistreMapper INSTANCE = Mappers.getMapper(SinistreMapper.class);

    @Mapping(target = "id", ignore = true)
    Sinistre toEntity(SinistreRequestDTO dto);

    SinistreResponseDTO toDTO(Sinistre sinistre);
}
