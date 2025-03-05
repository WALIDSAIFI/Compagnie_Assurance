package com.customer.customer_service.service.impl;


import com.customer.customer_service.dtos.requestDTO.CustomerRequestDTO;
import com.customer.customer_service.dtos.responseDTO.CustomerResponseDTO;
import com.customer.customer_service.entities.Customer;
import com.customer.customer_service.mappers.CustomerMapper;
import com.customer.customer_service.repositories.CustomerRepository;
import com.customer.customer_service.service.inter.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    public CustomerResponseDTO addCustomer(CustomerRequestDTO customerRequestDTO) {
        if (customerRepository.existsByEmail(customerRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Customer with email " + customerRequestDTO.getEmail() + " already exists");
        }

        Customer customer = customerMapper.toEntity(customerRequestDTO);

        Customer savedCustomer = customerRepository.save(customer);

        return customerMapper.toDTO(savedCustomer);
    }

    @Override
    public List<CustomerResponseDTO> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Customer with ID " + id + " not found"));
        return customerMapper.toDTO(customer);
    }

    @Override
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO customerRequestDTO) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Customer with ID " + id + " not found"));

        if (!existingCustomer.getEmail().equals(customerRequestDTO.getEmail()) &&
                customerRepository.existsByEmail(customerRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Email " + customerRequestDTO.getEmail() + " is already in use");        }

        customerMapper.updateEntityFromDTO(customerRequestDTO, existingCustomer);

        Customer updatedCustomer = customerRepository.save(existingCustomer);
        return customerMapper.toDTO(updatedCustomer);
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Customer with ID " + id + " not found"));

        customerRepository.delete(customer);
    }

    @Override
    public boolean checkCustomerExists(Long id) {
        return customerRepository.existsById(id);
    }
}
