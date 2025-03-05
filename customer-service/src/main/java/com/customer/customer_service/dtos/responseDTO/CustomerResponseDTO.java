package com.customer.customer_service.dtos.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponseDTO {
    private Long id;
    private String lastName;
    private String firstName;
    private String email;
    private String address;
    private String phone;

}
