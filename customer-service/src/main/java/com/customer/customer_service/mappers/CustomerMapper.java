package com.customer.customer_service.mappers;

import com.customer.customer_service.dtos.requestDTO.CustomerRequestDTO;
import com.customer.customer_service.dtos.responseDTO.CustomerResponseDTO;
import com.customer.customer_service.entities.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;


@Mapper(componentModel = "spring")
@Component
public interface CustomerMapper {
    Customer toEntity(CustomerRequestDTO customerRequestDTO);

    CustomerResponseDTO toDTO(Customer customer);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(CustomerRequestDTO customerRequestDTO, @MappingTarget Customer customer);
}
