package com.customer.customer_service.service.inter;

import com.customer.customer_service.dtos.requestDTO.CustomerRequestDTO;
import com.customer.customer_service.dtos.responseDTO.CustomerResponseDTO;
import com.customer.customer_service.entities.Customer;

import java.util.List;

public interface CustomerService {
    CustomerResponseDTO addCustomer(CustomerRequestDTO customerRequestDTO);
    List<CustomerResponseDTO> getAllCustomers();
    CustomerResponseDTO getCustomerById(Long id);
    CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO customerRequestDTO);
    boolean checkCustomerExists(Long id);
    void deleteCustomer(Long id);
}
